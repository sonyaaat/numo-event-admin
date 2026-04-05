"use client";

import { useState } from "react";
import { Users, TrendingUp, BadgeCheck, Network, CircleAlert, CircleCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { attendees, events } from "@/lib/mock-data";

type Filter = "all" | "completed" | "incomplete";

const fmt = new Intl.DateTimeFormat(undefined, {
  month: "short",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

function formatRegisteredAt(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return fmt.format(d);
}

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0] ?? "")
    .join("")
    .toUpperCase();
}

function clampPct(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

export default function CheckInPage() {
  const [filter, setFilter] = useState<Filter>("incomplete");

  const liveEvent = events.find((e) => e.status === "Live") ?? events[0];
  const eventAttendees = attendees.filter((a) => a.eventId === liveEvent.id);

  const totalRegistered = eventAttendees.length;
  const registrationRate = liveEvent.attendeeCount
    ? clampPct((totalRegistered / liveEvent.attendeeCount) * 100)
    : 0;

  const profilesComplete = eventAttendees.filter((a) => a.profileCompletion >= 100).length;
  const profileCompletionRate = totalRegistered
    ? clampPct((profilesComplete / totalRegistered) * 100)
    : 0;

  const networkingEnabledCount = eventAttendees.filter((a) => a.networkingEnabled).length;
  const networkingEnabledRate = totalRegistered
    ? clampPct((networkingEnabledCount / totalRegistered) * 100)
    : 0;

  const readyCount = eventAttendees.filter((a) => a.profileCompletion >= 100 && a.networkingEnabled).length;
  const readyRate = totalRegistered ? clampPct((readyCount / totalRegistered) * 100) : 0;

  const incompleteProfiles = eventAttendees.filter((a) => a.profileCompletion < 100);
  const needsAction = eventAttendees.filter((a) => a.profileCompletion < 100 || !a.networkingEnabled);
  const readyAttendees = eventAttendees.filter((a) => a.profileCompletion >= 100 && a.networkingEnabled);

  const filteredAttendees = (filter === "all"
    ? eventAttendees
    : filter === "completed"
    ? readyAttendees
    : needsAction
  ).slice();

  const recentRegistrations = eventAttendees
    .slice()
    .sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime())
    .slice(0, 6);

  const kpiCards = [
    {
      label: "Total Registered",
      value: totalRegistered.toLocaleString(),
      subtext: `${readyCount} ready · ${needsAction.length} need action`,
      icon: Users,
      bg: "bg-indigo-50",
      color: "text-indigo-600",
    },
    {
      label: "Registration Rate",
      value: `${registrationRate}%`,
      subtext: `${totalRegistered.toLocaleString()} of ${liveEvent.attendeeCount.toLocaleString()} expected`,
      icon: TrendingUp,
      bg: "bg-emerald-50",
      color: "text-emerald-600",
    },
    {
      label: "Profile Completion",
      value: `${profileCompletionRate}%`,
      subtext: `${profilesComplete} complete · ${incompleteProfiles.length} incomplete`,
      icon: BadgeCheck,
      bg: "bg-amber-50",
      color: "text-amber-600",
    },
    {
      label: "Networking Enabled",
      value: networkingEnabledCount.toLocaleString(),
      subtext: `${networkingEnabledRate}% of registrants`,
      icon: Network,
      bg: "bg-sky-50",
      color: "text-sky-600",
    },
  ];

  const getIssues = (a: (typeof eventAttendees)[number]) => {
    const issues: { label: string; className: string }[] = [];
    if (a.profileCompletion < 100) {
      issues.push({ label: `Profile ${a.profileCompletion}%`, className: "bg-amber-100 text-amber-700" });
    }
    if (!a.networkingEnabled) {
      issues.push({ label: "Networking off", className: "bg-slate-100 text-slate-600" });
    }
    return issues;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">
          Registration & Onboarding
        </h1>
        <p className="text-slate-500 text-[14px] mt-1.5">
          Organizer view of who registered, completed their profile, and is ready for {" "}
          <span className="font-semibold text-slate-700">{liveEvent.name}</span>.
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
                    <p className="text-[34px] font-bold text-slate-900 mt-2.5 leading-none tracking-tight">
                      {card.value}
                    </p>
                  </div>
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <p className="text-[13px] text-slate-400 mt-4">{card.subtext}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Overview + recent registrations */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Readiness overview
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">
              Track registration progress and onboarding completion before the event.
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[13px] font-medium text-slate-600">Registration progress</p>
                  <p className="text-[13px] font-semibold text-slate-700 tabular-nums">
                    {totalRegistered} / {liveEvent.attendeeCount} ({registrationRate}%)
                  </p>
                </div>
                <Progress value={registrationRate} className="h-1.5 bg-slate-100 mt-2" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-slate-700">Profile completion</p>
                    <p className="text-[13px] font-semibold text-slate-700 tabular-nums">{profileCompletionRate}%</p>
                  </div>
                  <Progress value={profileCompletionRate} className="h-1.5 bg-slate-100 mt-2" />
                  <p className="text-[12.5px] text-slate-400 mt-2">
                    {profilesComplete} complete · {incompleteProfiles.length} need updates
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[13px] font-semibold text-slate-700">Networking setup</p>
                    <p className="text-[13px] font-semibold text-slate-700 tabular-nums">{networkingEnabledRate}%</p>
                  </div>
                  <Progress value={networkingEnabledRate} className="h-1.5 bg-slate-100 mt-2" />
                  <p className="text-[12.5px] text-slate-400 mt-2">
                    {networkingEnabledCount} enabled · {totalRegistered - networkingEnabledCount} disabled
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-slate-100 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[13px] font-semibold text-slate-900">Ready for participation</p>
                    <p className="text-[12.5px] text-slate-400 mt-0.5">
                      Ready = profile complete + networking enabled
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[22px] font-bold text-slate-900 leading-none tabular-nums">{readyCount}</p>
                    <p className="text-[12.5px] text-slate-400 mt-1 tabular-nums">{readyRate}%</p>
                  </div>
                </div>
                <Progress value={readyRate} className="h-1.5 bg-slate-100 mt-3" />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <CircleAlert className="w-4 h-4 text-amber-600" />
                      <p className="text-[12.5px] font-semibold text-slate-700">Needs action</p>
                      <span className="ml-auto text-[12.5px] font-semibold text-slate-700 tabular-nums">
                        {needsAction.length}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {needsAction.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between">
                          <p className="text-[12.5px] text-slate-600 font-medium truncate pr-2">{a.name}</p>
                          <div className="flex gap-1.5 flex-shrink-0">
                            {getIssues(a)
                              .slice(0, 2)
                              .map((i) => (
                                <span
                                  key={i.label}
                                  className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${i.className}`}
                                >
                                  {i.label}
                                </span>
                              ))}
                          </div>
                        </div>
                      ))}
                      {needsAction.length === 0 && (
                        <p className="text-[12.5px] text-slate-400">No action needed.</p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <div className="flex items-center gap-2">
                      <CircleCheck className="w-4 h-4 text-emerald-600" />
                      <p className="text-[12.5px] font-semibold text-slate-700">Ready</p>
                      <span className="ml-auto text-[12.5px] font-semibold text-slate-700 tabular-nums">
                        {readyCount}
                      </span>
                    </div>
                    <div className="mt-2 space-y-2">
                      {readyAttendees.slice(0, 3).map((a) => (
                        <div key={a.id} className="flex items-center justify-between">
                          <p className="text-[12.5px] text-slate-600 font-medium truncate pr-2">{a.name}</p>
                          <span className="text-[11px] px-2 py-0.5 rounded-full font-medium bg-emerald-100 text-emerald-700">
                            Ready
                          </span>
                        </div>
                      ))}
                      {readyCount === 0 && <p className="text-[12.5px] text-slate-400">No one is ready yet.</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 rounded-2xl shadow-sm border-slate-100">
          <CardHeader className="pb-2 pt-6 px-6">
            <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
              Recent registrations
            </CardTitle>
            <p className="text-[13px] text-slate-400 mt-0.5">Most recent signups for this event</p>
          </CardHeader>
          <CardContent className="px-6 pb-6">
            <div className="space-y-3">
              {recentRegistrations.map((a) => {
                const isReady = a.profileCompletion >= 100 && a.networkingEnabled;
                return (
                  <div
                    key={a.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                  >
                    <Avatar className="w-9 h-9 flex-shrink-0">
                      <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[12px] font-bold">
                        {initials(a.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13.5px] font-semibold text-slate-800 truncate">{a.name}</p>
                      <p className="text-[12px] text-slate-400 truncate">
                        {a.company} · {formatRegisteredAt(a.registeredAt)}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <span
                        className={`text-[11px] px-2.5 py-1 rounded-full font-medium border-0 inline-flex items-center gap-1.5 ${
                          isReady ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${isReady ? "bg-emerald-500" : "bg-amber-500"}`} />
                        {isReady ? "Ready" : "In progress"}
                      </span>
                      <p className="text-[12px] text-slate-400 mt-1 tabular-nums">Profile {a.profileCompletion}%</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action table */}
      <Card className="rounded-2xl shadow-sm border-slate-100 overflow-hidden">
        <CardHeader className="pb-3 pt-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <div>
              <CardTitle className="text-[15px] font-semibold text-slate-900 tracking-tight">
                Onboarding status
              </CardTitle>
              <p className="text-[13px] text-slate-400 mt-0.5">
                Focus on attendees who still need action before the event.
              </p>
            </div>
            <div className="flex gap-2">
              {([
                { key: "all", label: `All (${eventAttendees.length})` },
                { key: "completed", label: `Completed (${readyCount})` },
                { key: "incomplete", label: `Incomplete (${needsAction.length})` },
              ] as const).map((t) => (
                <button
                  key={t.key}
                  onClick={() => setFilter(t.key)}
                  className={`px-3.5 py-2 text-[12.5px] font-medium rounded-lg border transition-colors ${
                    filter === t.key
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                      : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0 px-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80">
                  <th className="text-left px-6 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                    Attendee
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] hidden md:table-cell">
                    Registered
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                    Profile
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] hidden lg:table-cell">
                    Networking
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                    Status
                  </th>
                  <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                    Needs action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAttendees
                  .sort((a, b) => {
                    const aReady = a.profileCompletion >= 100 && a.networkingEnabled;
                    const bReady = b.profileCompletion >= 100 && b.networkingEnabled;
                    if (aReady !== bReady) return aReady ? 1 : -1;
                    return new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime();
                  })
                  .map((a) => {
                    const isReady = a.profileCompletion >= 100 && a.networkingEnabled;
                    const issues = getIssues(a);
                    return (
                      <tr key={a.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Avatar className="w-9 h-9 flex-shrink-0">
                              <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[12px] font-bold">
                                {initials(a.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <p className="text-[14px] font-semibold text-slate-800 truncate leading-tight">
                                {a.name}
                              </p>
                              <p className="text-[12px] text-slate-400 truncate mt-0.5">{a.company}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <p className="text-[13px] text-slate-600 font-medium tabular-nums">
                            {formatRegisteredAt(a.registeredAt)}
                          </p>
                        </td>
                        <td className="px-5 py-4">
                          <div className="min-w-[120px]">
                            <div className="flex items-center justify-between">
                              <span className="text-[13px] font-semibold text-slate-700 tabular-nums">
                                {a.profileCompletion}%
                              </span>
                              <span className={`text-[12px] font-medium ${a.profileCompletion >= 100 ? "text-emerald-600" : "text-amber-600"}`}>
                                {a.profileCompletion >= 100 ? "Complete" : "Incomplete"}
                              </span>
                            </div>
                            <Progress value={clampPct(a.profileCompletion)} className="h-1.5 bg-slate-100 mt-2" />
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <Badge
                            className={`text-[11.5px] px-2.5 py-1 border-0 rounded-full font-medium ${
                              a.networkingEnabled ? "bg-sky-100 text-sky-700" : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {a.networkingEnabled ? "Enabled" : "Disabled"}
                          </Badge>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${isReady ? "bg-emerald-500" : "bg-amber-500"}`} />
                            <span className={`text-[13px] font-medium ${isReady ? "text-emerald-700" : "text-amber-700"}`}>
                              {isReady ? "Ready" : "In progress"}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          {issues.length === 0 ? (
                            <span className="text-[13px] text-slate-400">—</span>
                          ) : (
                            <div className="flex flex-wrap gap-1.5">
                              {issues.map((i) => (
                                <span
                                  key={i.label}
                                  className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${i.className}`}
                                >
                                  {i.label}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {filteredAttendees.length === 0 && (
            <div className="py-16 text-center">
              <p className="text-slate-400 text-[14px]">No attendees match this filter.</p>
            </div>
          )}

          <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
            <p className="text-[13px] text-slate-500">
              Showing <span className="font-semibold text-slate-700">{filteredAttendees.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{eventAttendees.length}</span> registrants
            </p>
            <p className="text-[13px] text-slate-400">
              Incomplete profiles: <span className="font-semibold text-slate-600">{incompleteProfiles.length}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
