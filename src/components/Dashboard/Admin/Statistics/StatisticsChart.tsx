"use client";

import { useTranslation } from "react-i18next";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ChartRow, ChartSeries } from "./helpers";
import { LineKey, TooltipBox, TooltipRow, TooltipTitle, TooltipValue } from "./styles";

const CHART_HEIGHT = 320;
const SEGMENT_GAP = 2;
const CORNER_RADIUS = 4;
const AXIS_TICK = { fill: "#667085", fontSize: 12 };

type SegmentProps = { x?: number; y?: number; width?: number; height?: number; fill?: string };

function StackSegment({ x = 0, y = 0, width = 0, height = 0, fill, isTop }: SegmentProps & { isTop: boolean }) {
  const gap = isTop || height <= SEGMENT_GAP + 1 ? 0 : SEGMENT_GAP;
  const top = y + gap;
  const h = height - gap;
  if (h <= 0 || width <= 0) return null;
  if (!isTop) return <rect x={x} y={top} width={width} height={h} fill={fill} />;

  const r = Math.min(CORNER_RADIUS, width / 2, h);
  const path = `M${x},${top + h} L${x},${top + r} Q${x},${top} ${x + r},${top} L${x + width - r},${top} Q${x + width},${top} ${x + width},${top + r} L${x + width},${top + h} Z`;
  return <path d={path} fill={fill} />;
}

type ChartTooltipProps = {
  active?: boolean;
  payload?: ReadonlyArray<{ payload?: unknown }>;
  series: ChartSeries[];
};

function ChartTooltip({ active, payload, series }: ChartTooltipProps) {
  const { t } = useTranslation();
  const row = payload?.[0]?.payload as ChartRow | undefined;
  if (!active || !row) return null;

  return (
    <TooltipBox>
      <TooltipTitle>{row.label}</TooltipTitle>
      {series.length > 1 &&
        [...series].reverse().map(({ key, label, color }) => (
          <TooltipRow key={key}>
            <LineKey $color={color} />
            <TooltipValue>{row.values[key]}</TooltipValue>
            <span>{label}</span>
          </TooltipRow>
        ))}
      <TooltipRow>
        <TooltipValue>{row.total}</TooltipValue>
        <span>{t("dashboard.admin.stats.total")}</span>
      </TooltipRow>
    </TooltipBox>
  );
}

type Props = {
  rows: ChartRow[];
  series: ChartSeries[];
  ariaLabel: string;
};

export function StatisticsChart({ rows, series, ariaLabel }: Props) {
  return (
    <div role="figure" aria-label={ariaLabel}>
      <ResponsiveContainer width="100%" height={CHART_HEIGHT}>
        <BarChart data={rows} margin={{ top: 8, right: 8, bottom: 0, left: -16 }}>
          <CartesianGrid vertical={false} stroke="#eeeeee" />
          <XAxis dataKey="label" tick={AXIS_TICK} tickLine={false} axisLine={{ stroke: "#b9bdc7" }} minTickGap={8} />
          <YAxis allowDecimals={false} tick={AXIS_TICK} tickLine={false} axisLine={false} />
          <Tooltip
            cursor={{ fill: "#f0f1f3" }}
            content={(props) => <ChartTooltip {...props} series={series} />}
            isAnimationActive={false}
          />
          {series.map(({ key, label, color }) => (
            <Bar
              key={key}
              name={label}
              dataKey={(row: ChartRow) => row.values[key]}
              stackId="stack"
              fill={color}
              maxBarSize={24}
              isAnimationActive={false}
              shape={(props: SegmentProps & { payload?: ChartRow }) => (
                <StackSegment {...props} isTop={props.payload?.topKey === key} />
              )}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatisticsChart;
