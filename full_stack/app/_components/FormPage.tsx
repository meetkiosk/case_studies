"use client";

import { Box, Divider, Title } from "@mantine/core";
import { useState } from "react";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/_generated/prisma/client";
import { FormStepper } from "../form";
import { FormContent } from "./FormContent";
import { ExitAndSaveButton } from "./ExitAndSaveButton";

interface FormPageProps {
	formStructure: FormStructure;
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
}

export function FormPage({
	formStructure,
	formId,
	initialAnswers,
}: FormPageProps) {
	const lastCompleteSection = formStructure.sections.findIndex(
		(section) => !initialAnswers.has(section.id),
	);
	const [activeSection, setActiveSection] = useState(lastCompleteSection);
	const [answers, setAnswers] = useState(initialAnswers);

	const currentSection = formStructure.sections[activeSection];

	return (
		<>
			<Box
				component="header"
				pos="sticky"
				top={0}
				bg="var(--mantine-color-body)"
				py="md"
				className="z-[100] shadow-xs max-w-7xl mx-auto px-4 flex justify-between items-center"
			>
				<Title order={1}>{formStructure.formType.toUpperCase()}</Title>
				<ExitAndSaveButton
					formId={formId}
					answers={answers}
					currentSection={currentSection}
				/>
			</Box>

			<Box className="h-[calc(100vh-80px)] max-w-7xl mx-auto px-4 flex">
				<Box
					component="aside"
					w={{ base: "100%", md: "33.333%" }}
					pos="sticky"
					top={80}
					pt="md"
					className="h-[calc(100vh-80px)] overflow-y-auto"
				>
					<FormStepper
						structure={formStructure}
						formId={formId}
						initialAnswers={initialAnswers}
						onActiveSectionChange={setActiveSection}
						activeSection={activeSection}
						lastCompleteSection={lastCompleteSection}
					/>
				</Box>
				<Divider orientation="vertical" visibleFrom="md" />
				<Box
					component="main"
					w={{ base: "100%", md: "calc(66.667% - 1rem)" }}
					pl={{ base: 0, md: "xl" }}
					pt="md"
					className="h-[calc(100vh-80px)] overflow-y-auto"
				>
					<FormContent
						currentSection={currentSection}
						formId={formId}
						initialAnswers={initialAnswers}
						activeSection={activeSection}
						onActiveSectionChange={setActiveSection}
						onAnswersChange={setAnswers}
					/>
				</Box>
			</Box>
		</>
	);
}
