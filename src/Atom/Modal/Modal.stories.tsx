import React, { useRef, useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Aspect from "../../Layout/Aspect/Aspect";
import Title from "../Title/Title";

const meta: Meta<typeof Modal> = {
	title: "Design System/Atomic/Modal",
	component: Modal,
};

export default meta;

type Story = StoryObj<typeof Modal>;

export const Default: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<Aspect ratio="21x9">
				<Space gap>
					<Button onClick={() => setOpen(true)}>
						<Paragraph>Open modal</Paragraph>
					</Button>
					<Modal
						open={open}
						title={
							<Paragraph>
								<strong>Quick details</strong>
							</Paragraph>
						}
						onClose={() => setOpen(false)}
					>
						<Space direction="vertical" gap>
							<Paragraph>
								Use a modal when someone needs to make a focused decision or
								review a small amount of information without leaving the page.
							</Paragraph>
							<Space gap justify="end" wide>
								<Button variant="ghost" onClick={() => setOpen(false)}>
									<Paragraph>Close</Paragraph>
								</Button>
							</Space>
						</Space>
					</Modal>
				</Space>
			</Aspect>
		);
	},
};

export const WithReviewFlow: Story = {
	render: () => {
		const [open, setOpen] = useState(false);

		return (
			<Aspect ratio="21x9">
				<Space gap>
					<Button variant="primary" onClick={() => setOpen(true)}>
						<Paragraph>Review draft</Paragraph>
					</Button>
					<Modal
						open={open}
						title={
							<Paragraph>
								<strong>Ready to share this update?</strong>
							</Paragraph>
						}
						onClose={() => setOpen(false)}
					>
						<Space direction="vertical" gap>
							<Paragraph>
								The weekly customer summary is complete and ready for the
								broader team.
							</Paragraph>
							<Paragraph>
								Once shared, everyone in the workspace will be able to review
								the notes, metrics, and follow-up items.
							</Paragraph>
							<Space gap justify="end" wide>
								<Button variant="ghost" onClick={() => setOpen(false)}>
									<Paragraph>Keep editing</Paragraph>
								</Button>
								<Button variant="primary" onClick={() => setOpen(false)}>
									<Paragraph>Share update</Paragraph>
								</Button>
							</Space>
						</Space>
					</Modal>
				</Space>
			</Aspect>
		);
	},
};

export const StructuredSlotsAndInitialFocus: Story = {
	render: () => {
		const Example = () => {
			const primaryAction = useRef<HTMLButtonElement>(null);
			return (
				<Modal
					open
					onClose={() => undefined}
					header={<Title size="small">Publish release</Title>}
					footer={
						<>
							<Button>
								<Paragraph>Review</Paragraph>
							</Button>
							<Button ref={primaryAction} variant="primary">
								<Paragraph>Publish</Paragraph>
							</Button>
						</>
					}
					size="lg"
					bodyScroll={false}
					dismissible={false}
					initialFocusRef={primaryAction}
				>
					<Space direction="vertical" gap>
						<Paragraph>The release notes are ready for publication.</Paragraph>
						<Paragraph>
							This non-dismissible flow owns explicit footer actions.
						</Paragraph>
					</Space>
				</Modal>
			);
		};
		return <Example />;
	},
};

export const SmallDismissible: Story = {
	args: {
		open: true,
		onClose: () => undefined,
		title: <Title size="small">Small confirmation</Title>,
		size: "sm",
		dismissible: true,
		closeButtonLabel: "Dismiss confirmation",
		children: <Paragraph>Compact modal content.</Paragraph>,
	},
};

export const ViewportScrollable: Story = {
	args: {
		open: true,
		onClose: () => undefined,
		title: <Title size="small">Viewport workspace</Title>,
		size: "viewport",
		bodyScroll: true,
		footer: (
			<Button variant="primary">
				<Paragraph>Done</Paragraph>
			</Button>
		),
		children: (
			<Space direction="vertical" gap>
				{Array.from({ length: 20 }, (_, index) => (
					<Paragraph key={index}>Scrollable section {index + 1}</Paragraph>
				))}
			</Space>
		),
	},
};
