import { z } from "zod";

const typeSchema = z.preprocess(
	(val) => (typeof val === "string" ? val.trim().toLowerCase() : val),
	z.enum(["number", "text", "enum", "table", ""]),
);

const unitsSchema = z.enum(["%", "€", "hours"]);
type Unit = z.infer<typeof unitsSchema>;

export const languageSchema = z.enum(["en", "fr"]);
export type Language = z.infer<typeof languageSchema>;
export const translationsSchema = z.record(languageSchema, z.string());

const baseQuestionSchema = z.object({
	id: z.string().min(1),
	labels: translationsSchema,
	type: typeSchema,
	unit: unitsSchema.nullable(),
});

export const csvRowSchema = baseQuestionSchema.extend({
	relatedQuestionId: z.string().optional(),
	order: z.coerce.number().int().min(0),
	enumValues: z.record(languageSchema, z.string()).optional(),
});

// Define Question type manually for recursive schema
export type Question = {
	id: string;
	labels: Record<Language, string>;
	type: z.infer<typeof typeSchema>;
	order: number;
	unit: Unit | null;
	enumValues?: Record<Language, string[]>;
	relatedQuestionId: string | null;
	children?: Question[];
};

// Define question schema with lazy recursion for children
// Using z.ZodType<Question> to explicitly type the schema
export const questionSchema: z.ZodType<Question> = z.lazy(() =>
	baseQuestionSchema.extend({
		order: z.number(),
		enumValues: z.record(languageSchema, z.array(z.string())).optional(),
		relatedQuestionId: z.string().nullable(),
		children: z.array(questionSchema).optional(),
	}),
);

export const answerSchema = z.object({
	questionId: z.string().min(1),
	questionType: typeSchema,
	answer: z.unknown(),
});
export type Answer = z.infer<typeof answerSchema>;

export const formStructureSchema = z.object({
	formType: z.string(),
	sections: z.array(
		z.object({
			id: z.string(),
			labels: translationsSchema,
			order: z.number(),
			questions: z.array(questionSchema),
		}),
	),
});

export type CsvRow = z.infer<typeof csvRowSchema>;
export type FormStructure = z.infer<typeof formStructureSchema>;
