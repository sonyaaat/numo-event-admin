"use client";

import { useState } from "react";
import { Search, Download, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { attendees } from "@/lib/mock-data";

const badgeColors: Record<string, string> = {
  "Top Performer": "bg-amber-100 text-amber-700",
  "Early Bird": "bg-sky-100 text-sky-700",
  "Challenge Master": "bg-purple-100 text-purple-700",
  Networker: "bg-indigo-100 text-indigo-700",
  "Quiz Wizard": "bg-emerald-100 text-emerald-700",
  "Social Butterfly": "bg-pink-100 text-pink-700",
  "Booth Explorer": "bg-orange-100 text-orange-700",
};

type SortKey = "name" | "points" | "badges";
type FilterStatus = "all" | "checked-in" | "not-checked-in";

export default function AttendeesPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [sortKey, setSortKey] = useState<SortKey>("points");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filtered = attendees
    .filter((a) => {
      const q = search.toLowerCase();
      const matchSearch =
        a.name.toLowerCase().includes(q) ||
        a.email.toLowerCase().includes(q) ||
        a.company.toLowerCase().includes(q) ||
        a.nfcTag.toLowerCase().includes(q);
      const matchStatus =
        filterStatus === "all"
          ? true
          : filterStatus === "checked-in"
          ? a.checkedIn
          : !a.checkedIn;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "name") cmp = a.name.localeCompare(b.name);
      else if (sortKey === "points") cmp = a.points - b.points;
      else if (sortKey === "badges") cmp = a.badges.length - b.badges.length;
      return sortDir === "asc" ? cmp : -cmp;
    });

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortDir === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5 inline ml-1 text-indigo-500" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5 inline ml-1 text-indigo-500" />
      )
    ) : (
      <ChevronDown className="w-3.5 h-3.5 inline ml-1 opacity-25" />
    );

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Attendees</h1>
          <p className="text-[14px] text-slate-500 mt-1.5">
            <span className="font-semibold text-slate-700">{filtered.length}</span> attendees
            {" · "}
            <span className="font-semibold text-emerald-600">
              {attendees.filter((a) => a.checkedIn).length}
            </span>{" "}
            checked in
          </p>
        </div>
        <Button variant="outline" className="gap-2 text-[13px] border-slate-200 text-slate-600 h-9">
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, company…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-[13.5px] border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors placeholder:text-slate-400"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "checked-in", "not-checked-in"] as FilterStatus[]).map((f) => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3.5 py-2 text-[12.5px] font-medium rounded-lg border transition-colors ${
                filterStatus === f
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:border-slate-300"
              }`}
            >
              {f === "all" ? "All" : f === "checked-in" ? "Checked In" : "Not Checked In"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/80">
                <th className="text-left px-6 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                  <button onClick={() => toggleSort("name")} className="hover:text-slate-800 transition-colors">
                    Attendee <SortIcon k="name" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] hidden md:table-cell">
                  Company
                </th>
                <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] hidden lg:table-cell">
                  NFC Tag
                </th>
                <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                  Status
                </th>
                <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">
                  <button onClick={() => toggleSort("points")} className="hover:text-slate-800 transition-colors">
                    Points <SortIcon k="points" />
                  </button>
                </th>
                <th className="text-left px-5 py-3.5 text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em] hidden xl:table-cell">
                  <button onClick={() => toggleSort("badges")} className="hover:text-slate-800 transition-colors">
                    Badges <SortIcon k="badges" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((attendee) => (
                <tr
                  key={attendee.id}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-9 h-9 flex-shrink-0">
                        <AvatarFallback className="bg-indigo-100 text-indigo-700 text-[12px] font-bold">
                          {attendee.name.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-[14px] font-semibold text-slate-800 truncate leading-tight">
                          {attendee.name}
                        </p>
                        <p className="text-[12px] text-slate-400 truncate mt-0.5">{attendee.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <p className="text-[13.5px] text-slate-600 font-medium">{attendee.company}</p>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <code className="text-[12px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-md font-mono tracking-wide">
                      {attendee.nfcTag}
                    </code>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${
                          attendee.checkedIn ? "bg-emerald-500" : "bg-slate-300"
                        }`}
                      />
                      <span
                        className={`text-[13px] font-medium ${
                          attendee.checkedIn ? "text-emerald-700" : "text-slate-400"
                        }`}
                      >
                        {attendee.checkedIn ? "Checked In" : "Not In"}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-[14px] font-bold text-indigo-600">
                      {attendee.points.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden xl:table-cell">
                    <div className="flex flex-wrap gap-1.5 max-w-[220px]">
                      {attendee.badges.length === 0 ? (
                        <span className="text-[12px] text-slate-400">No badges</span>
                      ) : (
                        <>
                          {attendee.badges.slice(0, 2).map((badge) => (
                            <span
                              key={badge}
                              className={`text-[11.5px] px-2.5 py-1 rounded-full font-medium leading-none ${
                                badgeColors[badge] || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {badge}
                            </span>
                          ))}
                          {attendee.badges.length > 2 && (
                            <span className="text-[11.5px] px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 font-medium leading-none">
                              +{attendee.badges.length - 2}
                            </span>
                          )}
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filtered.length === 0 && (
          <div className="py-20 text-center">
            <p className="text-slate-400 text-[14px]">No attendees found matching your search.</p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
          <p className="text-[13px] text-slate-500">
            Showing{" "}
            <span className="font-semibold text-slate-700">{filtered.length}</span> of{" "}
            <span className="font-semibold text-slate-700">{attendees.length}</span> attendees
          </p>
        </div>
      </div>
    </div>
  );
}
