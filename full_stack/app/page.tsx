import { getAllForms } from "@/app/lib/actions";
import {
	Card,
	Container,
	Flex,
	Grid,
	GridCol,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CreateFormButton } from "./components/CreateFormButton";
import { FormCard } from "./components/FormCard";

export default async function Home() {
	const forms = await getAllForms();

	return (
		<Container size="xl" py="xl">
			<Stack gap="xl">
				<Flex justify="space-between" align="center">
					<Title order={1}>Forms</Title>
					<CreateFormButton />
				</Flex>

				{forms.length === 0 ? (
					<Card padding="xl" radius="md" withBorder>
						<Text c="dimmed" ta="center">
							No forms yet. Create your first form to get started.
						</Text>
					</Card>
				) : (
					<Grid>
						{forms.map((form) => (
							<GridCol key={form.id} span={{ base: 12, sm: 6, md: 4 }}>
								<FormCard
									id={form.id}
									formType={form.formType}
									completionPercentage={form.completionPercentage}
									createdAt={form.createdAt}
									updatedAt={form.updatedAt}
								/>
							</GridCol>
						))}
					</Grid>
				)}
			</Stack>
		</Container>
	);
}
