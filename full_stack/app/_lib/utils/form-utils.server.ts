"use server";

import type { Prisma } from "@/app/_generated/prisma/client";
import { z } from "zod";

export function validateAnswer(
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
