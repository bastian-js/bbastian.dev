import { useEffect, useRef } from "react";
import {
  Chart,
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
} from "chart.js";

Chart.register(
  RadarController,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
);

const SKILLS: { label: string; value: number }[] = [
  { label: "Frontend", value: 7 },
  { label: "Backend", value: 7.5 },
  { label: "Mobile", value: 7 },
  { label: "Database", value: 8 },
  { label: "DevOps", value: 7 },
  { label: "UI / UX", value: 8 },
];

export default function TechStackRadar() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const chartRef = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: "radar",
      data: {
        labels: SKILLS.map((s) => s.label),
        datasets: [
          {
            label: "Skill level",
            data: SKILLS.map((s) => s.value),
            backgroundColor: "rgba(0, 122, 204, 0.18)",
            borderColor: "#007ACC",
            borderWidth: 2,
            pointBackgroundColor: "#007ACC",
            pointBorderColor: "#0a0a0a",
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            backgroundColor: "#111",
            borderColor: "rgba(255,255,255,0.08)",
            borderWidth: 1,
            titleColor: "#fff",
            bodyColor: "#9ca3af",
            padding: 10,
            displayColors: false,
            callbacks: {
              label: (ctx) => `${ctx.parsed.r} / 10`,
            },
          },
        },
        scales: {
          r: {
            min: 0,
            max: 10,
            ticks: {
              stepSize: 2,
              color: "rgba(255,255,255,0.25)",
              backdropColor: "transparent",
              font: { size: 10 },
            },
            grid: { color: "rgba(255,255,255,0.07)" },
            angleLines: { color: "rgba(255,255,255,0.07)" },
            pointLabels: {
              color: "rgba(255,255,255,0.7)",
              font: { size: 12, weight: 500 },
            },
          },
        },
      },
    });

    return () => {
      chartRef.current?.destroy();
      chartRef.current = null;
    };
  }, []);

  return (
    <div className="bg-[#111] border border-white/6 rounded-2xl p-6">
      <div className="mb-4">
        <h3 className="text-base font-semibold text-white text-left">
          Tech Stack
        </h3>
        <p className="text-xs text-gray-500 text-left">
          Self-rated comfort across the stack.
        </p>
      </div>
      <div className="relative h-72 sm:h-80">
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
}
