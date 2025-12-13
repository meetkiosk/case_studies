"use client";

import { Box, Card, Group, Progress, Stack, Text } from "@mantine/core";
import Link from "next/link";

interface FormCardProps {
	id: string;
	formType: string;
	completionPercentage: number;
	createdAt: Date;
	updatedAt: Date;
}

function getProgressMessage(percentage: number): string {
	if (percentage === 0) {
		return "Let's get started!";
	}
	if (percentage < 25) {
		return "Getting started...";
	}
	if (percentage < 50) {
		return "Making progress!";
	}
	if (percentage < 75) {
		return "Halfway there!";
	}
	if (percentage < 100) {
		return "Almost finished!";
	}
	return "Completed!";
}

export function FormCard({
	id,
	formType,
	completionPercentage,
	createdAt,
	updatedAt,
}: FormCardProps) {
	const progressMessage = getProgressMessage(completionPercentage);

	return (
		<Box component={Link} href={`/${id}`} td="none" c="inherit" display="block">
			<Card padding="lg" radius="md" withBorder h="100%">
				<Stack gap="sm">
					<Stack gap={4}>
						<Text size="sm" c="dimmed">
							{formType.toUpperCase()}
						</Text>
						<Text size="xs" c="dimmed">
							Created: {new Date(createdAt).toLocaleDateString()}
						</Text>
					</Stack>

					<Stack gap="xs">
						<Group justify="space-between" mb={4}>
							<Text fw={500}>{progressMessage}</Text>
							<Text fw={500}>{completionPercentage}%</Text>
						</Group>
						<Progress value={completionPercentage} size="sm" radius="xl" />
					</Stack>

					<Text size="xs" c="dimmed">
						Last updated: {new Date(updatedAt).toLocaleString()}
					</Text>
				</Stack>
			</Card>
		</Box>
	);
}
