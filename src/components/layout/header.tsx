"use client";

import { Bell, Search, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { events } from "@/lib/mock-data";
import { useState } from "react";

const statusColors: Record<string, string> = {
  Live: "bg-emerald-100 text-emerald-700",
  Draft: "bg-amber-100 text-amber-700",
  Completed: "bg-slate-100 text-slate-600",
};

export default function Header() {
  const [selectedEvent, setSelectedEvent] = useState(events[1]); // Default to "Live" event

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-20">
      {/* Event selector */}
      <DropdownMenu>
        <DropdownMenuTrigger className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700 focus:outline-none">
          <span className="max-w-[200px] truncate">{selectedEvent.name}</span>
          <Badge className={`text-xs px-1.5 py-0 ${statusColors[selectedEvent.status]}`}>
            {selectedEvent.status === "Live" && (
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block mr-1" />
            )}
            {selectedEvent.status}
          </Badge>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-64">
          <DropdownMenuLabel className="text-xs text-slate-500 uppercase tracking-wider">
            Select Event
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {events.map((event) => (
            <DropdownMenuItem
              key={event.id}
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setSelectedEvent(event)}
            >
              <div>
                <p className="font-medium text-slate-800 text-sm">{event.name}</p>
                <p className="text-xs text-slate-500">{event.date} · {event.location}</p>
              </div>
              <Badge className={`text-xs px-1.5 py-0 ml-2 ${statusColors[event.status]}`}>
                {event.status}
              </Badge>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search attendees, booths..."
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-colors placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors">
          <Bell className="w-4 h-4 text-slate-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
        </button>

        {/* User avatar */}
        <Avatar className="w-8 h-8 cursor-pointer">
          <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
            AD
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
