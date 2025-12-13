"use client";

import { Box, Divider, Title } from "@mantine/core";
import { useState } from "react";
import type { FormStructure } from "@/lib/questions/schema";
import type { Prisma } from "@/app/generated/prisma/client";
import { FormStepper } from "../form";
import { FormContent } from "./FormContent";
import { ExitAndSaveButton } from "./ExitAndSaveButton";

interface FormPageClientProps {
	formStructure: FormStructure;
	formId: string;
	initialAnswers: Map<string, Prisma.JsonValue>;
}

export function FormPageClient({
	formStructure,
	formId,
	initialAnswers,
}: FormPageClientProps) {
	const [activeSection, setActiveSection] = useState(0);
	const [answers, setAnswers] = useState(initialAnswers);

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
				<ExitAndSaveButton formId={formId} answers={answers} />
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
						structure={formStructure}
						formId={formId}
						initialAnswers={initialAnswers}
						activeSection={activeSection}
						onAnswersChange={setAnswers}
					/>
				</Box>
			</Box>
		</>
	);
}
