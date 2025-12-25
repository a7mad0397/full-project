// src/components/charts/PriceChart.jsx
import React from "react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const COIN_BASE_PRICE = {
  BTC: 65000,
  ETH: 3200,
  DOGE: 0.32,
  XRP: 0.6,
  BNBUSD: 540,
};

const RANGE_LABELS = {
  "1m": ["-50s", "-40s", "-30s", "-20s", "-10s", "now"],
  "1h": ["-50m", "-40m", "-30m", "-20m", "-10m", "now"],
  "1d": ["-20h", "-12h", "-8h", "-4h", "now"],
  "7d": ["-6d", "-4d", "-2d", "-1d", "today"],
};

const MODEL_LABEL = {
  lstm: "LSTM",
  prophet: "Prophet",
  linear: "Linear regression",
};

function buildMockData(coin, range) {
  const basePrice = COIN_BASE_PRICE[coin] ?? 100;
  const labels = RANGE_LABELS[range] ?? RANGE_LABELS["1h"]; // fallback = 1h

  return labels.map((label, index) => {
    const offset = index - labels.length / 2;
    const actual = basePrice + offset * (basePrice * 0.003);
    const predicted = actual * 1.01; // slightly higher than actual

    return {
      time: label,
      actual: Number(actual.toFixed(4)),
      predicted: Number(predicted.toFixed(4)),
    };
  });
}

export default function PriceChart({ coin, model, range }) {
  const data = buildMockData(coin, range);
  const modelName = MODEL_LABEL[model] || "Model";

  return (
    <div className="chart-wrapper">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255, 255, 255, 0.1)"
          />
          <XAxis
            dataKey="time"
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9CA3AF", fontSize: 12 }}
            axisLine={false}
            tickLine={false}
            domain={["auto", "auto"]}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#111827",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "#E5E7EB",
              fontSize: "12px",
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            iconSize={10}
            wrapperStyle={{ fontSize: "12px", color: "#E5E7EB" }}
          />

          {/* Actual line */}
          <Line
            type="monotone"
            dataKey="actual"
            stroke="#38bdf8"
            strokeWidth={2}
            dot={false}
            name="Actual price"
          />

          {/* Predicted line (dashed) */}
          <Line
            type="monotone"
            dataKey="predicted"
            stroke="#22c55e"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name={`${modelName} prediction`}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

