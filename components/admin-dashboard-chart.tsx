"use client";

import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  incidents: {
    label: "Incidents",
    color: "var(--foreground)",
  },
} satisfies ChartConfig;

export function IncidentTimelineChart({ data }: { data: Array<{ date: string; incidents: number }> }) {
  return (
    <div className="border border-foreground/10 p-4 sm:p-6">
      <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="fillIncidents" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.9} />
              <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0.08} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="rgba(0,0,0,0.08)" />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={24}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="incidents"
            type="monotone"
            fill="url(#fillIncidents)"
            stroke="var(--foreground)"
            strokeWidth={2}
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
