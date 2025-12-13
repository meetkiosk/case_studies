"use client";

import { Button, Stack, Title } from "@mantine/core";
import type { Answer, FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";
import { useState, useRef, useEffect } from "react";
import { saveAnswersBatch } from "@/app/_lib/actions";
import { QuestionField } from "./QuestionField";
import { isSectionCompleted } from "../_lib/utils/form-utils";

interface FormContentProps {
	currentSection: FormStructure["sections"][number];
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
	activeSection: number;
	onActiveSectionChange: (section: number) => void;
	onAnswersChange?: (answers: Map<string, Prisma.JsonValue>) => void;
}

export function FormContent({
	currentSection,
	formId,
	initialAnswers,
	activeSection,
	onActiveSectionChange,
	onAnswersChange,
}: FormContentProps) {
	const [answers, setAnswers] = useState(initialAnswers);
	const prevActiveSectionRef = useRef(activeSection);

	function handleAnswerChange(questionId: string, value: Prisma.JsonValue) {
		setAnswers((prev) => {
			const updated = new Map(prev);
			updated.set(questionId, value);
			return updated;
		});
	}

	useEffect(() => {
		onAnswersChange?.(answers);
	}, [answers, onAnswersChange]);

	async function handleSaveSection() {
		if (!currentSection || !isSectionCompleted(currentSection, answers)) return;

		// Collect all answers to save
		const answersToSave = currentSection.questions
			.map((question) => {
				const answer = answers.get(question.id);
				return answer != null
					? {
							questionId: question.id,
							answer: answer as unknown,
							questionType: question.type,
						}
					: null;
			})
			.filter(
				(item): item is Answer =>
					item !== null &&
					"questionType" in item &&
					"answer" in item &&
					"questionId" in item,
			);

		await saveAnswersBatch(formId, answersToSave, currentSection.id);

		onActiveSectionChange(activeSection + 1);
		prevActiveSectionRef.current = activeSection;
	}

	if (!currentSection) {
		return null;
	}

	return (
		<Stack gap="md">
			<Title order={2}>{currentSection.labels.en}</Title>
			{currentSection.questions.map((question) => (
				<QuestionField
					key={question.id}
					question={question}
					value={answers.get(question.id)}
					onChange={(value) => handleAnswerChange(question.id, value)}
				/>
			))}
			<Button
				disabled={!isSectionCompleted(currentSection, answers)}
				onClick={handleSaveSection}
			>
				Save section
			</Button>
		</Stack>
	);
}
