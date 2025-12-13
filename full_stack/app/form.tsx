"use client";
import { useState } from "react";
import { Stepper } from "@mantine/core";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/generated/prisma/client";

interface FormStepperProps {
	structure: FormStructure;
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
	onActiveSectionChange?: (section: number) => void;
}

export const FormStepper = ({
	structure,
	onActiveSectionChange,
}: FormStepperProps) => {
	const [active, setActive] = useState(0);

	function handleStepClick(step: number) {
		setActive(step);
		onActiveSectionChange?.(step);
	}

	return (
		<Stepper
			active={active}
			onStepClick={handleStepClick}
			orientation="vertical"
		>
			{structure.sections.map((section) => (
				<Stepper.Step
					key={section.id}
					label={section.labels.en}
					description={`${section.questions.length} question${section.questions.length !== 1 ? "s" : ""}`}
				/>
			))}
		</Stepper>
	);
};
