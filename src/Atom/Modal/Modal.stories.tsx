import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Modal } from "./Modal";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";

const meta: Meta<typeof Modal> = {
	title: "Design System/Atomic/Modal",
	component: Modal,
	argTypes: {},
};
export default meta;

const Template: StoryFn<{
	open: boolean;
	setOpen: (open: boolean) => void;
}> = ({ open, setOpen }) => (
	<Modal
		visible={open}
		title="Modal Title"
		content={
			<Space direction="vertical" gap>
				<Paragraph>Some content inside the modal.</Paragraph>
				<Paragraph>More content can go here.</Paragraph>
			</Space>
		}
		onClose={() => setOpen(false)}
	/>
);

export const Default = () => {
	const [open, setOpen] = useState(false);
	return (
		<Space gap>
			<Button type="primary" onClick={() => setOpen(true)}>
				Open Modal
			</Button>
			<Template open={open} setOpen={setOpen} />
		</Space>
	);
};
