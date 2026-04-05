"use client";

import { Gift, Plus, Star, Package, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { rewards } from "@/lib/mock-data";

const categoryColors: Record<string, string> = {
  Merchandise: "bg-indigo-100 text-indigo-700",
  Experience: "bg-purple-100 text-purple-700",
  Digital: "bg-sky-100 text-sky-700",
  Software: "bg-emerald-100 text-emerald-700",
};

const categoryIcons: Record<string, string> = {
  Merchandise: "👕",
  Experience: "🎉",
  Digital: "🏆",
  Software: "💻",
};

const totalClaimed = rewards.reduce((sum, r) => sum + r.claimed, 0);
const totalStock = rewards.reduce((sum, r) => sum + r.stock, 0);

export default function RewardsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rewards</h1>
          <p className="text-slate-500 text-sm mt-1">
            {rewards.length} rewards · {totalClaimed} claimed of {totalStock} total
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Plus className="w-4 h-4" />
          Add Reward
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          {
            label: "Total Rewards",
            value: rewards.length,
            icon: Gift,
            bg: "bg-indigo-50",
            color: "text-indigo-600",
          },
          {
            label: "Total Claimed",
            value: totalClaimed,
            icon: Star,
            bg: "bg-amber-50",
            color: "text-amber-600",
          },
          {
            label: "Remaining Stock",
            value: totalStock - totalClaimed,
            icon: Package,
            bg: "bg-emerald-50",
            color: "text-emerald-600",
          },
        ].map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="rounded-xl shadow-sm border-slate-100">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                    <Icon className={`w-4 h-4 ${s.color}`} />
                  </div>
                  <div>
                    <p className="text-xl font-bold text-slate-900">{s.value}</p>
                    <p className="text-xs text-slate-500">{s.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Rewards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {rewards
          .slice()
          .sort((a, b) => b.claimed - a.claimed)
          .map((reward) => {
            const remaining = reward.stock - reward.claimed;
            const claimPct = Math.round((reward.claimed / reward.stock) * 100);
            const isLowStock = remaining <= reward.stock * 0.2;
            const isSoldOut = remaining === 0;

            return (
              <Card
                key={reward.id}
                className={`rounded-xl shadow-sm border-slate-100 hover:shadow-md transition-shadow ${
                  isSoldOut ? "opacity-70" : ""
                }`}
              >
                <CardContent className="p-5">
                  {/* Icon and category */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-2xl">
                      {categoryIcons[reward.category] || "🎁"}
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <Badge
                        className={`text-xs px-2 py-0.5 border-0 ${
                          categoryColors[reward.category] || "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {reward.category}
                      </Badge>
                      {isSoldOut ? (
                        <span className="text-xs font-semibold text-red-500">Sold Out</span>
                      ) : isLowStock ? (
                        <span className="flex items-center gap-1 text-xs font-semibold text-amber-600">
                          <AlertCircle className="w-3 h-3" /> Low Stock
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1">{reward.name}</h3>

                  {/* Point cost */}
                  <div className="flex items-center gap-1.5 mb-4">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-base font-bold text-amber-600">
                      {reward.pointCost.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-400">points</span>
                  </div>

                  {/* Stock progress */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs text-slate-500">
                      <span>Claimed: {reward.claimed}</span>
                      <span>Stock: {reward.stock}</span>
                    </div>
                    <Progress
                      value={claimPct}
                      className={`h-1.5 ${isSoldOut ? "bg-red-100" : "bg-slate-100"}`}
                    />
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">{claimPct}% claimed</span>
                      <span
                        className={`font-semibold ${
                          isSoldOut
                            ? "text-red-500"
                            : isLowStock
                            ? "text-amber-600"
                            : "text-slate-600"
                        }`}
                      >
                        {remaining} left
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    disabled={isSoldOut}
                    className={`w-full mt-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                      isSoldOut
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white"
                    }`}
                  >
                    {isSoldOut ? "Out of Stock" : "Manage Reward"}
                  </button>
                </CardContent>
              </Card>
            );
          })}
      </div>
    </div>
  );
}
