"use client";

import { TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export type TrendPoint = {
  date: string; // ex: "12 sept."
  saidi: number;
  saifi: number;
};

export function TrendChart({ data }: { data: TrendPoint[] }) {
  const hasData = data.length > 0;

  return (
    <div className="rounded-xl border border-[#E8E2D8] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <TrendingUp className="h-4 w-4 text-[#8A8478]" />
        <p className="text-sm font-semibold text-[#1F2937]">
          Tendance SAIDI / SAIFI
        </p>
      </div>

      <div className="h-[220px] w-full">
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E2D8" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "#9A9284" }}
                tickLine={false}
                axisLine={{ stroke: "#E8E2D8" }}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9A9284" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 8,
                  borderColor: "#E8E2D8",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="saidi"
                name="SAIDI"
                stroke="#F2751F"
                strokeWidth={2}
                dot={false}
              />
              <Line
                type="monotone"
                dataKey="saifi"
                name="SAIFI"
                stroke="#1F2937"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-[#B5AE9F]">
            <TrendingUp className="h-6 w-6" />
            <p className="text-sm">Pas assez de données sur la période</p>
          </div>
        )}
      </div>
    </div>
  );
}