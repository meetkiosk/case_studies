import { getFormWithAnswers } from "@/app/lib/actions";
import { loadQuestions } from "@/lib/questions/loader";
import { notFound } from "next/navigation";
import { FormPage } from "../components/FormPage";

interface FormPageProps {
	params: Promise<{ formId: string }>;
}

export default async function SingleFormPage({ params }: FormPageProps) {
	const { formId } = await params;

	const formStructure = loadQuestions();

	let form;
	let answers;
	try {
		const result = await getFormWithAnswers(formId);
		form = result.form;
		answers = result.answers;
		if (formStructure.formType !== form.formType) {
			throw new Error("Form type mismatch", {
				cause: {
					formType: form.formType,
					structureType: formStructure.formType,
				},
			});
		}
	} catch {
		notFound();
	}

	return (
		<FormPage
			formStructure={formStructure}
			formId={formId}
			initialAnswers={answers}
		/>
	);
}
