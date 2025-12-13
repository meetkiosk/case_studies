import type { Metadata } from "next";
import "@mantine/core/styles.css";
import "./globals.css";

import {
	ColorSchemeScript,
	MantineProvider,
	mantineHtmlProps,
} from "@mantine/core";

export const metadata: Metadata = {
	title: "Case Study",
	description: "Case Study",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" {...mantineHtmlProps}>
			<head>
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider defaultColorScheme="light">{children}</MantineProvider>
			</body>
		</html>
	);
}
