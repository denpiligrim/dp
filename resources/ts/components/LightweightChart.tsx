import React, { useEffect, useRef, useState } from "react";
import { createChart, IChartApi, LineData } from "lightweight-charts";
import { Box } from "@mui/material";

interface ChartProps {
  ticker: string;
  currency: string;
  color: string;
}

const LightweightChart = ({ ticker, currency, color }: ChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);

  const fetchBTCData = async (): Promise<LineData[]> => {
    const response = await fetch(
      "https://api.coingecko.com/api/v3/coins/" + currency + "/market_chart?vs_currency=usd&days=30"
    );
    const data = await response.json();
    return data.prices.map((price: [number, number]) => ({
      time: Math.floor(price[0] / 1000), // Конвертация времени в секунды
      value: price[1],
    }));
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#272727' }, textColor: "#ffffff" },
      grid: {
        vertLines: { color: "#2B2B43" },
        horzLines: { color: "#2B2B43" },
      },
      watermark: {
        visible: true,
        text: ticker.toUpperCase() + '/USDT',
        color: 'rgba(255, 255, 255, 0.3)'
      }
    });

    chartRef.current = chart;

    const lineSeries = chart.addLineSeries({
      color: color,
      lineWidth: 2,
    });

    // Загружаем данные
    fetchBTCData().then((data) => lineSeries.setData(data));

    return () => {
      chart.remove();
    };
  }, []);

  return <Box ref={chartContainerRef} sx={{ width: "100%", height: "400px" }} />;
};

export default LightweightChart;