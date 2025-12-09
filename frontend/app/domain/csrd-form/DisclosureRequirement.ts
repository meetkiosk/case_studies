import type { Question } from "./Question";

export interface DisclosureRequirement {
  readonly id: string;
  readonly questions: ReadonlyArray<Question>;
}
