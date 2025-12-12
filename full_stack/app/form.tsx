"use client";
import { useState } from "react";
import { Stepper } from "@mantine/core";
import type { FormStructure } from "@/lib/questions/schema";

interface FormProps {
	structure: FormStructure;
}

export const Form = ({ structure }: FormProps) => {
	const [active, setActive] = useState(0);

	return (
		<Stepper active={active} onStepClick={setActive} orientation="vertical">
			{structure.sections.map((section) => (
				<Stepper.Step
					key={section.id}
					label={section.labels.en}
					description={`${section.questions.length} question${section.questions.length !== 1 ? "s" : ""}`}
				>
					<div>
						{section.questions.map((question) => (
							<div key={question.id} className="mb-4">
								<label>{question.labels.en}</label>
								{/* TODO: Render appropriate input based on question.content */}
							</div>
						))}
					</div>
				</Stepper.Step>
			))}
		</Stepper>
	);
};
