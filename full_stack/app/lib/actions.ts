"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { loadQuestions } from "@/lib/questions/loader";
import type { Prisma } from "@/app/generated/prisma/client";
import { FormType } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { Answer, answerSchema, Question } from "@/lib/questions/schema";

const DEFAULT_USER_ID = "default-user";

const uuidSchema = z.string().uuid("Invalid form ID format");
const formTypeEnumSchema = z.nativeEnum(FormType, {
	message: `Form type must be one of: ${Object.values(FormType).join(", ")}`,
});
const createFormSchema = z.object({
	formType: formTypeEnumSchema,
});
const getFormWithAnswersSchema = z.object({
	formId: uuidSchema,
});

function validateAnswer(
	answer: unknown,
	questionType: string,
	enumValues?: Record<string, string[]>,
): Prisma.InputJsonValue {
	if (questionType === "number") {
		const numSchema = z.number();
		const parsed = numSchema.parse(answer);
		return parsed;
	}

	if (questionType === "text") {
		const textSchema = z.string();
		const parsed = textSchema.parse(answer);
		return parsed;
	}

	if (questionType === "enum") {
		if (!enumValues) {
			throw new Error("Enum values are required for enum questions");
		}
		// Get all possible enum values (from any language)
		const allEnumValues = new Set<string>();
		Object.values(enumValues).forEach((values) => {
			values.forEach((val) => allEnumValues.add(val));
		});
		const enumSchema = z.string().refine((val) => allEnumValues.has(val), {
			message: `Answer must be one of: ${Array.from(allEnumValues).join(", ")}`,
		});
		const parsed = enumSchema.parse(answer);
		return parsed;
	}

	if (questionType === "table" || questionType === "") {
		throw new Error("Cannot save answer for table/header questions");
	}

	throw new Error("Unknown question type", { cause: questionType });
}

export async function createForm(formType: string) {
	const validated = createFormSchema.parse({ formType });

	const form = await prisma.form.create({
		data: {
			userId: DEFAULT_USER_ID,
			formType: validated.formType,
		},
	});

	return form.id;
}

export async function getFormWithAnswers(formId: string) {
	const validated = getFormWithAnswersSchema.parse({ formId });

	const form = await prisma.form.findUnique({
		where: { id: validated.formId },
		include: {
			answers: true,
		},
	});

	if (!form) {
		throw new Error("Form not found", { cause: validated.formId });
	}

	const formStructure = loadQuestions();
	if (formStructure.formType !== form.formType) {
		throw new Error("Form type mismatch", {
			cause: {
				formType: form.formType,
				structureType: formStructure.formType,
			},
		});
	}

	const answersMap = new Map<string, Prisma.JsonValue>();
	form.answers.forEach((answer) => {
		answersMap.set(answer.questionId, answer.answer);
	});

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const { answers: _, ...formWithoutAnswers } = form;

	return {
		form: formWithoutAnswers,
		answers: answersMap,
	};
}

const saveAnswersBatchSchema = z.object({
	formId: uuidSchema,
	answers: z.array(answerSchema),
});

export async function saveAnswersBatch(
	formId: string,
	answers: Array<Answer>,
	rootQuestionId?: string,
) {
	// !!!IMPORTANT:[cp] We should check server side the answers are all here before adding the root question. We also should validate the single values depending on their type.
	const answersToValidate = rootQuestionId
		? [
				...answers,
				{
					questionId: rootQuestionId,
					questionType: "table" as const,
					answer: { completed: true },
				},
			]
		: answers;
	const validated = saveAnswersBatchSchema.parse({
		formId,
		answers: answersToValidate,
	});

	const form = await prisma.form.findUnique({
		where: { id: validated.formId },
	});

	if (!form) {
		throw new Error("Form not found", { cause: validated.formId });
	}

	const formStructure = loadQuestions();
	if (formStructure.formType !== form.formType) {
		throw new Error("Form type mismatch", {
			cause: {
				formType: form.formType,
				structureType: formStructure.formType,
			},
		});
	}

	const questionMap = new Map<string, Question>();
	for (const section of formStructure.sections) {
		// Add the section (root question) itself to the map
		questionMap.set(section.id, {
			id: section.id,
			labels: section.labels,
			type: "table", // Root questions are table type
			order: section.order,
			unit: null,
			relatedQuestionId: null,
		});

		for (const question of section.questions) {
			questionMap.set(question.id, question);
		}
	}

	const upsertOperations = validated.answers.map(({ questionId, answer }) => {
		const question = questionMap.get(questionId);
		if (!question) {
			throw new Error("Question not found", { cause: questionId });
		}

		// For root questions (table type), we don't need to validate the answer structure
		// as it's just a completion marker
		const validatedAnswer =
			question.type === "table"
				? { completed: true }
				: validateAnswer(answer, question.type, question.enumValues);

		return prisma.questionAnswer.upsert({
			where: {
				formId_questionId: {
					formId: validated.formId,
					questionId,
				},
			},
			update: {
				answer: validatedAnswer,
			},
			create: {
				formId: validated.formId,
				questionId,
				answer: validatedAnswer,
			},
		});
	});

	await Promise.all(upsertOperations);

	await prisma.form.update({
		where: { id: validated.formId },
		data: { updatedAt: new Date() },
	});

	revalidatePath(`/${validated.formId}`);
}

export async function getAllForms() {
	const forms = await prisma.form.findMany({
		where: {
			userId: DEFAULT_USER_ID,
		},
		include: {
			answers: true,
		},
		orderBy: {
			updatedAt: "desc",
		},
	});

	const formStructure = loadQuestions();
	const totalSections = formStructure.sections.length;

	const formsWithCompletion = forms.map((form) => {
		const answersByQuestion = new Set(
			form.answers.map((answer) => answer.questionId),
		);

		const completedSections = formStructure.sections.filter((section) => {
			return section.questions.every((question) =>
				answersByQuestion.has(question.id),
			);
		}).length;

		const completionPercentage =
			totalSections > 0
				? Math.round((completedSections / totalSections) * 100)
				: 0;

		return {
			id: form.id,
			formType: form.formType,
			completionPercentage,
			createdAt: form.createdAt,
			updatedAt: form.updatedAt,
		};
	});

	return formsWithCompletion;
}
