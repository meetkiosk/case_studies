import { Form } from "./form";
import { loadQuestions } from "@/lib/questions/loader";

export default async function Home() {
	const formStructure = loadQuestions();

	return (
		<main>
			<Form structure={formStructure} />
		</main>
	);
}
