"use client";

import { Trophy, Plus, Zap, Users, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { challenges } from "@/lib/mock-data";

const typeConfig: Record<string, { className: string; icon: string }> = {
  Visit: { className: "bg-indigo-100 text-indigo-700", icon: "🗺️" },
  Social: { className: "bg-pink-100 text-pink-700", icon: "📱" },
  Quiz: { className: "bg-amber-100 text-amber-700", icon: "🧠" },
  Scan: { className: "bg-emerald-100 text-emerald-700", icon: "📡" },
};

const totalCompletions = challenges.reduce((sum, c) => sum + c.completions, 0);
const totalPoints = challenges.reduce((sum, c) => sum + c.points * c.completions, 0);

export default function ChallengesPage() {
  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Challenges</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">
            <span className="font-semibold text-slate-700">{challenges.length}</span> challenges
            {" · "}
            <span className="font-semibold text-slate-700">{totalCompletions}</span> total completions
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-[13.5px] font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          Add Challenge
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-5">
        {[
          { label: "Total Challenges", value: challenges.length, icon: Trophy, bg: "bg-amber-50", color: "text-amber-600" },
          { label: "Completions", value: totalCompletions, icon: Zap, bg: "bg-indigo-50", color: "text-indigo-600" },
          { label: "Points Awarded", value: totalPoints.toLocaleString(), icon: Star, bg: "bg-emerald-50", color: "text-emerald-600" },
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

      {/* Challenges list */}
      <div className="space-y-3">
        {challenges
          .slice()
          .sort((a, b) => b.completions - a.completions)
          .map((challenge) => {
            const completionRate = Math.round(
              (challenge.completions / challenge.totalParticipants) * 100
            );
            const config = typeConfig[challenge.type] || {
              className: "bg-slate-100 text-slate-600",
              icon: "🎯",
            };

            return (
              <Card
                key={challenge.id}
                className="rounded-2xl shadow-sm border-slate-100 hover:shadow-md transition-all"
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {/* Icon */}
                    <div className="w-11 h-11 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl flex-shrink-0">
                      {config.icon}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap mb-1.5">
                        <h3 className="text-[15px] font-bold text-slate-900">{challenge.title}</h3>
                        <Badge
                          className={`text-[11.5px] px-2.5 py-0.5 border-0 rounded-full font-medium ${config.className}`}
                        >
                          {challenge.type}
                        </Badge>
                      </div>
                      <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">{challenge.description}</p>

                      <div className="flex items-center gap-6">
                        <div className="flex-1 max-w-xs">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-[12.5px] font-medium text-slate-500">Completion rate</span>
                            <span className="text-[13px] font-bold text-slate-700">
                              {completionRate}%
                            </span>
                          </div>
                          <Progress value={completionRate} className="h-1.5 bg-slate-100" />
                          <p className="text-[12px] text-slate-400 mt-1.5 font-medium">
                            {challenge.completions} of {challenge.totalParticipants} participants
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex-shrink-0 text-right pl-2">
                      <div className="text-[28px] font-bold text-indigo-600 leading-none">
                        {challenge.points}
                      </div>
                      <div className="text-[12px] text-slate-400 mt-1 font-medium">points</div>
                      <div className="mt-3 flex items-center gap-1 justify-end text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[12.5px] font-medium">{challenge.completions} done</span>
                      </div>
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
