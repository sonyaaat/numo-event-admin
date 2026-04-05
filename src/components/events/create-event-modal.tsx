"use client";

import { useState } from "react";
import {
  X,
  Check,
  Store,
  Trophy,
  Network,
  Layers,
  Package,
  UserCircle,
  Handshake,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Event } from "@/lib/mock-data";

// ─── Types ────────────────────────────────────────────────────────────────────

type EventType = "networking" | "networking-booths" | "booth-engagement";

interface FormData {
  name: string;
  date: string;
}

interface Modules {
  profiles: boolean;
  networking: boolean;
  booths: boolean;
  challenges: boolean;
  leadCapture: boolean;
}

interface Props {
  onClose: () => void;
  onCreated: (event: Event) => void;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

const STEPS = [
  { n: 1, label: "Event" },
  { n: 2, label: "Setup" },
  { n: 3, label: "Review" },
];

// ─── Event type options ────────────────────────────────────────────────────────

const EVENT_TYPES: {
  id: EventType;
  title: string;
  Icon: React.ElementType;
  description: string;
  examples: string;
  accent: string;
  ring: string;
  iconBg: string;
  iconColor: string;
}[] = [
  {
    id: "networking",
    title: "Networking Event",
    Icon: Network,
    description: "For attendee-to-attendee connections only.",
    examples: "meetup, networking evening, alumni event, business mixer",
    accent: "border-indigo-400 bg-indigo-50/50",
    ring: "ring-indigo-500/25",
    iconBg: "bg-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    id: "networking-booths",
    title: "Networking + Booths Event",
    Icon: Layers,
    description: "Attendee-to-attendee connections plus booth and sponsor interactions.",
    examples: "conference, expo, career fair, university fair",
    accent: "border-violet-400 bg-violet-50/50",
    ring: "ring-violet-500/25",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
  },
  {
    id: "booth-engagement",
    title: "Booth Engagement Event",
    Icon: Package,
    description: "Booth and sponsor interactions only — no attendee networking.",
    examples: "brand activation, product showcase, sponsor activation, pop-up",
    accent: "border-amber-400 bg-amber-50/50",
    ring: "ring-amber-500/25",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
  },
];

// ─── Module definitions ────────────────────────────────────────────────────────

interface ModuleDef {
  key: keyof Modules;
  label: string;
  description: string;
  Icon: React.ElementType;
  required: boolean;
  defaultOn: boolean;
}

function getModules(type: EventType): ModuleDef[] {
  const shared: Record<string, ModuleDef> = {
    profiles: {
      key: "profiles",
      label: "Attendee Profiles",
      description: "NFC-linked digital profiles for each attendee.",
      Icon: UserCircle,
      required: true,
      defaultOn: true,
    },
    networking: {
      key: "networking",
      label: "NFC Networking",
      description: "Attendee-to-attendee NFC connection and contact exchange.",
      Icon: Handshake,
      required: true,
      defaultOn: true,
    },
    booths: {
      key: "booths",
      label: "Booths & Sponsors",
      description: "NFC-enabled booth check-ins and sponsor activations.",
      Icon: Store,
      required: true,
      defaultOn: true,
    },
    challenges: {
      key: "challenges",
      label: "Challenges",
      description: "Gamified activities and point-based engagement tasks.",
      Icon: Trophy,
      required: false,
      defaultOn: true,
    },
    leadCapture: {
      key: "leadCapture",
      label: "Lead Capture",
      description: "Let sponsors and booths capture attendee contact details.",
      Icon: BookOpen,
      required: false,
      defaultOn: false,
    },
  };

  if (type === "networking") {
    return [shared.profiles, shared.networking, shared.challenges, shared.leadCapture];
  }
  if (type === "networking-booths") {
    return [
      shared.profiles,
      shared.networking,
      shared.booths,
      shared.challenges,
      { ...shared.leadCapture, defaultOn: true },
    ];
  }
  // booth-engagement
  return [
    shared.booths,
    { ...shared.profiles, required: false, defaultOn: true },
    shared.challenges,
    { ...shared.leadCapture, defaultOn: true },
  ];
}

function defaultModules(type: EventType): Modules {
  const base: Modules = { profiles: false, networking: false, booths: false, challenges: false, leadCapture: false };
  for (const mod of getModules(type)) base[mod.key] = mod.defaultOn;
  return base;
}

function getEventTypeLabel(type: EventType) {
  return EVENT_TYPES.find((t) => t.id === type)?.title ?? "";
}

// ─── Component ─────────────────────────────────────────────────────────────────

export default function CreateEventModal({ onClose, onCreated }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({ name: "", date: "" });
  const [eventType, setEventType] = useState<EventType | null>(null);
  const [modules, setModules] = useState<Modules | null>(null);
  const [errors, setErrors] = useState<{ name?: string; date?: string; type?: string }>({});

  // ── Helpers ──────────────────────────────────────────────────────────────────

  const setField = (k: keyof FormData, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }));
  };

  const handleTypeSelect = (id: EventType) => {
    setEventType(id);
    setModules(defaultModules(id));
    if (errors.type) setErrors((e) => ({ ...e, type: undefined }));
  };

  const toggleModule = (key: keyof Modules) =>
    setModules((m) => (m ? { ...m, [key]: !m[key] } : m));

  // ── Navigation ───────────────────────────────────────────────────────────────

  const handleNext = () => {
    if (step === 1) {
      const errs: typeof errors = {};
      if (!form.name.trim()) errs.name = "Required";
      if (!form.date) errs.date = "Required";
      if (!eventType) errs.type = "Please select an event type";
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;
    }
    if (step < 3) setStep((s) => s + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => s - 1);
  };

  // ── Create ───────────────────────────────────────────────────────────────────

  const handleCreate = () => {
    if (!eventType || !modules) return;
    const newEvent: Event = {
      id: `evt-${Date.now()}`,
      name: form.name.trim(),
      description: `${getEventTypeLabel(eventType)} powered by NFC engagement.`,
      date: form.date,
      location: "TBD",
      status: "Draft",
      attendeeCount: 100,
      checkedIn: 0,
      boothCount: modules.booths ? 6 + Math.floor(Math.random() * 8) : 0,
      challengeCount: modules.challenges ? 3 + Math.floor(Math.random() * 4) : 0,
    };
    onCreated(newEvent);
  };

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl shadow-slate-900/20 flex flex-col max-h-[92vh] overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-7 pt-6 pb-5 border-b border-slate-100 flex-shrink-0">
          <div>
            <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">Create New Event</h2>
            <p className="text-[13px] text-slate-500 mt-0.5">
              {step === 1 && "Name your event, set a date, and choose the engagement type."}
              {step === 2 && "Configure which modules are active for this event."}
              {step === 3 && "Review your setup before creating the event."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-slate-100 transition-colors text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step indicator */}
        <div className="flex items-center px-7 py-4 border-b border-slate-100 flex-shrink-0">
          {STEPS.map((s, i) => {
            const done = step > s.n;
            const active = step === s.n;
            return (
              <div key={s.n} className="flex items-center">
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all",
                      done ? "bg-indigo-600 text-white" :
                      active ? "bg-indigo-600 text-white ring-4 ring-indigo-100" :
                      "bg-slate-100 text-slate-400"
                    )}
                  >
                    {done ? <Check className="w-3.5 h-3.5" /> : s.n}
                  </div>
                  <span
                    className={cn(
                      "text-[12.5px] font-medium hidden sm:block",
                      active ? "text-slate-900" : done ? "text-slate-500" : "text-slate-400"
                    )}
                  >
                    {s.label}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div
                    className={cn(
                      "h-px w-12 mx-3 flex-shrink-0 transition-colors",
                      step > s.n ? "bg-indigo-300" : "bg-slate-200"
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-7 py-6">

          {/* ── Step 1: Event + Type ─────────────────────────────────────── */}
          {step === 1 && (
            <div className="space-y-6">
              {/* Name + Date fields */}
              <div className="grid grid-cols-2 gap-4">
                <Field label="Event Name" error={errors.name} required span>
                  <input
                    autoFocus
                    type="text"
                    placeholder="e.g. DevConnect Spring 2025"
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    className={inputCls(!!errors.name)}
                  />
                </Field>
                <Field label="Event Date" error={errors.date} required>
                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) => setField("date", e.target.value)}
                    className={inputCls(!!errors.date)}
                  />
                </Field>
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-100" />
                <span className="text-[12px] font-semibold text-slate-400 uppercase tracking-[0.07em]">
                  Event Type
                </span>
                <div className="flex-1 h-px bg-slate-100" />
              </div>

              {/* Error for missing type */}
              {errors.type && (
                <p className="text-[12px] text-red-500 font-medium -mt-2">{errors.type}</p>
              )}

              {/* Type cards */}
              <div className="space-y-2.5">
                {EVENT_TYPES.map((t) => {
                  const selected = eventType === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => handleTypeSelect(t.id)}
                      className={cn(
                        "w-full text-left rounded-xl border-2 p-4 transition-all flex items-start gap-4",
                        selected
                          ? `${t.accent} ring-4 ${t.ring}`
                          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                      )}
                    >
                      <div
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0",
                          selected ? t.iconBg : "bg-slate-100"
                        )}
                      >
                        <t.Icon className={cn("w-5 h-5", selected ? t.iconColor : "text-slate-400")} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-[14px] font-bold text-slate-900 leading-tight">{t.title}</p>
                          {selected && (
                            <span className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full leading-none", t.iconBg, t.iconColor)}>
                              Selected
                            </span>
                          )}
                        </div>
                        <p className="text-[12.5px] text-slate-600 leading-snug">{t.description}</p>
                        <p className="text-[12px] text-slate-400 mt-1.5">
                          <span className="font-medium text-slate-500">Examples: </span>
                          {t.examples}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all",
                          selected ? "bg-indigo-600 border-indigo-600" : "border-slate-300 bg-white"
                        )}
                      >
                        {selected && <Check className="w-3 h-3 text-white" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── Step 2: Setup ────────────────────────────────────────────── */}
          {step === 2 && eventType && modules && (
            <div className="space-y-3">
              <p className="text-[13px] text-slate-500 mb-4 leading-relaxed">
                Modules for{" "}
                <span className="font-semibold text-slate-700">{getEventTypeLabel(eventType)}</span>.
                Required modules are always on — toggle optional ones to fit your event.
              </p>

              {getModules(eventType).map((mod) => {
                const enabled = modules[mod.key];
                const Icon = mod.Icon;
                return (
                  <div
                    key={mod.key}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl border transition-all",
                      enabled ? "bg-white border-slate-200" : "bg-slate-50/60 border-slate-100"
                    )}
                  >
                    <div
                      className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
                        enabled ? "bg-indigo-100" : "bg-slate-100"
                      )}
                    >
                      <Icon className={cn("w-4 h-4 transition-colors", enabled ? "text-indigo-600" : "text-slate-400")} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className={cn("text-[14px] font-semibold leading-tight transition-colors", enabled ? "text-slate-900" : "text-slate-400")}>
                          {mod.label}
                        </p>
                        {mod.required && (
                          <span className="text-[10.5px] font-semibold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                            Required
                          </span>
                        )}
                      </div>
                      <p className={cn("text-[12.5px] mt-0.5 transition-colors", enabled ? "text-slate-500" : "text-slate-400")}>
                        {mod.description}
                      </p>
                    </div>

                    {mod.required ? (
                      <div className="w-10 h-6 rounded-full bg-indigo-600 flex items-center justify-end pr-1 flex-shrink-0 cursor-not-allowed opacity-70">
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </div>
                    ) : (
                      <button
                        onClick={() => toggleModule(mod.key)}
                        className={cn(
                          "w-10 h-6 rounded-full flex items-center transition-all flex-shrink-0",
                          enabled ? "bg-indigo-600 justify-end pr-1" : "bg-slate-200 justify-start pl-1"
                        )}
                      >
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ── Step 3: Review ───────────────────────────────────────────── */}
          {step === 3 && eventType && modules && (
            <div className="space-y-4">
              {/* Event details */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <p className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">Event Details</p>
                </div>
                <div className="divide-y divide-slate-100">
                  {[
                    { label: "Event Name", value: form.name },
                    {
                      label: "Date",
                      value: form.date
                        ? new Date(form.date).toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })
                        : "—",
                    },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center px-5 py-3">
                      <span className="text-[13px] text-slate-500 w-36 flex-shrink-0">{row.label}</span>
                      <span className="text-[13.5px] font-semibold text-slate-900">{row.value || "—"}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Event type */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <p className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">Event Type</p>
                </div>
                <div className="px-5 py-4 flex items-center gap-3">
                  {(() => {
                    const t = EVENT_TYPES.find((t) => t.id === eventType)!;
                    return (
                      <>
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0", t.iconBg)}>
                          <t.Icon className={cn("w-4 h-4", t.iconColor)} />
                        </div>
                        <div>
                          <p className="text-[14px] font-bold text-slate-900">{t.title}</p>
                          <p className="text-[12.5px] text-slate-500 mt-0.5">{t.description}</p>
                        </div>
                      </>
                    );
                  })()}
                </div>
              </div>

              {/* Active modules */}
              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 px-5 py-3 border-b border-slate-200">
                  <p className="text-[11.5px] font-semibold text-slate-500 uppercase tracking-[0.06em]">Active Modules</p>
                </div>
                <div className="px-5 py-4 grid grid-cols-2 gap-2">
                  {getModules(eventType).map((mod) => {
                    const on = modules[mod.key];
                    const Icon = mod.Icon;
                    return (
                      <div
                        key={mod.key}
                        className={cn("flex items-center gap-2.5 py-2 px-3 rounded-lg", on ? "bg-indigo-50" : "opacity-40")}
                      >
                        <div className={cn("w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0", on ? "bg-indigo-600" : "bg-slate-200")}>
                          {on ? <Check className="w-3 h-3 text-white" /> : <div className="w-1.5 h-0.5 bg-slate-400 rounded" />}
                        </div>
                        <span className={cn("text-[13px] font-medium", on ? "text-indigo-900" : "text-slate-400")}>
                          {mod.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Draft note */}
              <div className="flex items-start gap-2.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
                <div className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-white text-[10px] font-bold">!</span>
                </div>
                <p className="text-[12.5px] text-amber-800 leading-relaxed">
                  This event will be saved as a <span className="font-bold">Draft</span>. You can add booths, configure challenges, and publish when ready.
                </p>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
          <button
            onClick={step === 1 ? onClose : handleBack}
            className="text-[13.5px] font-medium text-slate-500 hover:text-slate-700 transition-colors px-2 py-1 rounded"
          >
            {step === 1 ? "Cancel" : "← Back"}
          </button>

          {step < 3 ? (
            <Button
              onClick={handleNext}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 h-9 text-[13.5px] font-semibold shadow-sm"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </Button>
          ) : (
            <Button
              onClick={handleCreate}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 px-6 h-9 text-[13.5px] font-semibold shadow-sm"
            >
              <Check className="w-3.5 h-3.5" />
              Create Event
            </Button>
          )}
        </div>

      </div>
    </div>
  );
}

// ─── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  required,
  span,
  children,
}: {
  label: string;
  error?: string;
  required?: boolean;
  span?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("space-y-1.5", span && "col-span-2")}>
      <label className="block text-[13px] font-semibold text-slate-700">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-[12px] text-red-500 font-medium">{error}</p>}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return cn(
    "w-full px-3 py-2.5 text-[13.5px] border rounded-lg bg-white transition-colors",
    "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400",
    hasError ? "border-red-300 bg-red-50/30" : "border-slate-200"
  );
}
