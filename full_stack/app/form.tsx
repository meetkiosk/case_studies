"use client";
import { useState } from "react";
import { Stepper } from "@mantine/core";

export const Form = () => {
	const [active, setActive] = useState(1);

	return (
		<Stepper active={active} onStepClick={setActive} orientation="vertical">
			<Stepper.Step label="Step 1" description="Create an account" />
			<Stepper.Step label="Step 2" description="Verify email" />
			<Stepper.Step label="Step 3" description="Get full access" />
		</Stepper>
	);
};
