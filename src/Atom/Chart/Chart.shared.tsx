import React from "react";
import Paragraph from "../Paragraph/Paragraph";
import Space from "../Space/Space";

export const CHART_PASTEL_COLORS = [
  "var(--oakd-chart-1)",
  "var(--oakd-chart-2)",
  "var(--oakd-chart-3)",
  "var(--oakd-chart-4)",
  "var(--oakd-chart-5)",
  "var(--oakd-chart-6)",
  "var(--oakd-chart-7)",
  "var(--oakd-chart-8)",
  "var(--oakd-chart-9)",
  "var(--oakd-chart-10)",
  "var(--oakd-chart-11)",
  "var(--oakd-chart-12)",
  "var(--oakd-chart-13)",
  "var(--oakd-chart-14)",
  "var(--oakd-chart-15)",
  "var(--oakd-chart-16)",
];

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

export function getChartColor(index: number) {
  return CHART_PASTEL_COLORS[index % CHART_PASTEL_COLORS.length];
}

export function viridisColor(t: number) {
  const stops = [
    [88, 42, 118],
    [88, 108, 172],
    [58, 165, 164],
    [120, 210, 118],
    [249, 226, 78],
  ];

  const clamped = Math.max(0, Math.min(1, t));
  const x = clamped * (stops.length - 1);
  const i = Math.floor(x);
  const f = x - i;

  const a = stops[i] ?? stops[0];
  const b = stops[Math.min(i + 1, stops.length - 1)] ?? stops[stops.length - 1];

  const r = Math.round(lerp(a[0], b[0], f));
  const g = Math.round(lerp(a[1], b[1], f));
  const bl = Math.round(lerp(a[2], b[2], f));

  return `rgb(${r}, ${g}, ${bl})`;
}

export function scaleColor(t: number) {
  const clamped = Math.max(0, Math.min(1, t));

  if (clamped <= 0.5) {
    const local = clamped / 0.5;
    const r = 255;
    const g = Math.round(lerp(86, 180, local));
    return `rgb(${r}, ${Math.max(0, g)}, 0)`;
  }

  const local = (clamped - 0.5) / 0.5;
  const r = Math.round(lerp(255, 0, local));
  const g = Math.round(lerp(180, 210, local));
  return `rgb(${Math.max(0, r)}, ${Math.min(255, g)}, 0)`;
}

export const ChartHeader: React.FC<{
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
}> = ({ title, subtitle }) =>
  title || subtitle ? (
    <Space direction="vertical" gap>
      {title ? (
        <Paragraph>
          <strong>{title}</strong>
        </Paragraph>
      ) : null}
      {subtitle ? (
        <Paragraph style={{ opacity: 0.7 }}>{subtitle}</Paragraph>
      ) : null}
    </Space>
  ) : null;

export const ChartLegend: React.FC<{
  items: Array<{ label: React.ReactNode; color: string }>;
}> = ({ items }) => (
  <Space gap style={{ flexWrap: "wrap" }}>
    {items.map((item, index) => (
      <Space key={index} gap align="center">
        <span
          aria-hidden="true"
          style={{
            width: 10,
            height: 10,
            borderRadius: "var(--oakd-radius-round)",
            background: item.color,
            flexShrink: 0,
          }}
        />
        <Paragraph>{item.label}</Paragraph>
      </Space>
    ))}
  </Space>
);

export const ChartAxisLabel: React.FC<{
  children: React.ReactNode;
  align?: "left" | "center" | "right";
}> = ({ children, align = "center" }) => (
  <Paragraph
    className="oakd-chart-axis-label"
    style={{
      opacity: 0.7,
      fontSize: "0.6em",
      textAlign: align,
    }}
  >
    {children}
  </Paragraph>
);
