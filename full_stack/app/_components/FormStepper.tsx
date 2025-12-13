"use client";
import { Stepper } from "@mantine/core";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";
import { getLang } from "../_lib/utils/lang";

interface FormStepperProps {
	structure: FormStructure;
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
	onActiveSectionChange?: (section: number) => void;
	activeSection: number;
	lastCompleteSection: number;
}

export const FormStepper = ({
	structure,
	onActiveSectionChange,
	activeSection,
	lastCompleteSection,
}: FormStepperProps) => {
	const isFormCompleted = lastCompleteSection === -1;

	function handleStepClick(step: number) {
		if (isFormCompleted && step > lastCompleteSection) {
			return;
		}
		onActiveSectionChange?.(step);
	}
	const shouldAllowStepSelect = (step: number) => {
		return isFormCompleted || step <= lastCompleteSection;
	};

	return (
		<Stepper
			active={activeSection}
			onStepClick={handleStepClick}
			orientation="vertical"
		>
			{structure.sections.map((section, index) => (
				<Stepper.Step
					key={section.id}
					label={section.labels[getLang()]}
					description={`${section.questions.length} question${section.questions.length !== 1 ? "s" : ""}`}
					allowStepSelect={shouldAllowStepSelect(index)}
				/>
			))}
		</Stepper>
	);
};
