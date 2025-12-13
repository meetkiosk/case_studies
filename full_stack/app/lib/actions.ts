"use server";

import { z } from "zod";
import { prisma } from "./prisma";
import { loadQuestions } from "@/lib/questions/loader";
import type { Prisma } from "@/app/generated/prisma/client";
import { FormType } from "@/app/generated/prisma/enums";
import { revalidatePath } from "next/cache";
import { Question } from "@/lib/questions/schema";

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

	throw new Error(`Unknown question type: ${questionType}`);
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
		throw new Error(`Form with id ${validated.formId} not found`);
	}

	const formStructure = loadQuestions();
	if (formStructure.formType !== form.formType) {
		throw new Error(
			`Form type mismatch: form has type "${form.formType}" but structure has type "${formStructure.formType}"`,
		);
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

export async function saveAnswer(
	formId: string,
	questionId: string,
	answer: unknown,
) {
	const validatedFormId = uuidSchema.parse(formId);

	const form = await prisma.form.findUnique({
		where: { id: validatedFormId },
	});

	if (!form) {
		throw new Error(`Form with id ${validatedFormId} not found`);
	}

	const formStructure = loadQuestions();
	if (formStructure.formType !== form.formType) {
		throw new Error(
			`Form type mismatch: form has type "${form.formType}" but structure has type "${formStructure.formType}"`,
		);
	}

	let question: Question | null = null;
	for (const section of formStructure.sections) {
		const found = section.questions.find((q) => q.id === questionId);
		if (found) {
			question = found;
			break;
		}
	}

	if (!question) {
		throw new Error(
			`Question with id "${questionId}" not found in form structure`,
		);
	}

	const validatedAnswer = validateAnswer(
		answer,
		question.type,
		question.enumValues,
	);

	await prisma.questionAnswer.upsert({
		where: {
			formId_questionId: {
				formId: validatedFormId,
				questionId,
			},
		},
		update: {
			answer: validatedAnswer,
		},
		create: {
			formId: validatedFormId,
			questionId,
			answer: validatedAnswer,
		},
	});

	await prisma.form.update({
		where: { id: validatedFormId },
		data: { updatedAt: new Date() },
	});

	revalidatePath(`/${validatedFormId}`);
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
