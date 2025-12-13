"use client";

import { Button, Stack, Title } from "@mantine/core";
import type { Answer, FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";
import { useState, useRef, useEffect } from "react";
import { saveAnswersBatch } from "@/app/_lib/actions";
import { QuestionField } from "./QuestionField";
import { isSectionCompleted } from "../_lib/utils/form-utils";
import { CongratulationsModal } from "./CongratulationsModal";
import party from "party-js";
import { useRouter } from "next/navigation";

interface FormContentProps {
	currentSection: FormStructure["sections"][number];
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
	activeSection: number;
	totalSections: number;
	onActiveSectionChange: (section: number) => void;
	onAnswersChange?: (answers: Map<string, Prisma.JsonValue>) => void;
}

export function FormContent({
	currentSection,
	formId,
	initialAnswers,
	activeSection,
	totalSections,
	onActiveSectionChange,
	onAnswersChange,
}: FormContentProps) {
	const [answers, setAnswers] = useState(initialAnswers);
	const [showCongratulations, setShowCongratulations] = useState(false);
	const prevActiveSectionRef = useRef(activeSection);
	const router = useRouter();
	const saveButtonRef = useRef<HTMLButtonElement>(null);

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

	async function handleSaveSection(
		event?: React.MouseEvent<HTMLButtonElement>,
	) {
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

		const isLastSection = activeSection === totalSections - 1;

		if (isLastSection) {
			// Show confetti from multiple sources for a better effect
			const confettiTarget =
				event?.currentTarget || saveButtonRef.current || document.body;

			party.confetti(confettiTarget, {
				count: party.variation.range(50, 100),
				size: party.variation.range(0.8, 1.2),
			});
			party.confetti(document.body, {
				count: party.variation.range(100, 150),
				size: party.variation.range(0.8, 1.5),
			});

			// Show congratulations modal
			setShowCongratulations(true);
		} else {
			onActiveSectionChange(activeSection + 1);
			prevActiveSectionRef.current = activeSection;
		}
	}

	function handleCloseCongratulations() {
		setShowCongratulations(false);
		router.push("/");
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
				ref={saveButtonRef}
				className="max-w-40"
				disabled={!isSectionCompleted(currentSection, answers)}
				onClick={handleSaveSection}
			>
				Save section
			</Button>
			<CongratulationsModal
				opened={showCongratulations}
				onClose={handleCloseCongratulations}
			/>
		</Stack>
	);
}
