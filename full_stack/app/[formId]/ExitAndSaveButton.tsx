"use client";

import { Button } from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { saveAnswer } from "@/app/lib/actions";
import type { Prisma } from "@/app/generated/prisma/client";

interface ExitAndSaveButtonProps {
	formId: string;
	answers: Map<string, Prisma.JsonValue>;
}

export function ExitAndSaveButton({ formId, answers }: ExitAndSaveButtonProps) {
	const router = useRouter();
	const [isSaving, setIsSaving] = useState(false);

	async function handleExitAndSave() {
		setIsSaving(true);
		for (const [questionId, answer] of answers.entries()) {
			await saveAnswer(formId, questionId, answer);
		}
		setIsSaving(false);
		router.push("/");
	}

	return (
		<Button variant="outline" onClick={handleExitAndSave} loading={isSaving}>
			Exit and Save
		</Button>
	);
}
