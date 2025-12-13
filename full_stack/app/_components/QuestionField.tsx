"use client";

import { NumberInput, Select, Text, Textarea, TextInput } from "@mantine/core";
import type { Question } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";

interface QuestionFieldProps {
	question: Question;
	value: Prisma.JsonValue | undefined;
	onChange: (value: Prisma.JsonValue) => void;
}

export function QuestionField({
	question,
	value,
	onChange,
}: QuestionFieldProps) {
	// Empty type and Table type questions are section titles/headers, no input needed
	if (question.type === "" || question.type === "table") {
		return (
			<Text size="lg" fw={500}>
				{question.labels.en}
			</Text>
		);
	}

	const label = question.unit
		? `${question.labels.en} (${question.unit})`
		: question.labels.en;

	switch (question.type) {
		case "number": {
			const numValue = typeof value === "number" ? value : undefined;
			return (
				<NumberInput
					label={label}
					value={numValue}
					onChange={(val) => onChange(val ?? null)}
					min={0}
					required
				/>
			);
		}

		case "text": {
			const textValue = typeof value === "string" ? value : "";
			return (
				<Textarea
					label={label}
					value={textValue}
					onChange={(e) => onChange(e.target.value)}
					minRows={3}
					autosize
					required
				/>
			);
		}

		case "enum": {
			const enumValue = typeof value === "string" ? value : null;
			const options =
				question.enumValues?.en.map((val, index) => ({
					value: val,
					label: question.enumValues?.fr?.[index] || val,
				})) || [];

			return (
				<Select
					label={label}
					value={enumValue}
					onChange={(val) => onChange(val ?? null)}
					data={options}
					searchable
					required
				/>
			);
		}

		default:
			return (
				<TextInput
					label={label}
					value={typeof value === "string" ? value : ""}
					onChange={(e) => onChange(e.target.value)}
					required
				/>
			);
	}
}
