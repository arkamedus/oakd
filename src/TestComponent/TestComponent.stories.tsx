import React from "react";
import TestComponent from "./TestComponent";

export default {
	title: "TestComponent",
};

export const Default = () => (
	<TestComponent
		heading="I am a test component"
		content={<h2>Made with love by Harvey</h2>}
	/>
);
