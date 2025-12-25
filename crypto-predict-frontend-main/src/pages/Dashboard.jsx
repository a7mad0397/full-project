// src/pages/Dashboard.jsx
import React from "react"
import { useState } from "react";
import PriceChart from "../components/charts/PriceChart.jsx";

const mockStats = [
  {
    id: 1,
    name: "Bitcoin (BTC)",
    price: "$65,430",
    change: "+2.3%",
    changeDirection: "up",
  },
  {
    id: 2,
    name: "Ethereum (ETH)",
    price: "$3,120",
    change: "-0.8%",
    changeDirection: "down",
  },
  {
    id: 3,
    name: "BNBUSD (BNB)",
    price: "$540.10",
    change: "+1.7%",
    changeDirection: "up",
  },
];

const COINS = [
  { id: "BTC", label: "Bitcoin (BTC)" },
  { id: "ETH", label: "Ethereum (ETH)" },
  { id: "DOGE", label: "Dogecoin (DOGE)" },
  { id: "XRP", label: "XRP" },
  { id: "BNBUSD", label: "Binance Coin (BNB/USD)" },
];

const MODELS = [
  { id: "lstm", label: "LSTM" },
  { id: "prophet", label: "Prophet" },
  { id: "linear", label: "Linear Regression" },
];

const RANGES = [
  { id: "1m", label: "1m" },
  { id: "1h", label: "1h" },
  { id: "1d", label: "1d" },
  { id: "7d", label: "7d" },
];

export default function Dashboard() {
  const [selectedCoin, setSelectedCoin] = useState("BTC");
  const [selectedModel, setSelectedModel] = useState("lstm");
  const [selectedRange, setSelectedRange] = useState("1h");

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>High level overview of the crypto market and predictions.</p>
        </div>
      </header>

      {/* Top stats */}
      <section className="dashboard-section">
        <h2 className="section-title">Top assets</h2>
        <div className="stats-grid">
          {mockStats.map((item) => (
            <article key={item.id} className="stat-card">
              <h3 className="stat-name">{item.name}</h3>
              <p className="stat-price">{item.price}</p>
              <p
                className={`stat-change ${
                  item.changeDirection === "up"
                    ? "stat-change-up"
                    : "stat-change-down"
                }`}
              >
                {item.changeDirection === "up" ? "▲" : "▼"} {item.change}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Chart section */}
      <section className="dashboard-section">
        <div className="chart-header">
          <h2 className="section-title">Price & prediction</h2>

          <div className="chart-controls">
            <div className="chart-controls-group">
              <div className="chart-control">
                <span className="select-label">Coin</span>
                <select
                  className="select"
                  value={selectedCoin}
                  onChange={(e) => setSelectedCoin(e.target.value)}
                >
                  {COINS.map((coin) => (
                    <option key={coin.id} value={coin.id}>
                      {coin.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="chart-control">
                <span className="select-label">Model</span>
                <select
                  className="select"
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value)}
                >
                  {MODELS.map((model) => (
                    <option key={model.id} value={model.id}>
                      {model.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="chart-control">
              <span className="select-label">Range</span>
              <select
                className="select"
                value={selectedRange}
                onChange={(e) => setSelectedRange(e.target.value)}
              >
                {RANGES.map((range) => (
                  <option key={range.id} value={range.id}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <PriceChart
          coin={selectedCoin}
          model={selectedModel}
          range={selectedRange}
        />
      </section>

      {/* Sentiment placeholder */}
      <section className="dashboard-section">
        <h2 className="section-title">Market sentiment</h2>
        <div className="card sentiment-placeholder">
          <p>
            This area will show market sentiment (positive / neutral / negative)
            based on tweets and news.
          </p>
        </div>
      </section>
    </div>
  );
}
