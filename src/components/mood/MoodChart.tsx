"use client";

import { useState, useMemo } from "react";
import type { MoodLog } from "@/lib/queries/mood";
import { formatShortDate } from "@/lib/utils/dates";

// ── SVG coordinate system ──────────────────────────────────────────────────
const VW = 560;
const VH = 160;
const P = { top: 10, right: 10, bottom: 28, left: 28 };
const IW = VW - P.left - P.right; // inner width
const IH = VH - P.top - P.bottom; // inner height

const GRIDLINES = [2, 4, 6, 8, 10] as const;

const TIMEFRAMES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
] as const;

// Score → y position (1 = bottom, 10 = top)
function toY(score: number): number {
  return P.top + IH * (1 - (score - 1) / 9);
}

// Score → colour
function scoreColor(s: number): string {
  if (s >= 8) return "#16a34a"; // green-600
  if (s >= 6) return "#ca8a04"; // yellow-600
  if (s >= 4) return "#d97706"; // amber-600
  return "#dc2626"; // red-600
}

interface Props {
  /** All logs up to 365 days, ordered oldest → newest. */
  logs: MoodLog[];
}

export function MoodChart({ logs }: Props) {
  const [days, setDays] = useState(30);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // ── Filter to selected window ──────────────────────────────────────────
  const filtered = useMemo(() => {
    const cutoff = Date.now() - days * 86_400_000;
    return logs.filter((l) => new Date(l.date).getTime() >= cutoff);
  }, [logs, days]);

  // ── Summary stats ──────────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!filtered.length) return null;
    const scores = filtered.map((l) => l.score);
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      avg: (sum / scores.length).toFixed(1),
      high: Math.max(...scores),
      low: Math.min(...scores),
      count: filtered.length,
    };
  }, [filtered]);

  // ── Compute x/y for every point + axis ticks ──────────────────────────
  const chartData = useMemo(() => {
    if (!filtered.length) return null;

    const ts = filtered.map((l) => new Date(l.date).getTime());
    const minT = Math.min(...ts);
    const maxT = Math.max(...ts);
    const rangeT = maxT - minT || 1; // avoid divide-by-zero for single point

    const toX = (t: number) => P.left + ((t - minT) / rangeT) * IW;

    const points = filtered.map((l) => ({
      log: l,
      x: toX(new Date(l.date).getTime()),
      y: toY(l.score),
    }));

    // Pick ~6 evenly-spaced tick dates (fewer when zoomed into 7d)
    const maxTicks = Math.min(filtered.length, days <= 7 ? filtered.length : 6);
    let tickIndices: number[];
    if (filtered.length <= maxTicks) {
      tickIndices = filtered.map((_, i) => i);
    } else {
      tickIndices = [];
      const step = (filtered.length - 1) / (maxTicks - 1);
      for (let i = 0; i < maxTicks; i++) {
        tickIndices.push(Math.round(i * step));
      }
    }
    const ticks = tickIndices.map((i) => ({
      date: filtered[i].date,
      x: toX(new Date(filtered[i].date).getTime()),
    }));

    return { points, ticks };
  }, [filtered, days]);

  // ── Tick label format ──────────────────────────────────────────────────
  function fmtTick(date: Date | string): string {
    const d = new Date(date);
    return days <= 30
      ? d.toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          timeZone: "UTC",
        })
      : d.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" });
  }

  const hoveredPt = hoveredId
    ? (chartData?.points.find((p) => p.log.id === hoveredId) ?? null)
    : null;

  // ── Render ─────────────────────────────────────────────────────────────
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      {/* Header + timeframe selector */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-700">Mood trend</h2>
        <div className="flex gap-1">
          {TIMEFRAMES.map(({ label, days: d }) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${
                days === d
                  ? "bg-stone-800 text-white"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Stats row */}
      {stats && (
        <div className="mb-4 grid grid-cols-4 gap-2 rounded-lg bg-stone-50 px-4 py-3 text-center">
          {(
            [
              { label: "Avg", value: stats.avg, cls: "text-stone-800" },
              { label: "High", value: stats.high, cls: "text-emerald-600" },
              { label: "Low", value: stats.low, cls: "text-red-500" },
              { label: "Logs", value: stats.count, cls: "text-stone-500" },
            ] as const
          ).map(({ label, value, cls }) => (
            <div key={label}>
              <p className="text-xs text-stone-400">{label}</p>
              <p className={`text-lg font-semibold ${cls}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Chart or empty state */}
      {!chartData ? (
        <div className="flex h-28 items-center justify-center rounded-lg bg-stone-50">
          <p className="text-sm text-stone-400">No data for this period.</p>
        </div>
      ) : (
        <svg
          viewBox={`0 0 ${VW} ${VH}`}
          width="100%"
          style={{ display: "block", overflow: "visible" }}
          onMouseLeave={() => setHoveredId(null)}
          aria-label="Mood trend chart"
        >
          <defs>
            <filter id="mood-tip-shadow" x="-20%" y="-40%" width="140%" height="180%">
              <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.1" />
            </filter>
          </defs>

          {/* Y gridlines + labels */}
          {GRIDLINES.map((v) => (
            <g key={v}>
              <line
                x1={P.left}
                y1={toY(v)}
                x2={VW - P.right}
                y2={toY(v)}
                stroke="#f5f5f4"
                strokeWidth={1.5}
              />
              <text
                x={P.left - 6}
                y={toY(v)}
                textAnchor="end"
                dominantBaseline="middle"
                fill="#d6d3d1"
                fontSize={10}
              >
                {v}
              </text>
            </g>
          ))}

          {/* X-axis tick labels */}
          {chartData.ticks.map(({ date, x }, i) => (
            <text
              key={i}
              x={x}
              y={VH - P.bottom + 14}
              textAnchor="middle"
              fill="#a8a29e"
              fontSize={10}
            >
              {fmtTick(date)}
            </text>
          ))}

          {/* Connecting line */}
          {chartData.points.length > 1 && (
            <polyline
              points={chartData.points.map((p) => `${p.x},${p.y}`).join(" ")}
              fill="none"
              stroke="#e7e5e4"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Score dots */}
          {chartData.points.map(({ log, x, y }) => (
            <circle
              key={log.id}
              cx={x}
              cy={y}
              r={hoveredId === log.id ? 6 : 4}
              fill={scoreColor(log.score)}
              stroke="white"
              strokeWidth={2}
              style={{ cursor: "pointer" }}
              onMouseEnter={() => setHoveredId(log.id)}
            />
          ))}

          {/* Hover tooltip (SVG-native so coords are always accurate) */}
          {hoveredPt &&
            (() => {
              const { log, x, y } = hoveredPt;
              const TW = 108;
              const TH = log.note ? 40 : 26;
              // Clamp horizontally; flip vertically when close to top
              const tx = Math.max(P.left, Math.min(x - TW / 2, VW - P.right - TW));
              const ty = y > VH / 2 ? y - TH - 10 : y + 10;
              // Truncate long notes
              const noteSnippet = log.note
                ? log.note.length > 16
                  ? log.note.slice(0, 16) + "…"
                  : log.note
                : null;
              return (
                <g filter="url(#mood-tip-shadow)">
                  <rect
                    x={tx}
                    y={ty}
                    width={TW}
                    height={TH}
                    rx={5}
                    fill="white"
                    stroke="#e7e5e4"
                  />
                  <text
                    x={tx + 8}
                    y={ty + 15}
                    fontSize={12}
                    fontWeight="600"
                    fill="#1c1917"
                  >
                    {log.score}/10
                  </text>
                  <text
                    x={tx + TW - 8}
                    y={ty + 15}
                    textAnchor="end"
                    fontSize={10}
                    fill="#a8a29e"
                  >
                    {formatShortDate(new Date(log.date))}
                  </text>
                  {noteSnippet && (
                    <text x={tx + 8} y={ty + 31} fontSize={9} fill="#78716c">
                      {noteSnippet}
                    </text>
                  )}
                </g>
              );
            })()}
        </svg>
      )}
    </div>
  );
}
