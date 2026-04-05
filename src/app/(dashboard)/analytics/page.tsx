"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Users, Zap, BarChart3, MapPin, CalendarDays, UserCheck, Activity, MousePointerClick } from "lucide-react";
import {
  engagementOverTime,
  hourlyCheckins,
  boothVisitData,
  pointsDistribution,
  events,
  attendees,
  attendeeTypeEngagement,
  profileCompletionRate,
  totalInteractions,
  avgInteractionsPerAttendee,
} from "@/lib/mock-data";

const PIE_COLORS = ["#6366f1", "#818cf8", "#a5b4fc", "#c7d2fe", "#e0e7ff"];

const liveEvent = events.find((e) => e.status === "Live")!;
const checkedIn = attendees.filter((a) => a.checkedIn).length;
const checkedInPct = Math.round((checkedIn / liveEvent.attendeeCount) * 100);
const avgPoints = Math.round(
  attendees.reduce((s, a) => s + a.points, 0) / attendees.length
);

const horizontalBoothData = boothVisitData
  .slice()
  .sort((a, b) => b.visits - a.visits);

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "10px",
  color: "#f8fafc",
  fontSize: 13,
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
};

const maxAvgPoints = Math.max(...attendeeTypeEngagement.map((t) => t.avgPoints));

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Analytics</h1>
        <p className="text-[14px] text-slate-500 mt-1.5">
          Engagement insights for{" "}
          <span className="font-semibold text-slate-700">{liveEvent.name}</span>
        </p>
      </div>

      {/* ── Event Summary Card ──────────────────────────────────────────── */}
      <Card className="rounded-2xl border-slate-100 shadow-sm overflow-hidden">
        {/* Coloured top accent */}
        <div className="h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400" />
        <CardContent className="p-0">
          {/* Top row – event identity */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center flex-shrink-0">
                <CalendarDays className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-[15px] font-bold text-slate-900 leading-tight">{liveEvent.name}</p>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1 text-[12.5px] text-slate-500">
                    <CalendarDays className="w-3 h-3" />
                    {new Date(liveEvent.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="flex items-center gap-1 text-[12.5px] text-slate-500">
                    <MapPin className="w-3 h-3" />
                    {liveEvent.location}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-full">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[12.5px] font-semibold text-emerald-700">Live Now</span>
            </div>
          </div>

          {/* Bottom row – 5 headline metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-slate-100">
            {[
              {
                label: "Total Registered",
                value: liveEvent.attendeeCount.toLocaleString(),
                sub: "capacity: 350",
                color: "text-slate-900",
              },
              {
                label: "Checked In",
                value: checkedIn.toLocaleString(),
                sub: `${checkedInPct}% attendance rate`,
                color: "text-emerald-600",
              },
              {
                label: "Profile Completion",
                value: `${profileCompletionRate}%`,
                sub: `${Math.round(liveEvent.attendeeCount * profileCompletionRate / 100)} of ${liveEvent.attendeeCount} attendees`,
                color: "text-indigo-600",
              },
              {
                label: "Total Interactions",
                value: totalInteractions.toLocaleString(),
                sub: "scans, shares, visits",
                color: "text-slate-900",
              },
              {
                label: "Avg / Attendee",
                value: avgInteractionsPerAttendee.toString(),
                sub: "interactions per person",
                color: "text-violet-600",
              },
            ].map((m) => (
              <div key={m.label} className="px-6 py-5">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-[0.06em] leading-none mb-2">
                  {m.label}
                </p>
                <p className={`text-[26px] font-bold leading-none tracking-tight ${m.color}`}>
                  {m.value}
                </p>
                <p className="text-[12px] text-slate-400 mt-1.5 font-medium">{m.sub}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ── KPI cards (6) ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
        {[
          {
            label: "Total Attendees",
            value: liveEvent.attendeeCount.toLocaleString(),
            icon: Users,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
            change: "+12% vs last event",
          },
          {
            label: "Checked In",
            value: checkedIn.toString(),
            icon: UserCheck,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
            change: `${checkedInPct}% check-in rate`,
          },
          {
            label: "Avg Points / Attendee",
            value: avgPoints.toLocaleString(),
            icon: TrendingUp,
            bg: "bg-amber-50",
            color: "text-amber-600",
            change: "+8% engagement",
          },
          {
            label: "Total Interactions",
            value: totalInteractions.toLocaleString(),
            icon: BarChart3,
            bg: "bg-purple-50",
            color: "text-purple-600",
            change: "Across all booths",
          },
          {
            label: "Profile Completion",
            value: `${profileCompletionRate}%`,
            icon: Activity,
            bg: "bg-rose-50",
            color: "text-rose-500",
            change: `${Math.round(liveEvent.attendeeCount * profileCompletionRate / 100)} attendees complete`,
          },
          {
            label: "Avg Interactions / Person",
            value: avgInteractionsPerAttendee.toString(),
            icon: MousePointerClick,
            bg: "bg-cyan-50",
            color: "text-cyan-600",
            change: "scans, shares & visits",
          },
        ].map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Card key={kpi.label} className="rounded-2xl shadow-sm border-slate-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${kpi.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${kpi.color}`} />
                  </div>
                  <span className="text-[12.5px] font-medium text-slate-500 leading-tight">{kpi.label}</span>
                </div>
                <p className="text-[28px] font-bold text-slate-900 leading-none tracking-tight">{kpi.value}</p>
                <p className="text-[12.5px] text-slate-400 mt-2 font-medium">{kpi.change}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* ── Engagement over time ────────────────────────────────────────── */}
      <Card className="rounded-2xl shadow-sm border-slate-100">
        <CardHeader className="pb-1 pt-6 px-6">
          <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
            Engagement Over Time
          </CardTitle>
          <p className="text-[13px] text-slate-400 mt-0.5">Check-ins and engagement score by time of day</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={engagementOverTime} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
              <defs>
                <linearGradient id="engGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="checkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis
                dataKey="time"
                tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
                dy={6}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend
                wrapperStyle={{ fontSize: 13, paddingTop: 16, fontFamily: "inherit" }}
                formatter={(v) => (
                  <span style={{ color: "#64748b", fontWeight: 500 }}>
                    {v === "engagement" ? "Engagement" : "Check-ins"}
                  </span>
                )}
              />
              <Area type="monotone" dataKey="engagement" stroke="#6366f1" strokeWidth={2.5} fill="url(#engGrad)" />
              <Area type="monotone" dataKey="checkins"   stroke="#10b981" strokeWidth={2.5} fill="url(#checkGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ── Check-ins by hour + Points distribution ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-1 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Check-ins by Hour
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">Attendance distribution throughout the day</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={hourlyCheckins} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="hour"
                  tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "inherit" }}
                  axisLine={false}
                  tickLine={false}
                  dy={6}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "inherit" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip contentStyle={chartTooltipStyle} />
                <Bar dataKey="count" fill="#6366f1" radius={[5, 5, 0, 0]} name="Check-ins" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-1 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Points Distribution
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">How attendees are earning points</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pointsDistribution}
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={46}
                  dataKey="value"
                  nameKey="name"
                  label={false}
                  labelLine={false}
                  paddingAngle={2}
                >
                  {pointsDistribution.map((_, idx) => (
                    <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={chartTooltipStyle} />
                <Legend
                  wrapperStyle={{ fontSize: 12, fontFamily: "inherit", paddingTop: 8 }}
                  formatter={(v) => <span style={{ color: "#64748b", fontWeight: 500 }}>{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* ── Engagement by Attendee Type ─────────────────────────────────── */}
      <div>
        <div className="mb-4">
          <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Engagement by Attendee Type</h2>
          <p className="text-[13px] text-slate-500 mt-0.5">
            Check-in rates, average points, and interaction depth across all attendee categories
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
          {attendeeTypeEngagement.map((group) => {
            const pointsPct = Math.round((group.avgPoints / maxAvgPoints) * 100);
            return (
              <Card key={group.type} className="rounded-2xl shadow-sm border-slate-100 overflow-hidden">
                {/* Colored top bar */}
                <div className="h-1" style={{ backgroundColor: group.color }} />
                <CardContent className="p-5">
                  {/* Type + count */}
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="text-[15px] font-bold text-slate-900 leading-tight">{group.type}</p>
                      <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
                        {group.count} attendees
                      </p>
                    </div>
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${group.color}18` }}
                    >
                      <Users className="w-3.5 h-3.5" style={{ color: group.color }} />
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="space-y-3">
                    {/* Avg points with bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11.5px] font-medium text-slate-500">Avg Points</span>
                        <span className="text-[13px] font-bold text-slate-800">
                          {group.avgPoints.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${pointsPct}%`, backgroundColor: group.color }}
                        />
                      </div>
                    </div>

                    {/* Check-in rate with bar */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-[11.5px] font-medium text-slate-500">Check-in Rate</span>
                        <span
                          className={`text-[13px] font-bold ${
                            group.checkinRate >= 90
                              ? "text-emerald-600"
                              : group.checkinRate >= 70
                              ? "text-amber-600"
                              : "text-red-500"
                          }`}
                        >
                          {group.checkinRate}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            group.checkinRate >= 90
                              ? "bg-emerald-500"
                              : group.checkinRate >= 70
                              ? "bg-amber-400"
                              : "bg-red-400"
                          }`}
                          style={{ width: `${group.checkinRate}%` }}
                        />
                      </div>
                    </div>

                    {/* Avg interactions — single row stat */}
                    <div className="flex justify-between items-center pt-1 border-t border-slate-50">
                      <span className="text-[11.5px] font-medium text-slate-500">Avg Interactions</span>
                      <span className="text-[13px] font-bold text-slate-800">{group.avgInteractions}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Booth popularity ────────────────────────────────────────────── */}
      <Card className="rounded-2xl shadow-sm border-slate-100">
        <CardHeader className="pb-1 pt-6 px-6">
          <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
            Booth Popularity
          </CardTitle>
          <p className="text-[13px] text-slate-400 mt-0.5">Ranked by total visit count</p>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart
              data={horizontalBoothData}
              layout="vertical"
              margin={{ top: 4, right: 24, bottom: 0, left: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 12, fill: "#94a3b8", fontFamily: "inherit" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12, fill: "#475569", fontFamily: "inherit", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={90}
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Bar dataKey="visits" fill="#818cf8" radius={[0, 5, 5, 0]} name="Visits" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
