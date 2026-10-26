import React, { forwardRef, useEffect, useId, useMemo, useState } from "react";
import Content from "../../Layout/Content/Content";
import Button, { ButtonGroup } from "../Button/Button";
import Divider from "../Divider/Divider";
import Dropdown from "../Dropdown/Dropdown";
import Icon from "../../Icon/Icon";
import Input from "../Input/Input";
import Paragraph from "../Paragraph/Paragraph";
import RangeInput from "../RangeInput/RangeInput";
import Space from "../Space/Space";
import "./ColorField.css";
import {
	ColorFieldMode,
	ColorFieldProps,
	ColorValue,
} from "./ColorField.types";

type EyeDropperConstructor = new () => {
	open: () => Promise<{ sRGBHex: string }>;
};

const RGB_CHANNELS = [
	{ key: "r", label: "R", name: "Red", max: 255 },
	{ key: "g", label: "G", name: "Green", max: 255 },
	{ key: "b", label: "B", name: "Blue", max: 255 },
] as const;

const HSV_CHANNELS = [
	{ key: "h", label: "H", name: "Hue", max: 360 },
	{ key: "s", label: "S", name: "Saturation", max: 100 },
	{ key: "v", label: "V", name: "Value", max: 100 },
] as const;

const clamp = (value: number, min: number, max: number) =>
	Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
const clamp01 = (value: number) => clamp(value, 0, 1);
const normalizeChannel = (value: number) =>
	clamp01(value > 1 ? value / 255 : value);
const channelToByte = (value: number) => Math.round(clamp01(value) * 255);
const channelToHex = (value: number) =>
	channelToByte(value).toString(16).padStart(2, "0");
const readableColor = (value: ColorValue) => {
	const normalized = normalizeColorValue(value);
	const luminance =
		0.2126 * normalized.r + 0.7152 * normalized.g + 0.0722 * normalized.b;
	return luminance > 0.55 ? "var(--oakd-black)" : "var(--oakd-white)";
};

export const normalizeColorValue = (value: ColorValue): ColorValue => ({
	r: normalizeChannel(value.r),
	g: normalizeChannel(value.g),
	b: normalizeChannel(value.b),
	a: value.a === undefined ? undefined : clamp01(value.a),
});

export const colorToHex = (value: ColorValue) => {
	const normalized = normalizeColorValue(value);
	return `#${channelToHex(normalized.r)}${channelToHex(normalized.g)}${channelToHex(normalized.b)}`;
};

const hexToColor = (value: string): ColorValue | undefined => {
	const cleaned = value.trim().replace(/^#/, "");
	const expanded = /^[0-9a-f]{3}$/i.test(cleaned)
		? cleaned
				.split("")
				.map((character) => `${character}${character}`)
				.join("")
		: cleaned;
	if (!/^[0-9a-f]{6}$/i.test(expanded)) return undefined;
	return {
		r: Number.parseInt(expanded.slice(0, 2), 16) / 255,
		g: Number.parseInt(expanded.slice(2, 4), 16) / 255,
		b: Number.parseInt(expanded.slice(4, 6), 16) / 255,
	};
};

const rgbToHsv = ({ r, g, b }: ColorValue) => {
	const red = clamp01(r);
	const green = clamp01(g);
	const blue = clamp01(b);
	const max = Math.max(red, green, blue);
	const min = Math.min(red, green, blue);
	const delta = max - min;
	let hue = 0;
	if (delta) {
		if (max === red) hue = 60 * (((green - blue) / delta) % 6);
		else if (max === green) hue = 60 * ((blue - red) / delta + 2);
		else hue = 60 * ((red - green) / delta + 4);
	}
	return {
		h: Math.round((hue + 360) % 360),
		s: Math.round((max ? delta / max : 0) * 100),
		v: Math.round(max * 100),
	};
};

const hsvToRgb = (h: number, s: number, v: number): ColorValue => {
	const hue = ((h % 360) + 360) % 360;
	const saturation = clamp(s, 0, 100) / 100;
	const brightness = clamp(v, 0, 100) / 100;
	const chroma = brightness * saturation;
	const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
	const match = brightness - chroma;
	let red = 0;
	let green = 0;
	let blue = 0;
	if (hue < 60) [red, green] = [chroma, x];
	else if (hue < 120) [red, green] = [x, chroma];
	else if (hue < 180) [green, blue] = [chroma, x];
	else if (hue < 240) [green, blue] = [x, chroma];
	else if (hue < 300) [red, blue] = [x, chroma];
	else [red, blue] = [chroma, x];
	return { r: red + match, g: green + match, b: blue + match };
};

const ColorField = forwardRef<HTMLDivElement, ColorFieldProps>(
	(
		{
			value,
			onChange,
			mode,
			defaultMode = "rgb",
			onModeChange,
			alpha = false,
			disabled = false,
			wide = true,
			grow = false,
			open,
			defaultOpen,
			onOpenChange,
			direction = "bottom-left",
			eyeDropper = true,
			randomize = true,
			presets = [],
			className,
			style,
			...rest
		},
		ref,
	) => {
		const fieldId = useId();
		const normalized = useMemo(() => normalizeColorValue(value), [value]);
		const hex = colorToHex(normalized).toUpperCase();
		const [hexDraft, setHexDraft] = useState(hex.slice(1));
		const [internalMode, setInternalMode] = useState(defaultMode);
		const activeMode = mode ?? internalMode;
		const hsv = useMemo(() => rgbToHsv(normalized), [normalized]);
		const canUseEyeDropper =
			typeof window !== "undefined" &&
			Boolean(
				(window as unknown as { EyeDropper?: EyeDropperConstructor })
					.EyeDropper,
			);
		const colorStyle = {
			...style,
			"--oakd-color-field-color": hex,
			"--oakd-color-field-contrast": readableColor(normalized),
		} as React.CSSProperties;

		useEffect(() => setHexDraft(hex.slice(1)), [hex]);

		const emit = (next: ColorValue) =>
			onChange({
				...normalizeColorValue(next),
				a: alpha ? clamp01(next.a ?? normalized.a ?? 1) : value.a,
			});
		const setMode = (next: ColorFieldMode) => {
			if (mode === undefined) setInternalMode(next);
			onModeChange?.(next);
		};
		const emitHex = (draft: string) => {
			const cleaned = draft.trim().replace(/^#/, "").toUpperCase();
			setHexDraft(cleaned);
			const next = hexToColor(cleaned);
			if (next) emit({ ...next, a: normalized.a });
		};
		const useEyeDropper = async () => {
			const EyeDropper = (
				window as unknown as { EyeDropper?: EyeDropperConstructor }
			).EyeDropper;
			if (!EyeDropper) return;
			try {
				const result = await new EyeDropper().open();
				emitHex(result.sRGBHex);
			} catch {
				// Cancelling the platform picker intentionally preserves the value.
			}
		};
		const updateRgb = (key: "r" | "g" | "b", next: number) =>
			emit({ ...normalized, [key]: clamp(next, 0, 255) / 255 });
		const updateHsv = (key: "h" | "s" | "v", next: number) => {
			const nextHsv = {
				...hsv,
				[key]: clamp(next, 0, key === "h" ? 360 : 100),
			};
			emit({
				...hsvToRgb(nextHsv.h, nextHsv.s, nextHsv.v),
				a: normalized.a,
			});
		};

		const channels =
			activeMode === "rgb"
				? RGB_CHANNELS.map((channel) => ({
						...channel,
						value: channelToByte(normalized[channel.key]),
						update: (next: number) => updateRgb(channel.key, next),
					}))
				: HSV_CHANNELS.map((channel) => ({
						...channel,
						value: hsv[channel.key],
						update: (next: number) => updateHsv(channel.key, next),
					}));

		return (
			<Content ref={ref} {...rest} wide={wide} grow={grow}>
				<Dropdown
					className={["oakd-color-field", className].filter(Boolean).join(" ")}
					style={colorStyle}
					label={
						<Space align="center" gap noWrap wide>
							<Icon name="PaintPalette" size="small" />
							<Paragraph>{hex}</Paragraph>
						</Space>
					}
					direction={direction}
					fixed
					wide={wide}
					grow={grow}
					disabled={disabled}
					open={open}
					defaultOpen={defaultOpen}
					onOpenChange={onOpenChange}
				>
					<Content pad>
						<Space direction="vertical" gap wide>
							<Space align="center" justify="between" gap wide>
								<ButtonGroup>
									{(["rgb", "hsv"] as const).map((nextMode) => (
										<Button
											key={nextMode}
											size="small"
											variant={activeMode === nextMode ? "active" : "default"}
											onClick={() => setMode(nextMode)}
										>
											<Paragraph>{nextMode.toUpperCase()}</Paragraph>
										</Button>
									))}
								</ButtonGroup>
								<Space gap noWrap>
									{randomize ? (
										<Button
											size="small"
											variant="ghost"
											icon="Wand"
											disabled={disabled}
											onClick={() =>
												emit({
													r: Math.random(),
													g: Math.random(),
													b: Math.random(),
													a: normalized.a,
												})
											}
										>
											<Paragraph>Random</Paragraph>
										</Button>
									) : null}
									{presets.map((preset, index) => (
										<Button
											key={index}
											size="small"
											variant="ghost"
											icon={preset.icon}
											disabled={disabled}
											onClick={() =>
												emit(
													typeof preset.value === "function"
														? preset.value()
														: preset.value,
												)
											}
										>
											{preset.label}
										</Button>
									))}
								</Space>
							</Space>
							<Content
								className="oakd-color-field__preview"
								role="img"
								aria-label={`Selected color ${hex}`}
							/>
							<Space justify="between" align="center" noWrap wide>
								<Paragraph>
									{`rgb(${channelToByte(normalized.r)} ${channelToByte(normalized.g)} ${channelToByte(normalized.b)})`}
								</Paragraph>
								<Paragraph>{hex}</Paragraph>
							</Space>
							<Divider />
							<Space direction="vertical" gap wide>
								{channels.map((channel) => (
									<Space
										key={channel.key}
										className="oakd-color-field__channel"
										align="center"
										gap
										wide
										noWrap
									>
										<Icon name={channel.label} />
										<RangeInput
											id={`${fieldId}-${channel.key}-range`}
											aria-label={`${channel.name} range`}
											min={0}
											max={channel.max}
											step={1}
											value={channel.value}
											disabled={disabled}
											onChange={channel.update}
										/>
										<Input
											aria-label={`${channel.name} number`}
											type="number"
											min={0}
											max={channel.max}
											step={1}
											value={channel.value}
											disabled={disabled}
											onChange={(event) =>
												Number.isFinite(event.currentTarget.valueAsNumber) &&
												channel.update(event.currentTarget.valueAsNumber)
											}
										/>
									</Space>
								))}
								{alpha ? (
									<Space
										className="oakd-color-field__channel"
										align="center"
										gap
										wide
										noWrap
									>
										<Icon name="A" />
										<RangeInput
											aria-label="Alpha range"
											min={0}
											max={1}
											step={0.01}
											value={normalized.a ?? 1}
											disabled={disabled}
											onChange={(next) => emit({ ...normalized, a: next })}
										/>
										<Input
											aria-label="Alpha number"
											type="number"
											min={0}
											max={1}
											step={0.01}
											value={normalized.a ?? 1}
											disabled={disabled}
											onChange={(event) =>
												Number.isFinite(event.currentTarget.valueAsNumber) &&
												emit({
													...normalized,
													a: event.currentTarget.valueAsNumber,
												})
											}
										/>
									</Space>
								) : null}
							</Space>
							<Divider />
							<Space align="center" gap noWrap wide>
								<Input
									value={hexDraft}
									icon="Hashtag"
									aria-label="Hex color"
									disabled={disabled}
									onChange={(event) => emitHex(event.currentTarget.value)}
									grow
								/>
								{eyeDropper ? (
									<Button
										icon="Dropper"
										disabled={disabled || !canUseEyeDropper}
										onClick={useEyeDropper}
									>
										<Paragraph>Dropper</Paragraph>
									</Button>
								) : null}
							</Space>
						</Space>
					</Content>
				</Dropdown>
			</Content>
		);
	},
);

ColorField.displayName = "ColorField";
export default ColorField;
