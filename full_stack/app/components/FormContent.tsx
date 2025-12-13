"use client";

import { Button, Stack, Title } from "@mantine/core";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/generated/prisma/client";
import { useState, useEffect, useRef } from "react";
import { saveAnswer } from "@/app/lib/actions";
import { QuestionField } from "./QuestionField";

interface FormContentProps {
	structure: FormStructure;
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
	activeSection: number;
	onAnswersChange?: (answers: Map<string, Prisma.JsonValue>) => void;
}

export function FormContent({
	structure,
	formId,
	initialAnswers,
	activeSection,
	onAnswersChange,
}: FormContentProps) {
	const [answers, setAnswers] = useState(initialAnswers);
	const prevActiveSectionRef = useRef(activeSection);

	const currentSection = structure.sections[activeSection];

	function handleAnswerChange(questionId: string, value: Prisma.JsonValue) {
		setAnswers((prev) => {
			const updated = new Map(prev);
			updated.set(questionId, value);
			return updated;
		});
	}

	async function handleSaveSection() {
		if (!currentSection) return;

		for (const question of currentSection.questions) {
			const answer = answers.get(question.id);
			if (answer != null) {
				await saveAnswer(formId, question.id, answer);
			}
		}
	}

	useEffect(() => {
		if (
			prevActiveSectionRef.current !== activeSection &&
			prevActiveSectionRef.current >= 0
		) {
			const previousSection = structure.sections[prevActiveSectionRef.current];
			async function savePreviousSection() {
				for (const question of previousSection.questions) {
					const answer = answers.get(question.id);
					if (answer != null) {
						await saveAnswer(formId, question.id, answer);
					}
				}
			}
			savePreviousSection();
			prevActiveSectionRef.current = activeSection;
		}
	}, [activeSection, formId, structure, answers]);

	useEffect(() => {
		onAnswersChange?.(answers);
	}, [answers, onAnswersChange]);

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
			<Button onClick={handleSaveSection}>Save section</Button>
		</Stack>
	);
}
