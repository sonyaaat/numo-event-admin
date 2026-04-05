"use client";

import { useState } from "react";
import { CalendarDays, MapPin, Users, Store, Trophy, Plus, Eye, Edit, MoreVertical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { events as seedEvents } from "@/lib/mock-data";
import type { Event } from "@/lib/mock-data";
import CreateEventModal from "@/components/events/create-event-modal";

const statusConfig: Record<
  string,
  { label: string; className: string; dot?: boolean }
> = {
  Live: {
    label: "Live",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: true,
  },
  Draft: {
    label: "Draft",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  Completed: {
    label: "Completed",
    className: "bg-slate-100 text-slate-600 border-slate-200",
  },
};

export default function EventsPage() {
  const [eventList, setEventList] = useState<Event[]>(seedEvents);
  const [showModal, setShowModal] = useState(false);
  const [highlightId, setHighlightId] = useState<string | null>(null);

  const handleCreated = (newEvent: Event) => {
    setEventList((prev) => [newEvent, ...prev]);
    setHighlightId(newEvent.id);
    setShowModal(false);
    // Clear highlight after a moment
    setTimeout(() => setHighlightId(null), 3000);
  };

  return (
    <>
      <div className="space-y-7">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Events</h1>
            <p className="text-[14px] text-slate-500 mt-1.5">
              <span className="font-semibold text-slate-700">{eventList.length}</span> events ·{" "}
              <span className="font-semibold text-emerald-600">
                {eventList.filter((e) => e.status === "Live").length}
              </span>{" "}
              live now
            </p>
          </div>
          <Button
            onClick={() => setShowModal(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 h-9 text-[13.5px] font-medium shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Create Event
          </Button>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {eventList.map((event) => {
            const config = statusConfig[event.status] ?? statusConfig.Draft;
            const isNew = highlightId === event.id;
            const checkinRate =
              event.attendeeCount > 0
                ? Math.round((event.checkedIn / event.attendeeCount) * 100)
                : 0;

            return (
              <Card
                key={event.id}
                className={`rounded-2xl shadow-sm border bg-white hover:shadow-md transition-all overflow-hidden ${
                  isNew
                    ? "border-indigo-300 ring-2 ring-indigo-500/20 shadow-indigo-100"
                    : "border-slate-100"
                }`}
              >
                {/* Color bar */}
                <div
                  className={`h-1.5 w-full ${
                    event.status === "Live"
                      ? "bg-emerald-500"
                      : event.status === "Draft"
                      ? "bg-amber-400"
                      : "bg-slate-300"
                  }`}
                />
                <CardContent className="p-5">
                  {/* Title row */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <Badge
                          className={`text-[11.5px] px-2.5 py-0.5 font-semibold border rounded-full inline-flex items-center gap-1.5 ${config.className}`}
                        >
                          {config.dot && (
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          )}
                          {config.label}
                        </Badge>
                        {isNew && (
                          <span className="text-[11px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                            Just created
                          </span>
                        )}
                      </div>
                      <h2 className="text-[16px] font-bold text-slate-900 truncate leading-snug">{event.name}</h2>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-slate-100 transition-colors flex-shrink-0">
                        <MoreVertical className="w-4 h-4 text-slate-400" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Eye className="w-3.5 h-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Edit className="w-3.5 h-3.5" /> Edit Event
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <p className="text-[13px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">{event.description}</p>

                  {/* Meta */}
                  <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-[13px] text-slate-600">
                      <CalendarDays className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>
                        {new Date(event.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Users className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-900">{event.attendeeCount.toLocaleString()}</p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">Attendees</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                      <div className="flex items-center justify-center mb-1">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-900">{event.boothCount}</p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">Booths</p>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Trophy className="w-3.5 h-3.5 text-slate-400" />
                      </div>
                      <p className="text-[15px] font-bold text-slate-900">{event.challengeCount}</p>
                      <p className="text-[11.5px] text-slate-500 mt-0.5">Challenges</p>
                    </div>
                  </div>

                  {/* Check-in progress */}
                  {event.status !== "Draft" && (
                    <div className="mt-4">
                      <div className="flex justify-between text-[12.5px] text-slate-500 mb-1.5">
                        <span>Check-in rate</span>
                        <span className="font-bold text-slate-700">{checkinRate}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all ${
                            event.status === "Live" ? "bg-emerald-500" : "bg-slate-400"
                          }`}
                          style={{ width: `${checkinRate}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 text-[12.5px] border-slate-200 text-slate-600 hover:bg-slate-50 h-8"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      View
                    </Button>
                    <Button
                      size="sm"
                      className={`flex-1 text-[12.5px] h-8 font-medium ${
                        event.status === "Live"
                          ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                          : event.status === "Draft"
                          ? "bg-amber-500 hover:bg-amber-600 text-white"
                          : "bg-slate-200 hover:bg-slate-300 text-slate-700"
                      }`}
                    >
                      {event.status === "Live"
                        ? "Manage"
                        : event.status === "Draft"
                        ? "Publish"
                        : "Report"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Create Event Modal */}
      {showModal && (
        <CreateEventModal
          onClose={() => setShowModal(false)}
          onCreated={handleCreated}
        />
      )}
    </>
  );
}
