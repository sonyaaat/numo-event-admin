"use client";

import { useState } from "react";
import { Settings, Bell, Plug, Save, Globe, Mail, Smartphone } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-5.5 relative rounded-full transition-colors duration-200 flex-shrink-0 ${
        checked ? "bg-indigo-600" : "bg-slate-200"
      }`}
      style={{ height: "22px" }}
    >
      <span
        className={`absolute top-0.5 w-4.5 h-4.5 bg-white rounded-full shadow transition-transform duration-200 ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
        style={{ width: "18px", height: "18px" }}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [general, setGeneral] = useState({
    eventName: "DevConnect Spring",
    timezone: "America/Chicago",
    language: "en",
    allowPublicRegistration: true,
    enableWaitlist: false,
  });

  const [notifications, setNotifications] = useState({
    emailCheckin: true,
    emailChallenges: false,
    pushNotifications: true,
    smsAlerts: false,
    weeklyReport: true,
    realTimeAlerts: true,
  });

  const [integrations, setIntegrations] = useState({
    slackConnected: false,
    zapierConnected: false,
    salesforceConnected: false,
    mailchimpConnected: true,
  });

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage platform configuration and integrations</p>
      </div>

      {/* General Settings */}
      <Card className="rounded-xl shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-600" />
            <CardTitle className="text-base font-semibold text-slate-900">General</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Event Name
              </label>
              <input
                type="text"
                value={general.eventName}
                onChange={(e) => setGeneral({ ...general, eventName: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Timezone
              </label>
              <select
                value={general.timezone}
                onChange={(e) => setGeneral({ ...general, timezone: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
              >
                <option value="America/Chicago">America/Chicago (CT)</option>
                <option value="America/New_York">America/New_York (ET)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PT)</option>
                <option value="UTC">UTC</option>
                <option value="Europe/London">Europe/London</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Language
              </label>
              <select
                value={general.language}
                onChange={(e) => setGeneral({ ...general, language: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 bg-white"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Admin Email
              </label>
              <input
                type="email"
                defaultValue="admin@nfcevents.io"
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400"
              />
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-3">
            {[
              {
                label: "Allow Public Registration",
                desc: "Let attendees register without an invite",
                key: "allowPublicRegistration" as const,
              },
              {
                label: "Enable Waitlist",
                desc: "Add attendees to a waitlist when event is full",
                key: "enableWaitlist" as const,
              },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-sm font-medium text-slate-700">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle
                  checked={general[item.key]}
                  onChange={() => setGeneral({ ...general, [item.key]: !general[item.key] })}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="rounded-xl shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-indigo-600" />
            <CardTitle className="text-base font-semibold text-slate-900">Notifications</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              key: "emailCheckin" as const,
              icon: Mail,
              label: "Email on Check-in",
              desc: "Send email confirmation when attendee checks in",
            },
            {
              key: "emailChallenges" as const,
              icon: Mail,
              label: "Challenge Completion Emails",
              desc: "Notify attendees when they complete a challenge",
            },
            {
              key: "pushNotifications" as const,
              icon: Smartphone,
              label: "Push Notifications",
              desc: "Enable browser push notifications for real-time updates",
            },
            {
              key: "smsAlerts" as const,
              icon: Smartphone,
              label: "SMS Alerts",
              desc: "Send SMS for critical events (low stock, capacity)",
            },
            {
              key: "weeklyReport" as const,
              icon: Globe,
              label: "Weekly Summary Report",
              desc: "Receive a weekly engagement summary via email",
            },
            {
              key: "realTimeAlerts" as const,
              icon: Bell,
              label: "Real-time Dashboard Alerts",
              desc: "Show in-dashboard alerts for important activity",
            },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.key} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                <div className="flex items-start gap-3">
                  <Icon className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{item.label}</p>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <Toggle
                  checked={notifications[item.key]}
                  onChange={() =>
                    setNotifications({ ...notifications, [item.key]: !notifications[item.key] })
                  }
                />
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Integrations */}
      <Card className="rounded-xl shadow-sm border-slate-100">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Plug className="w-4 h-4 text-indigo-600" />
            <CardTitle className="text-base font-semibold text-slate-900">Integrations</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            {
              key: "slackConnected" as const,
              name: "Slack",
              desc: "Send check-in notifications and alerts to a Slack channel",
              logo: "💬",
            },
            {
              key: "zapierConnected" as const,
              name: "Zapier",
              desc: "Connect to 5,000+ apps via Zapier automation",
              logo: "⚡",
            },
            {
              key: "salesforceConnected" as const,
              name: "Salesforce",
              desc: "Sync attendee data with your CRM automatically",
              logo: "☁️",
            },
            {
              key: "mailchimpConnected" as const,
              name: "Mailchimp",
              desc: "Export attendee lists and automate email campaigns",
              logo: "📧",
            },
          ].map((item) => {
            const connected = integrations[item.key];
            return (
              <div
                key={item.key}
                className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl">
                    {item.logo}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-slate-800">{item.name}</p>
                      {connected && (
                        <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">
                          Connected
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    setIntegrations({ ...integrations, [item.key]: !connected })
                  }
                  className={`text-xs px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                    connected
                      ? "bg-slate-100 text-slate-600 hover:bg-red-50 hover:text-red-600"
                      : "bg-indigo-600 text-white hover:bg-indigo-700"
                  }`}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" className="border-slate-200 text-slate-600">
          Cancel
        </Button>
        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
          <Save className="w-4 h-4" />
          Save Changes
        </Button>
      </div>
    </div>
  );
}
