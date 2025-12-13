import fs from "fs";
import path from "path";
import { parseCsvFile } from "../lib/questions/parser";
import { transformToHierarchy } from "../lib/questions/transformer";

const csvPath = path.join(process.cwd(), "questions.csv");
const outputPath = path.join(process.cwd(), "data", "questions.json");

const dataDir = path.dirname(outputPath);
if (!fs.existsSync(dataDir)) {
	fs.mkdirSync(dataDir, { recursive: true });
}

try {
	const rows = parseCsvFile(csvPath);
	const structure = transformToHierarchy(rows);

	const output = {
		formType: "csrd",
		sections: structure.sections,
	};

	fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), "utf-8");

	console.info(`✅ Compiled ${rows.length} questions into ${outputPath}`);
} catch (error) {
	console.error("❌ Failed to compile questions:", error);
	process.exit(1);
}
