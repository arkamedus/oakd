import React, { useState } from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Modal } from "./Modal";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import Button from "../Button/Button";
import Aspect from "../../Layout/Aspect/Aspect";

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
		title={<Paragraph>Modal Title</Paragraph>}
		onClose={() => setOpen(false)}
	>
		<Space direction="vertical" gap>
			<Paragraph>Some content inside the modal.</Paragraph>
			<Paragraph>More content can go here.</Paragraph>
		</Space>
	</Modal>
);

export const Default = () => {
	const [open, setOpen] = useState(false);
	return (
		<Aspect ratio={"21x9"}>
			<Space gap>
				<Button icon={"Share"} type="primary" onClick={() => setOpen(true)}>
					<Paragraph>Open Modal</Paragraph>
				</Button>
				<Template open={open} setOpen={setOpen} />
			</Space>
		</Aspect>
	);
};
