import fs from "fs";
import path from "path";

interface Question {
  id: string;
  kioskId: string;
  labelEn: string;
  labelFr: string;
  type: "table" | "number" | "enum" | "text" | "section";
  order: number;
  relatedQuestionId: string | null;
  unit: string | null;
  enumValues?: {
    en: string[];
    fr: string[];
  };
  relatedQuestions?: Question[];
}

interface DisclosureRequirement {
  id: string;
  questions: Question[];
}

// Read the CSV file
const csvPath = path.join(process.cwd(), "S1-6.csv");
const csvContent = fs.readFileSync(csvPath, "utf-8");

// Parse CSV (semicolon-separated)
const lines = csvContent.split("\n").filter((line) => line.trim() !== "");

// Skip the header row
const dataRows = lines.slice(1);

// Parse each row into a question object
const questions: Question[] = dataRows.map((line) => {
  const values = line.split(";");

  const id = values[0]?.trim() || "";
  const labelEn = values[1]?.trim() || "";
  const labelFr = values[2]?.trim() || "";
  const content = values[3]?.trim() || "";
  const relatedQuestionId = values[4]?.trim() || null;
  const order = parseInt(values[5]?.trim() || "0", 10);
  const unit = values[6]?.trim() || null;
  const enumEn = values[7]?.trim() || "";
  const enumFr = values[8]?.trim() || "";

  // Map content to type (lowercase), treat empty as "section"
  const type = content
    ? (content.toLowerCase() as "table" | "number" | "enum" | "text" | "section")
    : "section";

  const question: Question = {
    id,
    kioskId: id,
    labelEn,
    labelFr,
    type,
    order,
    relatedQuestionId: relatedQuestionId || null,
    unit: unit || null,
  };

  // Add enumValues if type is enum
  if (type === "enum" && enumEn && enumFr) {
    question.enumValues = {
      en: enumEn.split(",").map((v) => v.trim()),
      fr: enumFr.split(",").map((v) => v.trim()),
    };
  }

  return question;
});

// Build the tree structure
const questionMap = new Map<string, Question>();
questions.forEach((q) => {
  questionMap.set(q.kioskId, { ...q });
});

const rootQuestions: Question[] = [];
const processedQuestions = new Set<string>();

questions.forEach((question) => {
  const q = questionMap.get(question.kioskId);
  if (!q) return;

  // If this question has a relatedQuestionId, it should be nested under that question
  if (q.relatedQuestionId) {
    const parentQuestion = questionMap.get(q.relatedQuestionId);
    if (parentQuestion) {
      if (!parentQuestion.relatedQuestions) {
        parentQuestion.relatedQuestions = [];
      }
      parentQuestion.relatedQuestions.push(q);
      processedQuestions.add(q.kioskId);
    }
  }
});

// Add all questions that are not nested under any other question to the root
questions.forEach((question) => {
  if (!processedQuestions.has(question.kioskId)) {
    const q = questionMap.get(question.kioskId);
    if (q) {
      rootQuestions.push(q);
    }
  }
});

// Sort root questions by order
rootQuestions.sort((a, b) => a.order - b.order);

// Sort nested questions by order as well
const sortNestedQuestions = (q: Question): void => {
  if (q.relatedQuestions) {
    q.relatedQuestions.sort((a, b) => a.order - b.order);
    q.relatedQuestions.forEach(sortNestedQuestions);
  }
};

rootQuestions.forEach(sortNestedQuestions);

// Create the disclosure requirement object
const disclosureRequirement: DisclosureRequirement = {
  id: "S1-6",
  questions: rootQuestions,
};

// Write the JSON file
const jsonPath = path.join(process.cwd(), "app/data/disclosure-requirement.json");
fs.writeFileSync(jsonPath, JSON.stringify(disclosureRequirement, null, 2));

console.log("✅ Successfully parsed CSV and generated disclosure-requirement.json");
console.log(`   - Total root questions: ${rootQuestions.length}`);
console.log(`   - Total nested questions: ${processedQuestions.size}`);
console.log(`   - Total questions: ${questions.length}`);
