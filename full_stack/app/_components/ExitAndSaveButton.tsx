"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { saveAnswersBatch } from "@/app/_lib/actions";
import type { Answer, FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";

interface ExitAndSaveButtonProps {
	formId: string;
	answers: Map<string, Prisma.JsonValue>;
	allSections: FormStructure["sections"];
}

export function ExitAndSaveButton({
	formId,
	answers,
	allSections,
}: ExitAndSaveButtonProps) {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	// Build a map of questionId -> questionType for efficient lookup
	const questionTypeMap = useMemo(() => {
		const map = new Map<string, Answer["questionType"]>();
		for (const section of allSections) {
			// Add section (root question) as table type
			map.set(section.id, "table");
			// Add all questions in the section
			for (const question of section.questions) {
				map.set(question.id, question.type);
			}
		}
		return map;
	}, [allSections]);

	async function handleExitAndSave() {
		setIsSaving(true);
		try {
			const answersToSave: Answer[] = [];
			for (const [questionId, answer] of answers.entries()) {
				const questionType = questionTypeMap.get(questionId);
				// we dont validate sections when we leave the form
				if (questionType && questionType !== "table") {
					answersToSave.push({
						questionId,
						questionType,
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
