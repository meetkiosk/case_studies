"use client";

import { Stack } from "@mantine/core";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/generated/prisma/client";
import { useState, useEffect, useRef } from "react";
import { saveAnswer } from "@/app/lib/actions";

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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [answers, _] = useState(initialAnswers);
	const prevActiveSectionRef = useRef(activeSection);

	const currentSection = structure.sections[activeSection];

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
			{currentSection.questions.map((question) => (
				<div key={question.id}>
					<label>{question.labels.en}</label>
					{/* TODO: Render appropriate input based on question.type */}
				</div>
			))}
		</Stack>
	);
}
