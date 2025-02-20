import React from "react";
import {Meta, StoryFn, StoryObj} from "@storybook/react";
import Button, {ButtonGroup} from "./Button";
import {ButtonType} from "./Button.types";
import {CoreComponentSizeType} from "../../Core/Core.types";
import Space from "../Space/Space";
import Paragraph from "../Paragraph/Paragraph";
import {CoreIconNameType, IconFolder} from "../../Icon/Icons.bin";
import Card from "../Card/Card";
import DebugLayer from "../DebugLayer/DebugLayer";

const meta: Meta<typeof Button> = {
	title: "Design System/Atomic/Button",
	component: Button,
	tags: ["!autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["default", "primary", "danger", "warning", "ghost", "disabled"],
			description: "Set the button type",
			defaultValue: "default",
		},
		size: {
			control: "select",
			options: ["default", "small", "large"],
			description: "Set the button size",
			defaultValue: "default",
		},
		disabled: {
			control: "boolean",
			description: "Disables the button",
		},
		onClick: {action: "clicked"},
	},
};
export default meta;

type Story = StoryObj<typeof Button>;

const Template: StoryFn<{
	type: ButtonType;
	size: CoreComponentSizeType;
	disabled: boolean;
	icon: CoreIconNameType;
	children: React.ReactNode;
}> = (args) => {
	const firstArgs = {...args};
	delete firstArgs.children;

	const middleArgs = {...args};
	delete middleArgs.icon;

	return (
		<Space gap direction="vertical">
			<Space gap>
				<Button {...firstArgs} />
				<Button {...middleArgs}>
					<Paragraph>{args.children || "Button"}</Paragraph>
				</Button>
				<Button icon={<IconFolder size="small"/>} {...middleArgs}>
					<Paragraph>{args.children || "Button"}</Paragraph>
				</Button>
				<Button icon={args.icon} {...args}>
					<Paragraph>{args.children || "Button"}</Paragraph>
				</Button>
				<Button icon={args.icon} {...args}>
					<Paragraph>
						<span>
							Button
							<br/>
							Two Lines
						</span>
					</Paragraph>
				</Button>
			</Space>

			<Space gap justify="stretch">
				<Button {...firstArgs} />
				<Button {...middleArgs}>
					<Paragraph>{args.children || "Button"}</Paragraph>
				</Button>
				<Button icon={args.icon} {...args}>
					<Paragraph>{args.children || "Button"}</Paragraph>
				</Button>
				<Button icon={args.icon} {...args}>
					<Paragraph>
						<span>
							Two lines make
							<br/>
							the others stretch
						</span>
					</Paragraph>
				</Button>
			</Space>
		</Space>
	);
};

export const Default: Story = Template.bind({});
Default.args = {
	type: "default",
	size: "default",
	disabled: false,
	icon: "Plus",
	children: "Button",
};


export const InButtonGroup = () => (
	<ButtonGroup>
		<Button icon={"Star"}></Button>
		<Button icon={"Magnify"}></Button>
		<Button icon={"Text"}><Paragraph>Text</Paragraph></Button>
		<Button icon={"Comment"}></Button>
	</ButtonGroup>
);

export const InVerticalButtonGroup = () => (
	<ButtonGroup direction={"vertical"}>
		<Button icon={"Star"}></Button>
		<Button icon={"Magnify"}></Button>
		<Button icon={"Text"}><Paragraph>Text</Paragraph></Button>
		<Button icon={"Comment"}></Button>
	</ButtonGroup>
);


export const Primary: Story = Template.bind({});
Primary.args = {
	type: "primary",
	icon: "Triangle",
	children: "Primary",
};

export const Danger: Story = Template.bind({});
Danger.args = {
	type: "danger",
	icon: "Triangle",
	children: "Danger",
};

export const Warning: Story = Template.bind({});
Warning.args = {
	type: "warning",
	icon: "Triangle",
	children: "Warning",
};

export const Ghost: Story = Template.bind({});
Ghost.args = {
	type: "ghost",
	icon: "Triangle",
	children: "Ghost",
};

export const Disabled: Story = Template.bind({});
Disabled.args = {
	type: "disabled",
	disabled: true,
	icon: "Folder",
	children: "Disabled",
};
