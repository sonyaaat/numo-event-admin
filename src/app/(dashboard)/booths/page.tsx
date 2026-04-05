"use client";

import { Plus, Store, TrendingUp, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { booths } from "@/lib/mock-data";

const categoryColors: Record<string, string> = {
  Technology: "bg-indigo-100 text-indigo-700",
  Infrastructure: "bg-sky-100 text-sky-700",
  Security: "bg-red-100 text-red-700",
  Tools: "bg-emerald-100 text-emerald-700",
  "Emerging Tech": "bg-purple-100 text-purple-700",
  Startups: "bg-amber-100 text-amber-700",
  Community: "bg-green-100 text-green-700",
  Hardware: "bg-orange-100 text-orange-700",
};

const totalVisits = booths.reduce((sum, b) => sum + b.visits, 0);

export default function BoothsPage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Booths</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">
            <span className="font-semibold text-slate-700">{booths.length}</span> booths
            {" · "}
            <span className="font-semibold text-slate-700">{totalVisits.toLocaleString()}</span> total visits
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-[13.5px] font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          Add Booth
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-5">
        {[
          {
            label: "Total Booths",
            value: booths.length,
            icon: Store,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
          },
          {
            label: "Total Visits",
            value: totalVisits.toLocaleString(),
            icon: Users,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
          },
          {
            label: "Avg Visits / Booth",
            value: Math.round(totalVisits / booths.length),
            icon: TrendingUp,
            bg: "bg-amber-50",
            color: "text-amber-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="rounded-2xl shadow-sm border-slate-100">
              <CardContent className="p-5">
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-[22px] font-bold text-slate-900 leading-none">{s.value}</p>
                    <p className="text-[12.5px] text-slate-500 mt-1">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Booths grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {booths
          .slice()
          .sort((a, b) => b.visits - a.visits)
          .map((booth, idx) => {
            const visitPct = Math.round((booth.visits / booth.maxVisits) * 100);
            const isTop = idx === 0;
            return (
              <Card
                key={booth.id}
                className={`rounded-2xl shadow-sm border-slate-100 hover:shadow-md transition-all cursor-pointer ${
                  isTop ? "ring-2 ring-indigo-500/25 shadow-indigo-100" : ""
                }`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-3.5">
                    <div className="flex-1 min-w-0 mr-2">
                      {isTop && (
                        <span className="text-[11px] font-semibold text-indigo-600 mb-1.5 block tracking-wide uppercase">
                          ★ Top Booth
                        </span>
                      )}
                      <h3 className="text-[14px] font-bold text-slate-900 leading-snug">
                        {booth.name}
                      </h3>
                    </div>
                    <Badge
                      className={`text-[11px] px-2.5 py-1 border-0 flex-shrink-0 font-medium rounded-full ${
                        categoryColors[booth.category] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {booth.category}
                    </Badge>
                  </div>

                  <p className="text-[12.5px] text-slate-500 mb-5 line-clamp-2 leading-relaxed">{booth.description}</p>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[12.5px] font-medium">Visits</span>
                      </div>
                      <span className="text-[15px] font-bold text-slate-900">
                        {booth.visits.toLocaleString()}
                      </span>
                    </div>
                    <Progress
                      value={visitPct}
                      className="h-1.5 bg-slate-100"
                    />
                    <div className="flex justify-between text-[12px] text-slate-400 font-medium">
                      <span>{visitPct}% capacity</span>
                      <span>Max {booth.maxVisits}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
