"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAnswersBatch } from "@/app/lib/actions";
import type { Answer, FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/generated/prisma/client";

interface ExitAndSaveButtonProps {
	formId: string;
	answers: Map<string, Prisma.JsonValue>;
	currentSection: FormStructure["sections"][number];
}

export function ExitAndSaveButton({
	formId,
	answers,
	currentSection,
}: ExitAndSaveButtonProps) {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	async function handleExitAndSave() {
		setIsSaving(true);
		try {
			const answersToSave: Answer[] = [];
			for (const [questionId, answer] of answers.entries()) {
				const question = currentSection.questions.find(
					(question) => question.id === questionId,
				);
				// we dont validate sections when we leave the form
				if (question && question.type !== "" && question.type !== "table") {
					answersToSave.push({
						questionId,
						questionType: question.type,
						answer: answer as unknown,
					});
				}
			}
			if (answersToSave.length > 0) {
				await saveAnswersBatch(formId, answersToSave);
			}
		} finally {
			setIsSaving(false);
			router.push("/");
		}
	}

	return (
		<Button variant="outline" onClick={handleExitAndSave} loading={isSaving}>
			Exit and Save
		</Button>
	);
}
