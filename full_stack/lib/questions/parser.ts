import fs from "fs";
import { csvRowSchema, type CsvRow } from "./schema";

const HEADER_LINE = 1;
export const VALUES_SEPARATOR = ";";

export function parseCsvFile(filePath: string): CsvRow[] {
	const csvContent = fs.readFileSync(filePath, "utf-8");
	const lines = csvContent.split("\n").filter((line) => line.trim() !== "");
	const dataRows = lines.slice(HEADER_LINE);

	return dataRows.map((line, index) => {
		const values = line.split(VALUES_SEPARATOR);

		const rawRow = {
			id: values[0]?.trim() || "",
			labels: {
				en: values[1]?.trim() || "",
				fr: values[2]?.trim() || "",
			},
			content: values[3]?.trim() || "",
			relatedQuestionId: values[4]?.trim() || undefined,
			order: values[5]?.trim() || "0",
			unit: values[6]?.trim() || null,
			enumValues:
				values[7]?.trim() || values[8]?.trim()
					? {
							en: values[7]?.trim() || "",
							fr: values[8]?.trim() || "",
						}
					: undefined,
		};

		try {
			return csvRowSchema.parse(rawRow);
		} catch (error) {
			throw new Error(
				`Failed to parse CSV row ${index + 2}: ${error instanceof Error ? error.message : String(error)}`,
			);
		}
	});
}
