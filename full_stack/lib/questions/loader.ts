import fs from "fs";
import path from "path";
import { formStructureSchema, type FormStructure } from "./schema";

export function loadQuestions(): FormStructure {
	const jsonPath = path.join(process.cwd(), "data", "questions.json");

	if (!fs.existsSync(jsonPath)) {
		throw new Error(
			"questions.json not found. Run 'npm run compile-questions' first.",
		);
	}

	const jsonContent = fs.readFileSync(jsonPath, "utf-8");
	const rawData = JSON.parse(jsonContent);

	return formStructureSchema.parse(rawData);
}
