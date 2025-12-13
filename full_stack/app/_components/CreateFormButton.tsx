"use client";

import { Button } from "@mantine/core";
import { createForm } from "@/app/_lib/actions";
import { FormType } from "@/app/_generated/prisma/enums";
import { useRouter } from "next/navigation";

export function CreateFormButton() {
	const router = useRouter();

	async function handleClick() {
		const formId = await createForm(FormType.csrd);
		router.push(`/${formId}`);
	}

	return <Button onClick={handleClick}>Create new form</Button>;
}
