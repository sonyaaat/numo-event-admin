"use client";

import { Settings2, Nfc, QrCode, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const setupSteps = [
  { id: 1, title: "Create Event", desc: "Define event name, date, and location", done: true },
  { id: 2, title: "Configure NFC Hardware", desc: "Register and test NFC readers", done: true },
  { id: 3, title: "Add Booths", desc: "Set up booth locations and assign NFC tags", done: true },
  { id: 4, title: "Create Challenges", desc: "Design engagement challenges and point values", done: false },
  { id: 5, title: "Set Up Rewards", desc: "Configure rewards and redemption rules", done: false },
  { id: 6, title: "Import Attendees", desc: "Upload attendee list and assign NFC badges", done: false },
  { id: 7, title: "Test Check-in Flow", desc: "Run a full end-to-end test", done: false },
  { id: 8, title: "Go Live", desc: "Enable public check-in and engagement tracking", done: false },
];

const doneCount = setupSteps.filter((s) => s.done).length;

export default function SetupPage() {
  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      <div>
        <h1 className="text-[28px] font-bold text-slate-900 tracking-tight leading-tight">Event Setup</h1>
        <p className="text-slate-500 text-[14px] mt-1.5">Complete these steps to launch your event</p>
      </div>

      {/* Progress overview */}
      <Card className="rounded-xl shadow-sm border-slate-100 bg-indigo-600 text-white">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-indigo-200 text-[13.5px] font-medium">Setup Progress</p>
              <p className="text-3xl font-bold mt-1">
                {doneCount}/{setupSteps.length}
              </p>
              <p className="text-indigo-200 text-[13.5px]">steps complete</p>
            </div>
            <div className="w-16 h-16 rounded-full border-4 border-indigo-400 flex items-center justify-center">
              <span className="text-xl font-bold">
                {Math.round((doneCount / setupSteps.length) * 100)}%
              </span>
            </div>
          </div>
          <div className="h-2 bg-indigo-500 rounded-full overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all"
              style={{ width: `${(doneCount / setupSteps.length) * 100}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Steps */}
      <Card className="rounded-xl shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] font-semibold text-slate-900 tracking-tight">Setup Checklist</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-1">
            {setupSteps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${
                  step.done ? "opacity-60" : "hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${
                    step.done
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-100 text-slate-500 border border-slate-200"
                  }`}
                >
                  {step.done ? <CheckCircle2 className="w-4 h-4" /> : step.id}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-semibold ${
                      step.done ? "line-through text-slate-400" : "text-slate-800"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p className="text-[13px] text-slate-500 leading-relaxed">{step.desc}</p>
                </div>
                {!step.done && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-[12.5px] border-indigo-200 text-indigo-600 hover:bg-indigo-50 flex-shrink-0"
                  >
                    Start
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick tips */}
      <Card className="rounded-xl shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <CardTitle className="text-[16px] font-semibold text-slate-900 tracking-tight">NFC Hardware Guide</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Nfc,
              title: "NFC Readers",
              desc: "Place ACR122U readers at booth entry points and check-in stations.",
              color: "text-indigo-600",
              bg: "bg-indigo-50",
            },
            {
              icon: QrCode,
              title: "Badge Setup",
              desc: "Pre-program NTAG213 cards with unique attendee IDs before the event.",
              color: "text-emerald-600",
              bg: "bg-emerald-50",
            },
            {
              icon: MapPin,
              title: "Booth Mapping",
              desc: "Assign NFC tag UIDs to booth locations in the platform before go-live.",
              color: "text-amber-600",
              bg: "bg-amber-50",
            },
          ].map((tip) => {
            const Icon = tip.icon;
            return (
              <div key={tip.title} className="flex flex-col items-start gap-2">
                <div className={`w-8 h-8 rounded-lg ${tip.bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${tip.color}`} />
                </div>
                <p className="text-[14px] font-semibold text-slate-800">{tip.title}</p>
                <p className="text-[13px] text-slate-500 leading-relaxed">{tip.desc}</p>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </div>
  );
}
