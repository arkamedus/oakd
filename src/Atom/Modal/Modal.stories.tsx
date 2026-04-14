import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Aspect from "../../Layout/Aspect/Aspect";
import Title from "../Title/Title";
import Content from "../../Layout/Content/Content";

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
					<Button onClick={() => setOpen(true)}>Open modal</Button>
					<Modal
						visible={open}
						title={
							<Paragraph>
								<strong>Quick details</strong>
							</Paragraph>
						}
						onClose={() => setOpen(false)}
					>
						<Content pad>
							<Space direction="vertical" gap>
								<Paragraph>
									Use a modal when someone needs to make a focused decision or
									review a small amount of information without leaving the page.
								</Paragraph>
								<Space gap justify="end" wide>
									<Button variant="ghost" onClick={() => setOpen(false)}>
										Close
									</Button>
								</Space>
							</Space>
						</Content>
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
						Review draft
					</Button>
					<Modal
						visible={open}
						title={
							<Paragraph>
								<strong>Ready to share this update?</strong>
							</Paragraph>
						}
						onClose={() => setOpen(false)}
					>
						<Content pad>
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
										Keep editing
									</Button>
									<Button variant="primary" onClick={() => setOpen(false)}>
										Share update
									</Button>
								</Space>
							</Space>
						</Content>
					</Modal>
				</Space>
			</Aspect>
		);
	},
};
