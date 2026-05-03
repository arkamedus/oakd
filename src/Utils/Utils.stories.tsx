import React from "react";
import { Meta, StoryObj } from "@storybook/react";
import Card from "../Atom/Card/Card";
import Space from "../Atom/Space/Space";
import Paragraph from "../Atom/Paragraph/Paragraph";
import { Vec2 } from "./Vec2";
import { Vec3 } from "./Vec3";
import { createOakMCube, oakMToMeshData } from "./OakM";

const meta: Meta = {
	title: "Design System/Utilities/Math",
};

export default meta;
type Story = StoryObj;

export const Vec2Vec3AndOakM: Story = {
	render: () => {
		const vec2 = new Vec2().set(4, 3);
		const vec3 = new Vec3().set(2, 3, 6).normalize();
		const mesh = oakMToMeshData(
			createOakMCube("utils-cube", {
				material: 2,
				color: { r: 0.9, g: 0.7, b: 0.4, a: 1 },
			}),
		);

		return (
			<Card pad wide>
				<Space direction="vertical" gap wide>
					<Paragraph>
						<strong>Vec2</strong> magnitude: {vec2.mag().toFixed(2)}
					</Paragraph>
					<Paragraph>
						<strong>Vec3</strong> normalized: [{vec3.x.toFixed(2)},{" "}
						{vec3.y.toFixed(2)}, {vec3.z.toFixed(2)}]
					</Paragraph>
					<Paragraph>
						<strong>OakM Mesh</strong> vertices: {mesh.positions.length / 3} |
						triangles: {mesh.indices.length / 3}
					</Paragraph>
				</Space>
			</Card>
		);
	},
};
