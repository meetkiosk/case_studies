import { VALUES_SEPARATOR } from "./parser";
import {
	formStructureSchema,
	type Question,
	type FormStructure,
} from "./schema";
import type { CsvRow } from "./schema";

export function transformToHierarchy(rows: CsvRow[]): FormStructure {
	const questionMap = new Map<CsvRow["id"], Question>();
	const rootQuestions: Question[] = [];

	rows.forEach((row) => {
		const question: Question = {
			id: row.id,
			labels: row.labels,
			content: row.content,
			order: row.order,
			unit: row.unit || null,
			relatedQuestionId: row.relatedQuestionId || null,
			enumValues:
				row.content === "enum" && row.enumValues
					? {
							en: row.enumValues.en
								.split(VALUES_SEPARATOR)
								.map((v) => v.trim())
								.filter(Boolean),
							fr: row.enumValues.fr
								.split(VALUES_SEPARATOR)
								.map((v) => v.trim())
								.filter(Boolean),
						}
					: undefined,
			children: [],
		};

		questionMap.set(row.id, question);
	});

	// Second pass: build hierarchy
	rows.forEach((row) => {
		const question = questionMap.get(row.id);
		if (!question) return;

		if (!row.relatedQuestionId) {
			rootQuestions.push(question);
		} else {
			const parent = questionMap.get(row.relatedQuestionId);
			if (parent) {
				if (!parent.children) parent.children = [];
				parent.children.push(question);
			} else {
				rootQuestions.push(question);
			}
		}
	});

	const sortByOrder = (questions: Question[]) => {
		questions.sort((a, b) => a.order - b.order);
		questions.forEach((q) => {
			if (q.children) sortByOrder(q.children);
		});
	};
	sortByOrder(rootQuestions);

	// Group into sections for stepper
	// Root questions with content="table" or empty become section headers
	// Their children become the questions in that section
	const sections = rootQuestions
		.filter((q) => q.content === "table" || q.content === "")
		.map((q) => ({
			id: q.id,
			labels: q.labels,
			order: q.order,
			questions: q.children || [],
		}))
		.sort((a, b) => a.order - b.order);

	const structure = { sections };

	return formStructureSchema.parse(structure);
}
