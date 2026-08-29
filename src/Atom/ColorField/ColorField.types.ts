import React from "react";
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
	React.HTMLAttributes<HTMLDivElement>,
	"defaultValue" | "onChange"
> {
	/** Controlled, normalized color value. Values above 1 are accepted and normalized from 0..255. */
	value: ColorValue;
	/** Receives normalized channel values in the 0..1 range. */
	onChange: (value: ColorValue) => void;
	/** Controlled editor mode. */
	mode?: ColorFieldMode;
	/** Initial editor mode when mode is uncontrolled. */
	defaultMode?: ColorFieldMode;
	onModeChange?: (mode: ColorFieldMode) => void;
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
