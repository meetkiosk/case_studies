"use client";

import {
	ActionIcon,
	Box,
	Button,
	Group,
	Modal,
	Stack,
	Text,
} from "@mantine/core";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { deleteForm } from "@/app/_lib/actions";

interface DeleteFormButtonProps {
	formId: string;
}

export function DeleteFormButton({ formId }: DeleteFormButtonProps) {
	const router = useRouter();
	const [deleteModalOpen, setDeleteModalOpen] = useState(false);
	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {
		setIsDeleting(true);
		try {
			await deleteForm(formId);
			setDeleteModalOpen(false);
			router.refresh();
		} catch (error) {
			console.error("Failed to delete form:", error);
			// TODO: Add error notification
		} finally {
			setIsDeleting(false);
		}
	}

	return (
		<>
			<Box pos="absolute" top={8} right={8} style={{ zIndex: 10 }}>
				<ActionIcon
					variant="subtle"
					color="red"
					size="sm"
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setDeleteModalOpen(true);
					}}
					aria-label="Delete form"
				>
					×
				</ActionIcon>
			</Box>
			<Modal
				opened={deleteModalOpen}
				onClose={() => setDeleteModalOpen(false)}
				title="Delete Form"
				centered
			>
				<Stack gap="md">
					<Text>
						Are you sure you want to delete this form? This action cannot be
						undone.
					</Text>
					<Group justify="flex-end">
						<Button
							variant="subtle"
							onClick={() => setDeleteModalOpen(false)}
							disabled={isDeleting}
						>
							Cancel
						</Button>
						<Button
							variant="filled"
							color="red"
							onClick={handleDelete}
							loading={isDeleting}
						>
							Delete
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
}
