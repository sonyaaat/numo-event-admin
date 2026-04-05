"use client";

import {
  Users,
  ScanLine,
  Store,
  Trophy,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  events,
  dailyCheckins,
  boothVisitData,
  recentCheckIns,
  topPerformers,
} from "@/lib/mock-data";

const liveEvent = events.find((e) => e.status === "Live")!;

const kpiCards = [
  {
    label: "Total Attendees",
    value: liveEvent.attendeeCount.toLocaleString(),
    trend: "+12%",
    trendUp: true,
    icon: Users,
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
    subtext: "vs last event",
  },
  {
    label: "Checked In",
    value: liveEvent.checkedIn.toLocaleString(),
    trend: `${Math.round((liveEvent.checkedIn / liveEvent.attendeeCount) * 100)}%`,
    trendUp: true,
    icon: ScanLine,
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    subtext: "check-in rate",
  },
  {
    label: "Active Booths",
    value: liveEvent.boothCount.toString(),
    trend: "+2",
    trendUp: true,
    icon: Store,
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    subtext: "vs last event",
  },
  {
    label: "Challenges Completed",
    value: "512",
    trend: "-3%",
    trendUp: false,
    icon: Trophy,
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    subtext: "vs last event",
  },
];

const badgeColors: Record<string, string> = {
  "Top Performer": "bg-amber-100 text-amber-700",
  "Early Bird": "bg-sky-100 text-sky-700",
  "Challenge Master": "bg-purple-100 text-purple-700",
  Networker: "bg-indigo-100 text-indigo-700",
  "Quiz Wizard": "bg-emerald-100 text-emerald-700",
  "Social Butterfly": "bg-pink-100 text-pink-700",
  "Booth Explorer": "bg-orange-100 text-orange-700",
};

const chartTooltipStyle = {
  backgroundColor: "#1e293b",
  border: "none",
  borderRadius: "10px",
  color: "#f8fafc",
  fontSize: 13,
  padding: "8px 12px",
  boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Dashboard</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">
          Overview of{" "}
          <span className="font-semibold text-slate-700">{liveEvent.name}</span>
          <span className="ml-2 inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-emerald-600 font-medium">Live now</span>
          </span>
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpiCards.map((card) => {
          const Icon = card.icon;
          return (
            <Card key={card.label} className="rounded-2xl shadow-sm border-slate-100 bg-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[13px] font-medium text-slate-500 leading-none">{card.label}</p>
                    <p className="text-[36px] font-bold text-slate-900 mt-2.5 leading-none tracking-tight">
                      {card.value}
                    </p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.iconBg}`}>
                    <Icon className={`w-5 h-5 ${card.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-4">
                  {card.trendUp ? (
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 text-red-500" />
                  )}
                  <span
                    className={`text-[13px] font-semibold ${card.trendUp ? "text-emerald-600" : "text-red-500"}`}
                  >
                    {card.trend}
                  </span>
                  <span className="text-[13px] text-slate-400">{card.subtext}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Check-ins over time */}
        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-1 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Check-ins Over Time
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">Daily attendance for this event</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={dailyCheckins} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="date"
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
                <Line
                  type="monotone"
                  dataKey="checkins"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  dot={{ fill: "#6366f1", r: 4, strokeWidth: 0 }}
                  activeDot={{ r: 6, strokeWidth: 2, stroke: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Booth visits */}
        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-1 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Booth Visit Counts
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">Visits recorded per booth</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={boothVisitData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#94a3b8", fontFamily: "inherit" }}
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
                <Bar dataKey="visits" fill="#818cf8" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recent check-ins */}
        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-0 pt-6 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  Recent Check-ins
                </CardTitle>
                <p className="text-[13px] text-slate-400 mt-0.5">Latest arrivals at this event</p>
              </div>
              <button className="text-[13px] text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5 transition-colors">
                View all <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <div className="space-y-1">
              {recentCheckIns.map((checkin) => (
                <div
                  key={checkin.id}
                  className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                >
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[12px] font-bold">
                      {checkin.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800 truncate leading-tight">{checkin.name}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">{checkin.nfcTag}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[13px] font-semibold text-slate-600">{checkin.time}</p>
                    <div className="flex items-center gap-1 justify-end mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[12px] text-emerald-600 font-medium">Checked in</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top performers */}
        <Card className="rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-0 pt-6 px-6">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
                  Top Performers
                </CardTitle>
                <p className="text-[13px] text-slate-400 mt-0.5">Ranked by total points earned</p>
              </div>
              <button className="text-[13px] text-indigo-600 font-medium hover:text-indigo-700 flex items-center gap-0.5 transition-colors">
                Leaderboard <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-6 pt-4">
            <div className="space-y-1">
              {topPerformers.map((attendee, idx) => (
                <div
                  key={attendee.id}
                  className="flex items-center gap-3 py-3 border-b border-slate-50 last:border-0"
                >
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 ${
                      idx === 0
                        ? "bg-amber-100 text-amber-700"
                        : idx === 1
                        ? "bg-slate-200 text-slate-600"
                        : idx === 2
                        ? "bg-orange-100 text-orange-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {idx + 1}
                  </div>
                  <Avatar className="w-9 h-9 flex-shrink-0">
                    <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[12px] font-bold">
                      {attendee.name.split(" ").map((n) => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-[14px] font-semibold text-slate-800 truncate leading-tight">{attendee.name}</p>
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {attendee.badges.slice(0, 2).map((badge) => (
                        <span
                          key={badge}
                          className={`text-[11px] px-2 py-0.5 rounded-full font-medium leading-none ${
                            badgeColors[badge] || "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[15px] font-bold text-indigo-600 leading-tight">{attendee.points.toLocaleString()}</p>
                    <p className="text-[12px] text-slate-400 mt-0.5">pts</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
