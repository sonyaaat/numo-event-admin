"use client";

import { useState } from "react";
import {
  MessageSquare,
  Star,
  ThumbsUp,
  TrendingUp,
  Plus,
  X,
  Check,
  ClipboardList,
  Users,
  ChevronDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  feedbackEntries,
  feedbackStats,
  ratingDistribution,
  feedbackThemes,
  feedbackSurveys,
  events,
  type FeedbackEntry,
  type FeedbackSurvey,
} from "@/lib/mock-data";

const liveEvent = events.find((e) => e.status === "Live")!;

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRow({ rating, max = 5 }: { rating: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(
            "w-3.5 h-3.5",
            i < rating ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"
          )}
        />
      ))}
    </div>
  );
}

const attendeeTypeBadge: Record<string, string> = {
  VIP:     "bg-indigo-100 text-indigo-700",
  Speaker: "bg-violet-100 text-violet-700",
  Sponsor: "bg-amber-100  text-amber-700",
  Guest:   "bg-emerald-100 text-emerald-700",
  Student: "bg-cyan-100   text-cyan-700",
};

const categoryBadge: Record<string, string> = {
  Overall:      "bg-slate-100 text-slate-600",
  Booths:       "bg-indigo-100 text-indigo-700",
  Networking:   "bg-emerald-100 text-emerald-700",
  Organization: "bg-amber-100 text-amber-700",
  Content:      "bg-purple-100 text-purple-700",
};

const surveyStatusConfig: Record<string, { label: string; className: string; dot?: boolean }> = {
  Active: { label: "Active",  className: "bg-emerald-100 text-emerald-700", dot: true },
  Draft:  { label: "Draft",   className: "bg-amber-100  text-amber-700" },
  Closed: { label: "Closed",  className: "bg-slate-100  text-slate-500" },
};

type RatingFilter = "all" | 5 | 4 | 3 | "low";

// ─── Create Survey Modal ───────────────────────────────────────────────────────

const PRESET_QUESTIONS = [
  { id: "q1", label: "Overall experience (1–5 star rating)", defaultOn: true },
  { id: "q2", label: "What did you enjoy most? (open text)",  defaultOn: true },
  { id: "q3", label: "Would you attend again? (Yes / No)",    defaultOn: true },
  { id: "q4", label: "Rate the booth experience (1–5 stars)", defaultOn: false },
  { id: "q5", label: "Suggestions for improvement (open text)", defaultOn: false },
];

function CreateSurveyModal({
  onClose,
  onSave,
}: {
  onClose: () => void;
  onSave: (survey: FeedbackSurvey) => void;
}) {
  const [title, setTitle] = useState("");
  const [selected, setSelected] = useState<Record<string, boolean>>(
    Object.fromEntries(PRESET_QUESTIONS.map((q) => [q.id, q.defaultOn]))
  );
  const [titleError, setTitleError] = useState(false);

  const toggle = (id: string) =>
    setSelected((s) => ({ ...s, [id]: !s[id] }));

  const questionCount = Object.values(selected).filter(Boolean).length;

  const handleSave = () => {
    if (!title.trim()) { setTitleError(true); return; }
    onSave({
      id: `sv-${Date.now()}`,
      title: title.trim(),
      questionCount,
      responses: 0,
      status: "Draft",
      createdDate: "Today",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl shadow-slate-900/20 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-[16px] font-bold text-slate-900 tracking-tight">Create Survey</h3>
            <p className="text-[12.5px] text-slate-500 mt-0.5">Choose a title and select the questions to include.</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">
              Survey Title <span className="text-red-400">*</span>
            </label>
            <input
              autoFocus
              type="text"
              placeholder="e.g. Post-Event Experience Survey"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setTitleError(false); }}
              className={cn(
                "w-full px-3 py-2.5 text-[13.5px] border rounded-lg bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors",
                titleError ? "border-red-300 bg-red-50/30" : "border-slate-200"
              )}
            />
            {titleError && <p className="text-[12px] text-red-500 font-medium">Required</p>}
          </div>

          {/* Questions */}
          <div className="space-y-1.5">
            <label className="block text-[13px] font-semibold text-slate-700">
              Questions ({questionCount} selected)
            </label>
            <div className="space-y-2">
              {PRESET_QUESTIONS.map((q) => (
                <button
                  key={q.id}
                  onClick={() => toggle(q.id)}
                  className={cn(
                    "w-full text-left flex items-center gap-3 px-3.5 py-3 rounded-xl border transition-all text-[13px]",
                    selected[q.id]
                      ? "border-indigo-200 bg-indigo-50/60 text-slate-800"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all",
                    selected[q.id] ? "bg-indigo-600 border-indigo-600" : "border-slate-300"
                  )}>
                    {selected[q.id] && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <span className="font-medium">{q.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50">
          <button onClick={onClose} className="text-[13.5px] font-medium text-slate-500 hover:text-slate-700 transition-colors">
            Cancel
          </button>
          <Button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-5 h-9 text-[13.5px] font-semibold shadow-sm"
          >
            <Check className="w-3.5 h-3.5" />
            Save as Draft
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function FeedbackPage() {
  const [ratingFilter, setRatingFilter] = useState<RatingFilter>("all");
  const [surveys, setSurveys] = useState<FeedbackSurvey[]>(feedbackSurveys);
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);

  const filteredEntries = feedbackEntries.filter((e) => {
    if (ratingFilter === "all") return true;
    if (ratingFilter === "low") return e.rating <= 2;
    return e.rating === ratingFilter;
  });

  const maxRatingCount = Math.max(...ratingDistribution.map((r) => r.count));

  return (
    <>
      <div className="space-y-8">

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Feedback</h1>
            <p className="text-[14px] text-slate-500 mt-1.5">
              Collected from{" "}
              <span className="font-semibold text-slate-700">{liveEvent.name}</span>
              <span className="ml-2 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-emerald-600 font-medium">Live now</span>
              </span>
            </p>
          </div>
          <Button
            onClick={() => setShowCreateSurvey(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-[13.5px] font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Survey
          </Button>
        </div>

        {/* ── KPI Cards ────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            {
              label: "Total Responses",
              value: feedbackStats.totalResponses.toString(),
              sub: `out of ${liveEvent.checkedIn} checked-in`,
              icon: MessageSquare,
              iconBg: "bg-indigo-100",
              iconColor: "text-indigo-600",
            },
            {
              label: "Average Rating",
              value: feedbackStats.avgRating.toFixed(1),
              sub: "out of 5.0 stars",
              icon: Star,
              iconBg: "bg-amber-100",
              iconColor: "text-amber-500",
              stars: true,
            },
            {
              label: "Positive Responses",
              value: `${feedbackStats.positiveRate}%`,
              sub: "rated 4 or 5 stars",
              icon: ThumbsUp,
              iconBg: "bg-emerald-100",
              iconColor: "text-emerald-600",
            },
            {
              label: "Response Rate",
              value: `${feedbackStats.responseRate}%`,
              sub: "of attendees responded",
              icon: TrendingUp,
              iconBg: "bg-violet-100",
              iconColor: "text-violet-600",
            },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <Card key={kpi.label} className="rounded-2xl shadow-sm border-slate-100">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-[13px] font-medium text-slate-500 leading-none">{kpi.label}</p>
                      <p className="text-[36px] font-bold text-slate-900 mt-2.5 leading-none tracking-tight">
                        {kpi.value}
                      </p>
                    </div>
                    <div className={cn("w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0", kpi.iconBg)}>
                      <Icon className={cn("w-5 h-5", kpi.iconColor)} />
                    </div>
                  </div>
                  {kpi.stars ? (
                    <div className="mt-3">
                      <StarRow rating={Math.round(feedbackStats.avgRating)} />
                    </div>
                  ) : (
                    <p className="text-[12.5px] text-slate-400 mt-3 font-medium">{kpi.sub}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* ── Distribution + Themes ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Rating distribution */}
          <Card className="rounded-2xl shadow-sm border-slate-100">
            <CardHeader className="pb-1 pt-6 px-6">
              <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
                Rating Distribution
              </CardTitle>
              <p className="text-[13px] text-slate-400 mt-0.5">Breakdown of all {feedbackStats.totalResponses} submitted ratings</p>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="space-y-3.5">
                {ratingDistribution.map((row) => {
                  const pct = Math.round((row.count / maxRatingCount) * 100);
                  const pctOfTotal = Math.round((row.count / feedbackStats.totalResponses) * 100);
                  const barColor =
                    row.stars >= 4 ? "bg-emerald-500" :
                    row.stars === 3 ? "bg-amber-400" :
                    "bg-red-400";
                  return (
                    <div key={row.stars} className="flex items-center gap-3">
                      {/* Stars label */}
                      <div className="flex items-center gap-1 w-20 flex-shrink-0">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={cn(
                              "w-3 h-3",
                              i < row.stars ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"
                            )}
                          />
                        ))}
                      </div>
                      {/* Bar */}
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={cn("h-full rounded-full transition-all", barColor)}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      {/* Count + % */}
                      <div className="w-16 flex-shrink-0 text-right">
                        <span className="text-[13px] font-bold text-slate-800">{row.count}</span>
                        <span className="text-[12px] text-slate-400 ml-1">({pctOfTotal}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Top themes */}
          <Card className="rounded-2xl shadow-sm border-slate-100">
            <CardHeader className="pb-1 pt-6 px-6">
              <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
                Top Feedback Themes
              </CardTitle>
              <p className="text-[13px] text-slate-400 mt-0.5">Most mentioned topics across all responses</p>
            </CardHeader>
            <CardContent className="px-6 pb-6 pt-4">
              <div className="space-y-2.5">
                {feedbackThemes.map((t, i) => {
                  const sentimentBadge =
                    t.sentiment === "positive" ? "bg-emerald-100 text-emerald-700" :
                    t.sentiment === "neutral"  ? "bg-amber-100  text-amber-700"  :
                                                 "bg-red-100    text-red-600";
                  const sentimentLabel =
                    t.sentiment === "positive" ? "Positive" :
                    t.sentiment === "neutral"  ? "Neutral"  : "Negative";

                  return (
                    <div key={t.theme} className="flex items-center gap-3 py-2 border-b border-slate-50 last:border-0">
                      <span className="text-[12px] font-bold text-slate-400 w-4 flex-shrink-0">{i + 1}</span>
                      <p className="flex-1 text-[13.5px] font-semibold text-slate-800">{t.theme}</p>
                      <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", sentimentBadge)}>
                        {sentimentLabel}
                      </span>
                      <span className="text-[13px] font-bold text-slate-500 w-8 text-right flex-shrink-0">
                        {t.count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

        </div>

        {/* ── Feedback Table ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Recent Responses</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">
                Showing {filteredEntries.length} of {feedbackEntries.length} collected responses
              </p>
            </div>
            {/* Rating filter */}
            <div className="flex gap-2">
              {([
                { key: "all", label: "All" },
                { key: 5,     label: "5★" },
                { key: 4,     label: "4★" },
                { key: 3,     label: "3★" },
                { key: "low", label: "≤2★" },
              ] as { key: RatingFilter; label: string }[]).map((f) => (
                <button
                  key={String(f.key)}
                  onClick={() => setRatingFilter(f.key)}
                  className={cn(
                    "px-3 py-1.5 text-[12.5px] font-medium rounded-lg border transition-colors",
                    ratingFilter === f.key
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/80">
                    {["Attendee", "Type", "Rating", "Comment", "Category", "Date"].map((h) => (
                      <th
                        key={h}
                        className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredEntries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-[14px] font-semibold text-slate-800 whitespace-nowrap leading-tight">
                          {entry.attendeeName}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("text-[11.5px] font-semibold px-2.5 py-1 rounded-full", attendeeTypeBadge[entry.attendeeType])}>
                          {entry.attendeeType}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <StarRow rating={entry.rating} />
                      </td>
                      <td className="px-5 py-4 max-w-sm">
                        <p className="text-[13px] text-slate-600 line-clamp-2 leading-relaxed">
                          "{entry.comment}"
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={cn("text-[11.5px] font-medium px-2.5 py-1 rounded-full", categoryBadge[entry.category])}>
                          {entry.category}
                        </span>
                      </td>
                      <td className="px-5 py-4 whitespace-nowrap">
                        <p className="text-[13px] text-slate-500 font-medium">{entry.date}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredEntries.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-[14px] text-slate-400">No responses match the selected filter.</p>
              </div>
            )}

            <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/60">
              <p className="text-[13px] text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-700">{filteredEntries.length}</span> of{" "}
                <span className="font-semibold text-slate-700">{feedbackStats.totalResponses}</span> total responses
              </p>
            </div>
          </div>
        </div>

        {/* ── Surveys ───────────────────────────────────────────────────────── */}
        <div>
          <div className="mb-4">
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Surveys & Polls</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {surveys.filter((s) => s.status === "Active").length} active ·{" "}
              {surveys.filter((s) => s.status === "Draft").length} draft ·{" "}
              {surveys.filter((s) => s.status === "Closed").length} closed
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {surveys.map((survey) => {
              const sc = surveyStatusConfig[survey.status];
              return (
                <Card key={survey.id} className="rounded-2xl shadow-sm border-slate-100 hover:shadow-md transition-all cursor-pointer">
                  <CardContent className="p-5">
                    {/* Status */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-semibold px-2.5 py-1 rounded-full", sc.className)}>
                        {sc.dot && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                        {sc.label}
                      </span>
                    </div>

                    {/* Title */}
                    <p className="text-[14px] font-bold text-slate-900 leading-snug mb-1">{survey.title}</p>
                    <p className="text-[12.5px] text-slate-500">{survey.questionCount} questions</p>

                    {/* Response count */}
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <Users className="w-3.5 h-3.5" />
                        <span className="text-[13px] font-medium">
                          {survey.responses > 0 ? `${survey.responses} responses` : "No responses yet"}
                        </span>
                      </div>
                      <span className="text-[12px] text-slate-400">{survey.createdDate}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

      </div>

      {/* Create Survey Modal */}
      {showCreateSurvey && (
        <CreateSurveyModal
          onClose={() => setShowCreateSurvey(false)}
          onSave={(survey) => {
            setSurveys((prev) => [survey, ...prev]);
            setShowCreateSurvey(false);
          }}
        />
      )}
    </>
  );
}
