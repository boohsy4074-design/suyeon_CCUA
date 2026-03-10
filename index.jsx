import { useState } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from "recharts";

const data = {
  CTR: [
    { period: "정상 밴드", GI: 1.07, GT: 0.82, META: 1.53 },
    { period: "연휴 기간",  GI: 1.09, GT: 1.05, META: 1.30 },
    { period: "2/19~2/23", GI: 1.13, GT: 0.86, META: 1.26 },
    { period: "2/24~3/2",  GI: 1.09, GT: 0.82, META: 1.40 },
    { period: "3/3 이후",  GI: 0.91, GT: 0.76, META: 1.64 },
  ],
  InstallCVR: [
    { period: "정상 밴드", GI: 27.68, GT: 26.91, META: 25.31 },
    { period: "연휴 기간",  GI: 28.01, GT: 30.05, META: 23.74 },
    { period: "2/19~2/23", GI: 29.50, GT: 31.42, META: 25.53 },
    { period: "2/24~3/2",  GI: 27.05, GT: 28.85, META: 23.66 },
    { period: "3/3 이후",  GI: 25.40, GT: 29.30, META: 24.54 },
  ],
  CPI_MMP: [
    { period: "정상 밴드", GI: 1784, GT: 2637, META: 1635 },
    { period: "연휴 기간",  GI: 1481, GT: 2208, META: 1687 },
    { period: "2/19~2/23", GI: 1542, GT: 2163, META: 1555 },
    { period: "2/24~3/2",  GI: 1710, GT: 2588, META: 1824 },
    { period: "3/3 이후",  GI: 1942, GT: 2671, META: 1782 },
  ],
  CPI_매체: [
    { period: "정상 밴드", GI: 1221, GT: 2266, META: 1255 },
    { period: "연휴 기간",  GI: 1136, GT: 1932, META: 1189 },
    { period: "2/19~2/23", GI: 1179, GT: 1899, META: 1200 },
    { period: "2/24~3/2",  GI: 1206, GT: 2119, META: 1316 },
    { period: "3/3 이후",  GI: 1371, GT: 2261, META: 1280 },
  ],
  CPA_MMP: [
    { period: "정상 밴드", GI: 49905, GT: 36754, META: 32949 },
    { period: "연휴 기간",  GI: 74794, GT: 46464, META: 33341 },
    { period: "2/19~2/23", GI: 35219, GT: 24924, META: 19119 },
    { period: "2/24~3/2",  GI: 60609, GT: 32180, META: 27624 },
    { period: "3/3 이후",  GI: 59776, GT: 28457, META: 42233 },
  ],
};

const baselines = {
  CTR:        { GI: 1.07,  GT: 0.82,  META: 1.53 },
  InstallCVR: { GI: 27.68, GT: 26.91, META: 25.31 },
  CPI_MMP:    { GI: 1784,  GT: 2637,  META: 1635 },
  CPI_매체:   { GI: 1221,  GT: 2266,  META: 1255 },
  CPA_MMP:    { GI: 49905, GT: 36754, META: 32949 },
};

const COLORS = { GI: "#60A5FA", GT: "#F472B6", META: "#34D399" };
const BASELINE_COLOR = "#FACC15";

const formatKRW = (v) => `₩${Number(v).toLocaleString()}`;
const formatPct = (v) => `${v}%`;

const charts = [
  { key: "CTR",        label: "CTR (%)",        fmt: formatPct, unit: "%",  yDomain: [0.5, 1.8] },
  { key: "InstallCVR", label: "Install CVR (%)", fmt: formatPct, unit: "%",  yDomain: [15, 35] },
  { key: "CPI_MMP",   label: "CPI MMP (₩)",     fmt: formatKRW, unit: "₩", yDomain: [1200, 2800] },
  { key: "CPI_매체",  label: "CPI 매체 (₩)",    fmt: formatKRW, unit: "₩", yDomain: [900, 2400] },
  { key: "CPA_MMP",   label: "CPA MMP (₩)",     fmt: formatKRW, unit: "₩", yDomain: [10000, 80000] },
];

const CustomTooltip = ({ active, payload, label, fmt }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0F172A", border: "1px solid #334155",
      borderRadius: 8, padding: "10px 14px", fontSize: 13
    }}>
      <p style={{ color: "#E2E8F0", marginBottom: 6, fontWeight: 600 }}>{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} style={{ color: p.color, margin: "2px 0" }}>
          {p.dataKey}: <strong>{fmt(p.value)}</strong>
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const [activeChart, setActiveChart] = useState("CTR");
  const chart = charts.find(c => c.key === activeChart);
  const chartData = data[activeChart];
  const baseline = baselines[activeChart];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060B14",
      color: "#E2E8F0",
      fontFamily: "'Pretendard', 'Noto Sans KR', sans-serif",
      padding: "40px 32px",
    }}>
      {/* Header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 4, height: 32, background: "linear-gradient(180deg, #60A5FA, #818CF8)", borderRadius: 2 }} />
          <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.5px", margin: 0 }}>
            명절 기간 매체 성과 분석
          </h1>
        </div>
        <p style={{ color: "#94A3B8", fontSize: 14, marginLeft: 16 }}>
          GI · GT · META — 5개 기간 비교 &nbsp;
          <span style={{ color: BASELINE_COLOR, fontSize: 12 }}>
            ╌ 점선: 정상 밴드 기준선 (매체별)
          </span>
        </p>
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
        {charts.map(c => (
          <button key={c.key} onClick={() => setActiveChart(c.key)} style={{
            padding: "8px 18px",
            borderRadius: 6,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 600,
            transition: "all 0.2s",
            background: activeChart === c.key
              ? "linear-gradient(135deg, #3B82F6, #6366F1)"
              : "#0F172A",
            color: activeChart === c.key ? "#fff" : "#CBD5E1",
            boxShadow: activeChart === c.key ? "0 0 20px rgba(99,102,241,0.35)" : "none",
          }}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Main Line Chart */}
      <div style={{
        background: "#0F172A",
        borderRadius: 16,
        padding: "28px 24px",
        border: "1px solid #1E293B",
        marginBottom: 32,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20, flexWrap: "wrap", gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: "#CBD5E1" }}>
            {chart.label} — 기간별 추이
          </h2>
          <div style={{ display: "flex", gap: 16, fontSize: 12, fontWeight: 600 }}>
            {["GI", "GT", "META"].map(k => (
              <span key={k} style={{ color: COLORS[k], display: "flex", alignItems: "center", gap: 4 }}>
                <span style={{ width: 16, height: 1.5, background: COLORS[k], display: "inline-block", borderTop: `2px dashed ${COLORS[k]}` }} />
                {k} 기준 {chart.fmt(baseline[k])}
              </span>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={340}>
          <LineChart data={chartData} margin={{ top: 24, right: 40, bottom: 4, left: 12 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
            <XAxis dataKey="period" tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={{ stroke: "#1E293B" }} tickLine={false} />
            <YAxis tick={{ fill: "#CBD5E1", fontSize: 12 }} axisLine={false} tickLine={false}
              domain={chart.yDomain}
              tickFormatter={v => chart.unit === "%" ? `${v}%` : `₩${(v/1000).toFixed(0)}k`} />
            <Tooltip content={<CustomTooltip fmt={chart.fmt} />} />
            <Legend wrapperStyle={{ paddingTop: 16, fontSize: 14, color: "#FFFFFF", fontWeight: 600 }} />

            {/* 매체별 기준선 */}
            <ReferenceLine y={baseline.GI} stroke={COLORS.GI} strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7}
              label={{ value: `GI 기준`, position: "right", fill: "#93C5FD", fontSize: 11, fontWeight: 600 }} />
            <ReferenceLine y={baseline.GT} stroke={COLORS.GT} strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7}
              label={{ value: `GT 기준`, position: "right", fill: "#F9A8D4", fontSize: 11, fontWeight: 600 }} />
            <ReferenceLine y={baseline.META} stroke={COLORS.META} strokeDasharray="6 4" strokeWidth={1.5} strokeOpacity={0.7}
              label={{ value: `META 기준`, position: "right", fill: "#6EE7B7", fontSize: 11, fontWeight: 600 }} />

            {["GI", "GT", "META"].map(k => (
              <Line key={k} type="monotone" dataKey={k}
                stroke={COLORS[k]} strokeWidth={2.5}
                dot={{ r: 5, fill: COLORS[k], strokeWidth: 0 }}
                activeDot={{ r: 7 }} />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Bar Charts Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {charts.map(c => {
          const bl = baselines[c.key];
          const avgBl = (bl.GI + bl.GT + bl.META) / 3;
          return (
            <div key={c.key} onClick={() => setActiveChart(c.key)} style={{
              background: activeChart === c.key ? "#131D2E" : "#0F172A",
              borderRadius: 12,
              padding: "20px 16px",
              border: `1px solid ${activeChart === c.key ? "#3B82F6" : "#1E293B"}`,
              cursor: "pointer",
              transition: "all 0.2s",
            }}>
              <h3 style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600, color: "#E2E8F0" }}>{c.label}</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={data[c.key]} barSize={12} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1A2540" vertical={false} />
                  <XAxis dataKey="period" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip fmt={c.fmt} />} />
                  {/* 바 차트는 3매체 평균 기준선 */}
                  <ReferenceLine y={avgBl} stroke={BASELINE_COLOR} strokeDasharray="5 3" strokeWidth={1.5}
                    label={{ value: "기준", position: "insideTopRight", fill: "#FDE047", fontSize: 10, fontWeight: 600 }} />
                  {["GI", "GT", "META"].map(k => (
                    <Bar key={k} dataKey={k} fill={COLORS[k]} opacity={0.85} radius={[3,3,0,0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>

      {/* Bottom Legend */}
      <div style={{ display: "flex", gap: 24, marginTop: 28, justifyContent: "center", flexWrap: "wrap" }}>
        {Object.entries(COLORS).map(([k, c]) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#FFFFFF", fontWeight: 600 }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
            {k}
          </div>
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: "#FDE047", fontWeight: 600 }}>
          <div style={{ width: 20, borderTop: `2px dashed ${BASELINE_COLOR}` }} />
          정상 밴드 기준선
        </div>
      </div>
    </div>
  );
}
