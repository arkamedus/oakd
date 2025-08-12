import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import Icon, { IconStack } from "./Icon";
import Space from "../Atom/Space/Space";
import { CoreIconNameType, IconTypes } from "./Icons.bin";

const meta: Meta<typeof Icon> = {
	title: "Design System/Icon",
	component: Icon,
	argTypes: {
		name: {
			control: "select",
			options: IconTypes,
			defaultValue: "Trash",
			description: "Select the icon",
		},
		size: {
			control: "select",
			options: ["default", "small", "large"],
			defaultValue: "default",
			description: "Select the icon size",
		},
	},
};

export default meta;

const Template: StoryFn<typeof Icon> = (args) => <Icon {...args} />;

export const Default = Template.bind({});
Default.args = { name: "Trash", size: "default" };

export const Small = Template.bind({});
Small.args = { name: "Trash", size: "small" };

export const Large = Template.bind({});
Large.args = { name: "Trash", size: "large" };

export const Rotated = () => (
	<Space gap>
		<Icon name={"Angle"} rotation={0} size="default" />
		<Icon name={"Angle"} rotation={90} size="default" />
		<Icon name={"Angle"} rotation={180} size="default" />
		<Icon name={"Angle"} rotation={270} size="default" />
	</Space>
);

export const Spin = () => {
	return (
		<Space gap>
			<Icon name="Spinner" size="large" spin />
			<Icon name="Orbit" size="large" spin />
			<Icon name="Cog" size="large" spin />
			<Icon name="Refresh" size="large" spin />
		</Space>
	);
}; //Template.bind({});
export const Image = () => {
	return (
		<Space gap>
			<Icon name="Spinner" size="large" src={"https://placehold.co/400"} spin color={"blue"} />
			<Icon name="Spinner" size="large" src={"https://placehold.co/400"} spin preserveColor={true}/>
		</Space>
	);
}; //Template.bind({});
//Spin.args = { name: "Spinner", size: "large", style: { color: "red" }, spin:true };

export const Styled = Template.bind({});
Styled.args = { name: "Trash", size: "large", style: { color: "red" } };

export const GradientLinear = Template.bind({});
GradientLinear.args = {
	name: "Trash",
	size: "large",
	style: {
		background: "linear-gradient(to right, #ff7e5f, #feb47b)",
	},
	"data-gradient": true,
};

export const GradientRadial = Template.bind({});
GradientRadial.args = {
	name: "Trash",
	size: "large",
	style: {
		background: "radial-gradient(circle, #ff758c, #007eb3)",
	},
	"data-gradient": true,
};

export const Transparent = Template.bind({});
Transparent.args = {
	name: "Trash",
	size: "large",
	style: { opacity: 0.5 },
};

export const AllIcons = () => (
	<Space gap>
		{IconTypes.map((icon: CoreIconNameType) => (
			<Icon key={icon} name={icon} size="default" />
		))}
	</Space>
);

export const WithIconStack = () => (
	<Space direction="vertical" gap>
		<Space gap>
			<IconStack>
				<Icon name="Circle" size="small" />
				<Icon name="Check" size="small" style={{ color: "green" }} />
			</IconStack>
			<IconStack>
				<Icon name="Square" size="small" />
				<Icon name="X" size="small" style={{ color: "red" }} />
			</IconStack>
			<IconStack>
				<Icon name="User" size="small" />
				<Icon name="X" size="small" style={{ color: "red" }} />
			</IconStack>
		</Space>
		<Space gap>
			<IconStack>
				<Icon name="Square" size="large" />
				<Icon name="List" size="small" />
			</IconStack>

			<IconStack>
				<Icon name="Circle" size="large" />
				<Icon name="EmoteGrin" size="small" />
			</IconStack>
			<IconStack>
				<Icon name="Square" size="large" />
				<Icon name="Angle" size="small" style={{ color: "gray" }} />
			</IconStack>
			<IconStack>
				<Icon name="Folder" size="large" style={{ color: "grey" }} />
				<Icon name="X" size="large" style={{ color: "red" }} />
			</IconStack>
			<IconStack>
				<Icon name="CommentFrame" size="large" />
				<Icon name="User" size="small" style={{ color: "orange" }} />
			</IconStack>
			<IconStack>
				<Icon name="Circle" size="large" />
				<Icon name="Star" size="small" style={{ color: "blue" }} />
			</IconStack>
		</Space>
	</Space>
);
