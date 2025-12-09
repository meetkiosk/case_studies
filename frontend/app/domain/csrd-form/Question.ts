export type QuestionType = "table" | "number" | "enum" | "text" | "section";

export interface Question {
  readonly id: string;
  readonly kioskId: string;
  readonly labelEn: string;
  readonly labelFr: string;
  readonly type: QuestionType;
  readonly order: number;
  readonly relatedQuestionId: string | null;
  readonly unit: string | null;
  readonly enumValues?: {
    readonly en: ReadonlyArray<string>;
    readonly fr: ReadonlyArray<string>;
  };
  readonly relatedQuestions?: ReadonlyArray<Question>;
}
