import React from "react";
import { CoreComponentSizeType } from "../../Core/Core.types";
import { DropdownDirection } from "../Dropdown/Dropdown.types";

/** Normalized red, green, blue, and optional alpha channels in the 0..1 range. */
export interface ColorValue {
	r: number;
	g: number;
	b: number;
	a?: number;
}

export type ColorFieldMode = "rgb" | "hsv";

export interface ColorFieldPreset {
	label: React.ReactNode;
	value: ColorValue | (() => ColorValue);
	icon?: React.ReactNode;
}

export interface ColorFieldProps extends Omit<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	"defaultValue" | "value" | "onChange"
> {
	/** Native trigger props, including its ref. */
	triggerProps?: import("../Dropdown/Dropdown.types").DropdownProps["triggerProps"];
	/** Native props for the hex input; color value and editing remain managed by ColorField. */
	hexInputProps?: Omit<
		React.ComponentPropsWithRef<"input">,
		"value" | "defaultValue" | "type" | "size"
	>;
	/** Controlled, normalized color value. Values above 1 are accepted and normalized from 0..255. */
	value: ColorValue;
	/** Receives normalized channel values in the 0..1 range. */
	onChange: (value: ColorValue) => void;
	/** Controlled editor mode. */
	mode?: ColorFieldMode;
	/** Initial editor mode when mode is uncontrolled. */
	defaultMode?: ColorFieldMode;
	onModeChange?: (mode: ColorFieldMode) => void;
	/** Shows the hex code in the trigger. Defaults to true; the editor is unaffected. */
	showHex?: boolean;
	/** Size of the trigger button. Defaults to default; the editor keeps its own sizing. */
	size?: Exclude<CoreComponentSizeType, "huge">;
	alpha?: boolean;
	disabled?: boolean;
	wide?: boolean;
	grow?: boolean;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	direction?: DropdownDirection;
	/** Shows the browser EyeDropper action when the API is available. */
	eyeDropper?: boolean;
	/** Shows a built-in random color action. */
	randomize?: boolean;
	/** Optional reusable color actions, such as product-defined palettes. */
	presets?: ColorFieldPreset[];
}
