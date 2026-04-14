import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Input from "./Input";
import { InputProps } from "./Input.types";
import Space from "../Space/Space";
import { IconMagnify } from "../../Icon/Icons.bin";
import Button from "../Button/Button";

const meta: Meta<typeof Input> = {
	title: "Design System/Atomic/Input",
	component: Input,
	tags: ["!autodocs"],
	argTypes: {
		type: {
			control: "select",
			options: ["text", "password", "email", "number"],
			description: "Set the input type",
			defaultValue: "text",
		},
		size: {
			control: "select",
			options: ["small", "default", "large"],
			description: "Set the input size",
			defaultValue: "default",
		},
		disabled: {
			control: "boolean",
			description: "Disables the input",
		},
		error: {
			control: "boolean",
			description: "Displays an error state",
		},
		variant: {
			control: "select",
			options: ["default", "primary", "danger", "warning", "ghost", "disabled"],
			description: "Set the input container variant",
			defaultValue: "default",
		},
		onChange: {
			action: "changed",
			description: "Called when the input value changes",
			table: { category: "Events" },
		},
		onFocus: {
			action: "focused",
			description: "Called when the input receives focus",
			table: { category: "Events" },
		},
		onBlur: {
			action: "blurred",
			description: "Called when the input loses focus",
			table: { category: "Events" },
		},
		onKeyDown: {
			action: "keyDown",
			description: "Called when a key is pressed down while focused",
			table: { category: "Events" },
		},
		onKeyUp: {
			action: "keyUp",
			description: "Called when a key is released while focused",
			table: { category: "Events" },
		},
		onKeyPress: {
			action: "keyPress",
			description: "Legacy keypress handler supported for compatibility",
			table: { category: "Events" },
		},
	},
};

export default meta;

const Template: StoryFn<InputProps> = (args) => (
	<Space direction="vertical" gap>
		<Input {...args} />
	</Space>
);

export const Default = Template.bind({});
Default.args = { type: "text", placeholder: "Enter text..." };

export const Password = Template.bind({});
Password.args = { type: "password", placeholder: "Enter password..." };

export const Email = Template.bind({});
Email.args = { type: "email", placeholder: "Enter email..." };

export const WithIcon = Template.bind({});
WithIcon.args = {
	type: "text",
	placeholder: "Search...",
	icon: <IconMagnify size="small" />,
};

export const WithError = Template.bind({});
WithError.args = {
	type: "text",
	placeholder: "Invalid input",
	error: true,
	icon: "Apps",
};

export const Disabled = Template.bind({});
Disabled.args = {
	type: "text",
	placeholder: "Disabled input",
	disabled: true,
	icon: "Folder",
};

export const RefFocusTest: StoryFn<InputProps> = (args) => {
	const inputRef = React.useRef<HTMLInputElement>(null);

	const handleFocusClick = () => {
		inputRef.current?.focus();
	};

	return (
		<Space direction="vertical" gap>
			<Input
				{...args}
				ref={inputRef}
				placeholder="Click the button to focus me..."
			/>
			<Button variant={"default"} onClick={handleFocusClick}>
				Focus Input
			</Button>
		</Space>
	);
};

RefFocusTest.args = {
	type: "text",
	placeholder: "Ref test input",
};
