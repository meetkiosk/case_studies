import type { FormStructure, Question } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";

// [cp] this may be a doppione with full_stack/app/lib/actions.ts::validateAnswer
function hasValidAnswer(
	question: Question,
	answer: Prisma.JsonValue | undefined,
): boolean {
	if (question.type === "table") {
		return true; // this is the section title, we dont consider it
	}

	if (answer === undefined || answer === null) {
		return false;
	}

	switch (question.type) {
		case "number":
			return typeof answer === "number" && answer >= 0;
		case "text":
			return typeof answer === "string" && answer.trim().length > 0;
		case "enum":
			return typeof answer === "string" && answer.length > 0;
		default:
			return true;
	}
}

export function isSectionCompleted(
	section: FormStructure["sections"][number],
	answers: Map<string, Prisma.JsonValue>,
): boolean {
	return section.questions.every((question) =>
		hasValidAnswer(question, answers.get(question.id)),
	);
}
