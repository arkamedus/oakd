import React, { forwardRef, useId } from "react";
import Col from "../../Layout/Column/Column";
import Content from "../../Layout/Content/Content";
import Row from "../../Layout/Row/Row";
import Icon from "../../Icon/Icon";
import Button, { ButtonGroup } from "../Button/Button";
import Card from "../Card/Card";
import Dropdown from "../Dropdown/Dropdown";
import Input from "../Input/Input";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";
import "./VectorField.css";
import { VectorAxis, VectorFieldProps, VectorValue } from "./VectorField.types";

const AXES: VectorAxis[] = ["x", "y", "z"];
const AXIS_ICONS = ["X", "Y", "Z"] as const;

const renderLabel = (value: React.ReactNode) =>
	typeof value === "string" || typeof value === "number" ? (
		<Paragraph>{value}</Paragraph>
	) : (
		value
	);

const VectorField = forwardRef<HTMLDivElement, VectorFieldProps>(
	(
		{
			value,
			onChange,
			label,
			dimensions = value.z === undefined ? 2 : 3,
			layout = "grid",
			axisOptions,
			onResetAxis,
			onRandomizeAxis,
			onReset,
			onRandomize,
			onApply,
			disabled = false,
			readOnly = false,
			showActions = true,
			framed = false,
			wide = true,
			grow = false,
			className,
			...rest
		},
		ref,
	) => {
		const fieldId = useId();
		const axes = AXES.slice(0, dimensions);
		const locked = disabled || readOnly;

		const setAxis = (axis: VectorAxis, nextValue: number) => {
			if (readOnly) return;
			const options = axisOptions?.[axis];
			const finite = Number.isFinite(nextValue) ? nextValue : 0;
			const bounded = Math.min(
				options?.max ?? Number.POSITIVE_INFINITY,
				Math.max(options?.min ?? Number.NEGATIVE_INFINITY, finite),
			);
			onChange({ ...value, [axis]: bounded }, axis);
		};

		const resetAxis = (axis: VectorAxis) => {
			setAxis(axis, axisOptions?.[axis]?.resetValue ?? 0);
			onResetAxis?.(axis);
		};

		const randomizeAxis = (axis: VectorAxis) => {
			const options = axisOptions?.[axis];
			const min = Number.isFinite(options?.min) ? (options?.min as number) : 0;
			const max = Number.isFinite(options?.max)
				? (options?.max as number)
				: 360;
			const step = options?.step ?? 0.01;
			const raw = min + Math.random() * (max - min);
			setAxis(axis, Math.round(raw / step) * step);
			onRandomizeAxis?.(axis);
		};

		const resetAll = () => {
			const next = axes.reduce<VectorValue>(
				(result, axis) => ({
					...result,
					[axis]: axisOptions?.[axis]?.resetValue ?? 0,
				}),
				{ ...value },
			);
			onReset?.(next);
			axes.forEach((axis) => onChange(next, axis));
		};

		const randomizeAll = () => {
			const next = axes.reduce<VectorValue>((result, axis) => {
				const options = axisOptions?.[axis];
				const min = Number.isFinite(options?.min)
					? (options?.min as number)
					: 0;
				const max = Number.isFinite(options?.max)
					? (options?.max as number)
					: 360;
				const step = options?.step ?? 0.01;
				const raw = min + Math.random() * (max - min);
				return { ...result, [axis]: Math.round(raw / step) * step };
			}, value);
			onRandomize?.(next);
			axes.forEach((axis) => onChange(next, axis));
		};

		const optionsMenu = showActions ? (
			<Dropdown
				fixed
				direction="bottom-right"
				label={<Icon name="Dots" size="small" />}
				aria-label={
					typeof label === "string" ? `${label} axis options` : "Axis options"
				}
			>
				<Content pad className="oakd-vector-field__menu">
					<Space direction="vertical" gap wide>
						<Space align="center" justify="between" gap wide noWrap>
							{renderLabel(label || "Axes")}
							<ButtonGroup>
								{onRandomize ? (
									<Button
										variant="ghost"
										size="small"
										icon="Wand"
										disabled={locked}
										aria-label="Randomize axes"
										onClick={randomizeAll}
									/>
								) : null}
								<Button
									variant="ghost"
									size="small"
									icon="Broom"
									disabled={locked}
									aria-label="Reset axes"
									onClick={resetAll}
								/>
								{onApply ? (
									<Button
										variant="primary"
										size="small"
										icon="Check"
										disabled={locked}
										onClick={() => onApply(value)}
									>
										<Paragraph>Apply</Paragraph>
									</Button>
								) : null}
							</ButtonGroup>
						</Space>
						{axes.map((axis, index) => {
							const options = axisOptions?.[axis];
							return (
								<Space
									key={axis}
									className="oakd-vector-field__menu-row"
									gap
									align="center"
									noWrap
									wide
								>
									<Icon name={AXIS_ICONS[index]} />
									<ButtonGroup className="oakd-vector-field__menu-actions">
										<Button
											icon="Minus"
											disabled={locked}
											aria-label={`Decrease ${axis.toUpperCase()}`}
											onClick={() =>
												setAxis(
													axis,
													(value[axis] ?? 0) - (options?.step ?? 0.1),
												)
											}
										/>
										<Input
											className="oakd-vector-field__menu-value"
											type="number"
											value={value[axis] ?? 0}
											min={options?.min}
											max={options?.max}
											step={options?.step ?? 0.1}
											disabled={disabled}
											readOnly={readOnly}
											aria-label={`${axis.toUpperCase()} value`}
											onChange={(event) =>
												setAxis(axis, event.currentTarget.valueAsNumber)
											}
										/>
										<Button
											icon="Plus"
											disabled={locked}
											aria-label={`Increase ${axis.toUpperCase()}`}
											onClick={() =>
												setAxis(
													axis,
													(value[axis] ?? 0) + (options?.step ?? 0.1),
												)
											}
										/>
										<Button
											variant="ghost"
											icon="Broom"
											disabled={locked}
											aria-label={`Reset ${axis.toUpperCase()}`}
											onClick={() => resetAxis(axis)}
										/>
										<Button
											variant="ghost"
											icon="Wand"
											disabled={locked}
											aria-label={`Randomize ${axis.toUpperCase()}`}
											onClick={() => randomizeAxis(axis)}
										/>
									</ButtonGroup>
								</Space>
							);
						})}
					</Space>
				</Content>
			</Dropdown>
		) : null;

		const toolbarControl = (
			<Space
				className="oakd-vector-field__toolbar"
				align="center"
				gap
				noWrap
				wide
				aria-label={typeof label === "string" ? label : "Vector field"}
			>
				{label ? renderLabel(label) : null}
				<Space gap align="center" noWrap wide>
					<ButtonGroup
						className={[
							"oakd-vector-field__toolbar-group",
							`oakd-vector-field__toolbar-group--${axes.length}`,
							!showActions && "oakd-vector-field__toolbar-group--no-options",
						]
							.filter(Boolean)
							.join(" ")}
					>
						{axes.map((axis, index) => (
							<Input
								key={axis}
								id={`${fieldId}-${axis}`}
								className="oakd-vector-field__toolbar-input"
								icon={AXIS_ICONS[index]}
								type="number"
								value={value[axis] ?? 0}
								min={axisOptions?.[axis]?.min}
								max={axisOptions?.[axis]?.max}
								step={axisOptions?.[axis]?.step ?? 0.01}
								disabled={disabled}
								readOnly={readOnly}
								aria-label={
									typeof label === "string"
										? `${label} ${axis.toUpperCase()}`
										: axis.toUpperCase()
								}
								onChange={(event) =>
									setAxis(axis, event.currentTarget.valueAsNumber)
								}
							/>
						))}
						{optionsMenu}
					</ButtonGroup>
				</Space>
			</Space>
		);

		return (
			<Content
				{...rest}
				ref={ref}
				wide={wide}
				grow={grow}
				className={[
					"oakd-vector-field",
					`oakd-vector-field--${layout}`,
					className,
				]
					.filter(Boolean)
					.join(" ")}
			>
				{layout === "toolbar" ? (
					framed ? (
						<Card pad variant="ghost" wide={wide}>
							{toolbarControl}
						</Card>
					) : (
						toolbarControl
					)
				) : (
					<Space direction="vertical" gap wide>
						{label ? renderLabel(label) : null}
						<Row gap wide>
							{axes.map((axis, index) => (
								<Col key={axis} xs={dimensions === 2 ? 12 : 8}>
									<Space direction="vertical" gap wide>
										<Icon name={AXIS_ICONS[index]} />
										<Input
											id={`${fieldId}-${axis}`}
											type="number"
											value={value[axis] ?? 0}
											min={axisOptions?.[axis]?.min}
											max={axisOptions?.[axis]?.max}
											step={axisOptions?.[axis]?.step ?? 0.01}
											disabled={disabled}
											readOnly={readOnly}
											aria-label={
												typeof label === "string"
													? `${label} ${axis.toUpperCase()}`
													: axis.toUpperCase()
											}
											onChange={(event) =>
												setAxis(axis, event.currentTarget.valueAsNumber)
											}
										/>
									</Space>
								</Col>
							))}
						</Row>
						{showActions && (onRandomize || onReset || onApply) ? (
							<Space gap align="center">
								{onRandomize ? (
									<Button
										variant="ghost"
										icon="Wand"
										disabled={locked}
										onClick={randomizeAll}
									>
										<Paragraph>Random</Paragraph>
									</Button>
								) : null}
								{onReset ? (
									<Button
										variant="ghost"
										icon="Broom"
										disabled={locked}
										onClick={resetAll}
									>
										<Paragraph>Reset</Paragraph>
									</Button>
								) : null}
								{onApply ? (
									<Button
										variant="primary"
										icon="Check"
										disabled={locked}
										onClick={() => onApply(value)}
									>
										<Paragraph>Apply</Paragraph>
									</Button>
								) : null}
							</Space>
						) : null}
					</Space>
				)}
			</Content>
		);
	},
);

VectorField.displayName = "VectorField";
export default VectorField;
