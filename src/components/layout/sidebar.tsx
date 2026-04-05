"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  LayoutDashboard,
  Settings2,
  Users,
  ScanLine,
  Store,
  Trophy,
  Gift,
  BarChart3,
  Settings,
  Zap,
  MessageSquare,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Setup", href: "/setup", icon: Settings2 },
  { label: "Attendees", href: "/attendees", icon: Users },
  { label: "Check-in", href: "/check-in", icon: ScanLine },
  { label: "Booths", href: "/booths", icon: Store },
  { label: "Challenges", href: "/challenges", icon: Trophy },
  { label: "Rewards", href: "/rewards", icon: Gift },
  { label: "Analytics", href: "/analytics", icon: BarChart3 },
  { label: "Feedback",  href: "/feedback",  icon: MessageSquare },
  { label: "Settings",  href: "/settings",  icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-full w-60 bg-slate-900 flex flex-col z-30">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 py-[18px] border-b border-slate-800/80">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-900/40">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <div>
            <span className="text-white font-semibold text-[15px] tracking-tight leading-none">Numo</span>
          <p className="text-slate-500 text-[11px] mt-0.5 leading-none">Admin Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-[0.08em] px-2.5 mb-3">
          Main Menu
        </p>
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13.5px] font-medium transition-all duration-150",
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-900/40"
                      : "text-slate-400 hover:text-slate-100 hover:bg-slate-800/70"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-4 h-4 flex-shrink-0",
                      isActive ? "text-white" : "text-slate-500"
                    )}
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User section */}
      <div className="px-4 py-4 border-t border-slate-800/80">
        <div className="flex items-center gap-3">
          <Avatar className="w-8 h-8">
            <AvatarImage src="" />
            <AvatarFallback className="bg-indigo-600 text-white text-xs font-semibold">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-white text-[13.5px] font-medium truncate leading-tight">Admin User</p>
            <p className="text-slate-500 text-[11px] truncate mt-0.5">admin@nfcevents.io</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
