"use client";

import { Button, Modal, Stack, Text } from "@mantine/core";
import { useRouter } from "next/navigation";

interface CongratulationsModalProps {
	opened: boolean;
	onClose: () => void;
}

export function CongratulationsModal({
	opened,
	onClose,
}: CongratulationsModalProps) {
	const router = useRouter();

	function handleClose() {
		onClose();
		router.push("/");
	}

	return (
		<Modal
			opened={opened}
			onClose={handleClose}
			title="🎉 Congratulations!"
			centered
			closeOnClickOutside={false}
			closeOnEscape={false}
		>
			<Stack gap="md">
				<Text size="lg" fw={500} ta="center">
					You&rsquo;ve completed the form!
				</Text>
				<Text ta="center" c="dimmed">
					Thank you for taking the time to fill out all sections. Your responses
					have been saved successfully.
				</Text>
				<Button onClick={handleClose} fullWidth>
					Back to Forms
				</Button>
			</Stack>
		</Modal>
	);
}
