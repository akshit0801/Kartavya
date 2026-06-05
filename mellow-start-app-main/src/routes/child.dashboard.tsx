import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import {
  Heart, Activity, Footprints, Moon, Droplet, Thermometer, Battery,
  Bell, Pill, Stethoscope, UserPlus, Phone, MessageCircle, Upload,
  FileText, Calendar, ChevronRight, Check, X, Send, Star, MapPin,
  Home, CalendarDays, FileBarChart, Sparkles, IdCard, Sun, Watch,
  Download, Share2, Printer, Copy, ArrowLeft, Lock, QrCode, Mail, Smartphone, CreditCard,
} from "lucide-react";
import { jsPDF } from "jspdf";

export const Route = createFileRoute("/child/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Kartavya" }] }),
  component: ChildDashboard,
});

type Tab = "home" | "appointments" | "reports" | "leisure" | "healthid";

function ChildDashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [tab, setTab] = useState<Tab>("home");

  useEffect(() => {
    const raw = localStorage.getItem("kartavya_child_profile");
    setProfile(raw ? JSON.parse(raw) : null);
    const session = localStorage.getItem("kartavya_session");
    if (session !== "child") navigate({ to: "/" });
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("kartavya_session");
    navigate({ to: "/" });
  };

  const parentName = (profile?.parent_name as string) || "Mrs. Sunita Sharma";
  const yourName = ((profile?.your_name as string) || "Riya").split(" ")[0];

  return (
    <div className="flex min-h-screen flex-col bg-background pb-20">
      {/* Header */}
      <div
        className="px-5 pt-5 pb-6 text-white"
        style={{ background: "linear-gradient(135deg, var(--lav-dd), var(--lav-d))" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-white/70">Hi {yourName} 👋</p>
            <h1 className="font-display text-2xl leading-tight">
              Karta<em className="not-italic" style={{ color: "var(--yel-m)" }}>vya</em>
            </h1>
          </div>
          <button
            onClick={logout}
            className="rounded-full bg-white/15 px-3 py-1.5 text-[11px] backdrop-blur transition hover:bg-white/25"
          >
            Sign out
          </button>
        </div>
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white/15 p-3 backdrop-blur">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/25 text-xl">
            👵
          </div>
          <div className="flex-1">
            <div className="text-[11px] text-white/70">Caring for</div>
            <div className="text-sm font-semibold">{parentName}</div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-emerald-500/90 px-2 py-1 text-[10px] font-semibold">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" /> LIVE
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {tab === "home" && <HomeSection />}
        {tab === "appointments" && <AppointmentsSection />}
        {tab === "reports" && <ReportsSection />}
        {tab === "leisure" && <LeisureSection />}
        {tab === "healthid" && <HealthIdSection />}
      </div>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-[640px] items-center justify-around border-t border-lav-l bg-white/95 px-2 py-2 backdrop-blur">
        {[
          { id: "home", label: "Home", icon: <Home className="h-4.5 w-4.5" /> },
          { id: "appointments", label: "Appts", icon: <CalendarDays className="h-4.5 w-4.5" /> },
          { id: "reports", label: "Reports", icon: <FileBarChart className="h-4.5 w-4.5" /> },
          { id: "leisure", label: "Leisure", icon: <Sparkles className="h-4.5 w-4.5" /> },
          { id: "healthid", label: "Health ID", icon: <IdCard className="h-4.5 w-4.5" /> },
        ].map((n) => {
          const active = tab === (n.id as Tab);
          return (
            <button
              key={n.id}
              onClick={() => setTab(n.id as Tab)}
              className="flex flex-1 flex-col items-center gap-0.5 rounded-xl py-1.5 transition"
              style={{ color: active ? "var(--lav-dd)" : "var(--soft)" }}
            >
              <span
                className="flex h-8 w-12 items-center justify-center rounded-full transition"
                style={{ background: active ? "var(--lav-l)" : "transparent" }}
              >
                {n.icon}
              </span>
              <span className="text-[10px] font-semibold">{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* =============================== HOME =============================== */

function HomeSection() {
  return (
    <div className="-mt-3 space-y-5 px-4 pt-3">
      <LiveVitals />
      <HealthTrends />
      <RemindersWidget />
      <CompanionRequestCard />
    </div>
  );
}

function LiveVitals() {
  const tiles = [
    { icon: <Heart className="h-4 w-4" />, label: "Heart Rate", value: "78", unit: "bpm", tone: "rose", trend: "Normal", source: "Watch" },
    { icon: <Droplet className="h-4 w-4" />, label: "SpO₂", value: "97", unit: "%", tone: "sky", trend: "Stable", source: "Watch" },
    { icon: <Activity className="h-4 w-4" />, label: "BP", value: "128/82", unit: "mmHg", tone: "violet", trend: "Slightly high", source: "Cuff" },
    { icon: <Thermometer className="h-4 w-4" />, label: "Temp", value: "98.4", unit: "°F", tone: "amber", trend: "Normal", source: "Watch" },
    { icon: <Footprints className="h-4 w-4" />, label: "Steps", value: "3,240", unit: "today", tone: "emerald", trend: "Goal 5k", source: "Phone" },
    { icon: <Moon className="h-4 w-4" />, label: "Sleep", value: "6h 42m", unit: "last night", tone: "indigo", trend: "Light", source: "Watch" },
  ];
  const toneBg: Record<string, string> = {
    rose: "bg-rose-50 text-rose-600",
    sky: "bg-sky-50 text-sky-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    indigo: "bg-indigo-50 text-indigo-600",
  };
  return (
    <section>
      <div className="mb-2 flex items-end justify-between px-1">
        <h2 className="font-display text-lg text-lav-dd">Live now</h2>
        <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
          <Watch className="h-3 w-3" /> Apple Watch · 87% <Battery className="h-3 w-3" />
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className="rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
            <div className={`mb-1.5 inline-flex h-7 w-7 items-center justify-center rounded-lg ${toneBg[t.tone]}`}>
              {t.icon}
            </div>
            <div className="text-[10px] uppercase tracking-wide text-muted-foreground">{t.label}</div>
            <div className="text-base font-bold leading-tight text-ink">
              {t.value} <span className="text-[10px] font-medium text-muted-foreground">{t.unit}</span>
            </div>
            <div className="mt-0.5 text-[9px] text-muted-foreground">{t.trend} · {t.source}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

const TRENDS = {
  week: {
    label: "1W",
    data: [
      { x: "Mon", hr: 76, bp: 124, sugar: 132 },
      { x: "Tue", hr: 80, bp: 130, sugar: 145 },
      { x: "Wed", hr: 74, bp: 122, sugar: 128 },
      { x: "Thu", hr: 82, bp: 134, sugar: 152 },
      { x: "Fri", hr: 78, bp: 128, sugar: 140 },
      { x: "Sat", hr: 75, bp: 120, sugar: 125 },
      { x: "Sun", hr: 78, bp: 128, sugar: 142 },
    ],
  },
  month: {
    label: "1M",
    data: Array.from({ length: 4 }, (_, i) => ({
      x: `W${i + 1}`,
      hr: 75 + Math.round(Math.sin(i) * 5 + i),
      bp: 122 + i * 2,
      sugar: 130 + i * 4,
    })),
  },
  sixmonth: {
    label: "6M",
    data: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"].map((m, i) => ({
      x: m, hr: 72 + i, bp: 118 + i * 2, sugar: 128 + i * 3,
    })),
  },
} as const;

type MetricKey = "hr" | "bp" | "sugar";
const METRICS: { key: MetricKey; label: string; color: string; unit: string }[] = [
  { key: "hr", label: "Heart Rate", color: "#E11D48", unit: "bpm" },
  { key: "bp", label: "Systolic BP", color: "#7C5CBF", unit: "mmHg" },
  { key: "sugar", label: "Blood Sugar", color: "#E8C832", unit: "mg/dL" },
];

function HealthTrends() {
  const [period, setPeriod] = useState<keyof typeof TRENDS>("week");
  const [metric, setMetric] = useState<MetricKey>("hr");
  const data = [...TRENDS[period].data];
  const active = METRICS.find((m) => m.key === metric)!;

  return (
    <section className="rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(74,48,128,0.08)]">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-lg text-lav-dd">Health Trends</h2>
        <div className="flex gap-1 rounded-full bg-lav-l p-1">
          {(Object.keys(TRENDS) as (keyof typeof TRENDS)[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className="rounded-full px-2.5 py-1 text-[10px] font-semibold transition"
              style={{
                background: period === p ? "var(--lav-d)" : "transparent",
                color: period === p ? "#fff" : "var(--lav-dd)",
              }}
            >
              {TRENDS[p].label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-2 flex gap-1.5">
        {METRICS.map((m) => {
          const on = m.key === metric;
          return (
            <button
              key={m.key}
              onClick={() => setMetric(m.key)}
              className="flex-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition"
              style={{
                background: on ? m.color : "var(--lav-l)",
                color: on ? "#fff" : "var(--soft)",
              }}
            >
              {m.label}
            </button>
          );
        })}
      </div>

      <div className="h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.4} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#EDE6F8" vertical={false} />
            <XAxis dataKey="x" tick={{ fontSize: 10, fill: "#6B5B8A" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#6B5B8A" }} axisLine={false} tickLine={false} width={36} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: "1px solid #EDE6F8", fontSize: 12 }}
              formatter={(v: number) => [`${v} ${active.unit}`, active.label]}
            />
            <Line
              type="monotone" dataKey={metric} stroke={active.color}
              strokeWidth={2.5} dot={{ r: 3, fill: active.color }} activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="mt-1 text-center text-[10px] text-muted-foreground">
        {active.label} · {TRENDS[period].label} trend
      </p>
    </section>
  );
}

function RemindersWidget() {
  const reminders = [
    { time: "8:00 AM", title: "Metformin 500mg", sub: "After breakfast", icon: <Pill className="h-4 w-4" />, important: true, done: true },
    { time: "11:00 AM", title: "Walk in the park", sub: "30 min · with Anita", icon: <Footprints className="h-4 w-4" />, important: false, done: true },
    { time: "2:00 PM", title: "BP Check", sub: "Log reading in app", icon: <Activity className="h-4 w-4" />, important: true, done: false },
    { time: "6:30 PM", title: "Dr. Mehta — Cardiology", sub: "Video consult", icon: <Stethoscope className="h-4 w-4" />, important: true, done: false },
    { time: "9:00 PM", title: "Atorvastatin 10mg", sub: "After dinner", icon: <Pill className="h-4 w-4" />, important: false, done: false },
  ];
  return (
    <section>
      <div className="mb-2 flex items-center justify-between px-1">
        <h2 className="font-display text-lg text-lav-dd">Today's reminders</h2>
        <button className="text-[11px] font-semibold text-lav-d">View all</button>
      </div>
      <div className="space-y-2">
        {reminders.map((r, i) => (
          <div
            key={i}
            className="relative flex items-center gap-3 overflow-hidden rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(74,48,128,0.06)]"
            style={r.important && !r.done
              ? { boxShadow: "0 0 0 1.5px var(--yel-d), 0 4px 18px rgba(232,200,50,0.35)" }
              : undefined}
          >
            {r.important && !r.done && (
              <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-yel px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wide text-yel-d">
                <Sun className="h-2.5 w-2.5" /> Important
              </span>
            )}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{
                background: r.done ? "#ECFDF5" : r.important ? "var(--yel)" : "var(--lav-l)",
                color: r.done ? "#059669" : r.important ? "var(--lav-dd)" : "var(--lav-d)",
              }}
            >
              {r.done ? <Check className="h-4 w-4" /> : r.icon}
            </div>
            <div className="min-w-0 flex-1">
              <div className={`text-sm font-semibold ${r.done ? "text-muted-foreground line-through" : "text-ink"}`}>
                {r.title}
              </div>
              <div className="text-[11px] text-muted-foreground">{r.time} · {r.sub}</div>
            </div>
            {!r.done && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
          </div>
        ))}
      </div>
    </section>
  );
}

function CompanionRequestCard() {
  const [status, setStatus] = useState<"pending" | "approved" | "declined">("pending");
  return (
    <section className="rounded-3xl bg-gradient-to-br from-lav-dd to-lav-d p-4 text-white shadow-[0_4px_20px_rgba(74,48,128,0.25)]">
      <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/70">
        <Bell className="h-3.5 w-3.5" /> Companion request
      </div>
      <div className="mt-3 flex items-start gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-xl">👩‍🦰</div>
        <div className="flex-1">
          <div className="font-semibold">Anita Verma</div>
          <div className="text-[11px] text-white/80">Day companion · Tue, Thu · 10am – 1pm</div>
          <div className="mt-1 flex items-center gap-2 text-[10px] text-white/70">
            <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-current text-yel-m" /> 4.8</span>
            <span>· 6 yrs exp</span>
            <span>· ₹450/visit</span>
          </div>
        </div>
      </div>
      {status === "pending" ? (
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => setStatus("declined")}
            className="flex-1 rounded-xl bg-white/15 py-2.5 text-xs font-semibold transition hover:bg-white/25"
          >
            <X className="mr-1 inline h-3.5 w-3.5" /> Decline
          </button>
          <button
            onClick={() => setStatus("approved")}
            className="flex-1 rounded-xl bg-yel-m py-2.5 text-xs font-semibold text-ink shadow transition hover:opacity-95"
          >
            <Check className="mr-1 inline h-3.5 w-3.5" /> Approve
          </button>
        </div>
      ) : (
        <div className="mt-4 rounded-xl bg-white/15 py-2.5 text-center text-xs font-semibold">
          {status === "approved" ? "✓ Approved · Anita has been notified" : "Request declined"}
        </div>
      )}
    </section>
  );
}

/* =========================== APPOINTMENTS =========================== */

type ApptSub = "doctors" | "reports" | "companions";

function AppointmentsSection() {
  const [sub, setSub] = useState<ApptSub>("doctors");
  return (
    <div className="-mt-3 px-4 pt-3">
      <div className="mb-4 grid grid-cols-3 rounded-2xl bg-white p-1 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
        {([
          ["doctors", "Doctors"],
          ["reports", "Past reports"],
          ["companions", "Companions"],
        ] as [ApptSub, string][]).map(([k, l]) => {
          const on = sub === k;
          return (
            <button
              key={k}
              onClick={() => setSub(k)}
              className="rounded-xl py-2 text-[11px] font-semibold transition"
              style={{
                background: on ? "var(--lav-d)" : "transparent",
                color: on ? "#fff" : "var(--soft)",
              }}
            >
              {l}
            </button>
          );
        })}
      </div>
      {sub === "doctors" && <DoctorsTab />}
      {sub === "reports" && <ReportsTab />}
      {sub === "companions" && <CompanionsTab />}
    </div>
  );
}

/* ----- Doctors ----- */

type Doctor = {
  id: string;
  name: string;
  spec: string;
  hospital: string;
  rating: number;
  exp: number;
  fee: number;
  emoji: string;
  slots: string[];
  about: string;
};

const DOCTORS: Doctor[] = [
  {
    id: "d1", name: "Dr. Rakesh Mehta", spec: "Cardiologist",
    hospital: "Apollo Hospitals · Bandra",
    rating: 4.8, exp: 22, fee: 1200, emoji: "👨‍⚕️",
    slots: ["Today 4:30 PM", "Today 6:30 PM", "Tomorrow 10:00 AM", "Tomorrow 12:00 PM"],
    about: "Senior interventional cardiologist with 22 years of experience treating hypertension, arrhythmia and post-cardiac care for elderly patients.",
  },
  {
    id: "d2", name: "Dr. Sneha Iyer", spec: "Endocrinologist (Diabetes)",
    hospital: "Fortis · Mulund",
    rating: 4.9, exp: 15, fee: 1000, emoji: "👩‍⚕️",
    slots: ["Tomorrow 9:00 AM", "Tomorrow 11:30 AM", "Fri 3:00 PM"],
    about: "Specialises in geriatric diabetes management and personalised insulin plans.",
  },
  {
    id: "d3", name: "Dr. Arvind Pillai", spec: "Orthopaedic",
    hospital: "Kokilaben · Andheri",
    rating: 4.6, exp: 18, fee: 900, emoji: "🧑‍⚕️",
    slots: ["Mon 11:00 AM", "Mon 5:00 PM", "Wed 10:30 AM"],
    about: "Knee & joint pain specialist. Non-surgical care plans for seniors.",
  },
];

function DoctorsTab() {
  const [open, setOpen] = useState<Doctor | null>(null);
  return (
    <>
      <div className="space-y-2.5">
        {DOCTORS.map((d) => (
          <div key={d.id} className="rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lav-l text-xl">{d.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">{d.name}</div>
                <div className="text-[11px] text-muted-foreground">{d.spec}</div>
                <div className="mt-0.5 flex items-center gap-1 text-[10px] text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {d.hospital}
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center justify-end gap-0.5 text-[11px] font-semibold text-yel-d">
                  <Star className="h-3 w-3 fill-current" /> {d.rating}
                </div>
                <div className="text-[10px] text-muted-foreground">{d.exp}y exp</div>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-lav-l pt-2.5">
              <div className="text-[11px] text-muted-foreground">
                Fee <span className="font-semibold text-ink">₹{d.fee}</span>
              </div>
              <button
                onClick={() => setOpen(d)}
                className="rounded-full bg-lav-d px-4 py-1.5 text-[11px] font-semibold text-white shadow"
              >
                Book appointment
              </button>
            </div>
          </div>
        ))}
      </div>
      {open && <DoctorBookingSheet doctor={open} onClose={() => setOpen(null)} />}
    </>
  );
}

function DoctorBookingSheet({ doctor, onClose }: { doctor: Doctor; onClose: () => void }) {
  const [step, setStep] = useState<"profile" | "chat" | "done">("profile");
  const [slot, setSlot] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<{ from: "me" | "doc"; text: string }[]>([
    { from: "doc", text: `Hi! This is ${doctor.name.split(" ").slice(-1)[0]}'s desk. How can we help your parent today?` },
  ]);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 9e9, behavior: "smooth" });
  }, [msgs, step]);

  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: draft.trim() }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "doc", text: "Got it — confirming your slot now. You'll receive an SMS shortly." }]);
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[90vh] w-full max-w-[640px] overflow-hidden rounded-t-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-lav-l px-5 py-3">
          <div className="font-display text-base text-lav-dd">
            {step === "profile" ? "Doctor profile" : step === "chat" ? "Chat with clinic" : "Appointment booked"}
          </div>
          <button onClick={onClose} className="rounded-full bg-lav-l p-1.5"><X className="h-3.5 w-3.5" /></button>
        </div>

        {step === "profile" && (
          <div className="max-h-[75vh] overflow-y-auto p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lav-l text-3xl">{doctor.emoji}</div>
              <div>
                <div className="font-display text-lg text-ink">{doctor.name}</div>
                <div className="text-xs text-muted-foreground">{doctor.spec}</div>
                <div className="mt-1 flex gap-2 text-[11px]">
                  <span className="flex items-center gap-0.5 text-yel-d"><Star className="h-3 w-3 fill-current" />{doctor.rating}</span>
                  <span className="text-muted-foreground">· {doctor.exp}y exp</span>
                  <span className="text-muted-foreground">· ₹{doctor.fee}</span>
                </div>
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-lav-l/60 p-3 text-xs leading-relaxed text-ink">{doctor.about}</p>

            <div className="mt-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-soft">Available slots</div>
              <div className="grid grid-cols-2 gap-2">
                {doctor.slots.map((s) => {
                  const on = slot === s;
                  return (
                    <button
                      key={s}
                      onClick={() => setSlot(s)}
                      className="rounded-xl border-[1.5px] px-3 py-2.5 text-xs font-semibold transition"
                      style={{
                        borderColor: on ? "var(--lav-d)" : "var(--lav-l)",
                        background: on ? "var(--lav-d)" : "#fff",
                        color: on ? "#fff" : "var(--ink)",
                      }}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              disabled={!slot}
              onClick={() => setStep("chat")}
              className="mt-5 w-full rounded-2xl bg-lav-d py-3.5 text-sm font-semibold text-white shadow disabled:opacity-40"
            >
              Chat to confirm →
            </button>
          </div>
        )}

        {step === "chat" && (
          <div className="flex h-[75vh] flex-col">
            <div className="border-b border-lav-l bg-lav-l/40 px-5 py-2 text-[11px] text-soft">
              Selected slot: <span className="font-semibold text-ink">{slot}</span>
            </div>
            <div ref={scrollRef} className="flex-1 space-y-2 overflow-y-auto p-4">
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                  <div
                    className="max-w-[75%] rounded-2xl px-3 py-2 text-xs"
                    style={m.from === "me"
                      ? { background: "var(--lav-d)", color: "#fff" }
                      : { background: "var(--lav-l)", color: "var(--ink)" }}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-lav-l p-3">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Type a message…"
                className="flex-1 rounded-full border border-lav-l bg-white px-4 py-2 text-xs outline-none focus:border-lav-d"
              />
              <button onClick={send} className="rounded-full bg-lav-d p-2.5 text-white"><Send className="h-3.5 w-3.5" /></button>
              <button
                onClick={() => setStep("done")}
                className="rounded-full bg-emerald-500 px-3 py-2 text-[10px] font-semibold text-white"
              >
                Confirm
              </button>
            </div>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-2 p-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              <Check className="h-8 w-8" />
            </div>
            <h3 className="font-display text-xl text-lav-dd">Appointment confirmed</h3>
            <p className="text-sm text-muted-foreground">
              {doctor.name} · {slot}
            </p>
            <p className="text-[11px] text-muted-foreground">Reminder added to your parent's schedule.</p>
            <button onClick={onClose} className="mt-3 rounded-full bg-lav-d px-6 py-2.5 text-xs font-semibold text-white">
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ----- Past reports ----- */

type Report = { id: string; title: string; category: string; date: string; lab: string; url?: string };

const SEED_REPORTS: Report[] = [
  { id: "r1", title: "Complete Blood Count (CBC)", category: "Blood Tests", date: "2026-05-12", lab: "Apollo Diagnostics", url: "/demo-report.pdf" },
  { id: "r2", title: "Lipid Profile", category: "Blood Tests", date: "2026-05-12", lab: "Apollo Diagnostics", url: "/demo-report.pdf" },
  { id: "r3", title: "ECG", category: "Cardiology", date: "2026-04-22", lab: "Apollo Hospitals", url: "/demo-report.pdf" },
  { id: "r4", title: "X-Ray (Knee)", category: "Radiology", date: "2026-03-18", lab: "Kokilaben Hospital", url: "/demo-report.pdf" },
  { id: "r5", title: "HbA1c", category: "Blood Tests", date: "2026-02-04", lab: "SRL Diagnostics", url: "/demo-report.pdf" },
];

function ReportsTab() {
  const [reports, setReports] = useState<Report[]>(SEED_REPORTS);
  const [cat, setCat] = useState<string>("All");
  const fileRef = useRef<HTMLInputElement>(null);

  const grouped = useMemo(() => {
    const filtered = cat === "All" ? reports : reports.filter((r) => r.category === cat);
    const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date));
    const g: Record<string, Report[]> = {};
    sorted.forEach((r) => {
      const m = new Date(r.date).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      (g[m] ||= []).push(r);
    });
    return g;
  }, [reports, cat]);

  const cats = ["All", ...Array.from(new Set(reports.map((r) => r.category)))];

  const onUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setReports((rs) => [
      {
        id: "u" + Date.now(),
        title: file.name.replace(/\.[^.]+$/, ""),
        category: "Uploaded",
        date: new Date().toISOString().slice(0, 10),
        lab: "Uploaded by you",
        url,
      },
      ...rs,
    ]);
    e.target.value = "";
  };

  return (
    <>
      <button
        onClick={() => fileRef.current?.click()}
        className="mb-3 flex w-full items-center gap-3 rounded-2xl border-[1.5px] border-dashed border-lav-d bg-lav-l/60 p-3.5 text-left transition hover:bg-lav-l"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lav-d">
          <Upload className="h-4 w-4" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-semibold text-ink">Upload offline report</div>
          <div className="text-[10px] text-muted-foreground">Image or PDF from your phone</div>
        </div>
        <ChevronRight className="h-4 w-4 text-lav-d" />
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,application/pdf"
        className="hidden"
        onChange={onUpload}
      />

      <div className="mb-3 flex gap-1.5 overflow-x-auto pb-1">
        {cats.map((c) => {
          const on = cat === c;
          return (
            <button
              key={c}
              onClick={() => setCat(c)}
              className="whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold transition"
              style={{
                background: on ? "var(--lav-d)" : "#fff",
                color: on ? "#fff" : "var(--soft)",
              }}
            >
              {c}
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {Object.entries(grouped).map(([month, list]) => (
          <div key={month}>
            <div className="mb-1.5 px-1 text-[10px] font-bold uppercase tracking-widest text-soft">{month}</div>
            <div className="space-y-2">
              {list.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(74,48,128,0.06)] transition active:scale-[0.99]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                    <FileText className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-ink">{r.title}</div>
                    <div className="text-[11px] text-muted-foreground">
                      {r.category} · {r.lab}
                    </div>
                  </div>
                  <div className="text-right text-[10px] text-muted-foreground">
                    <Calendar className="ml-auto h-3 w-3" />
                    {new Date(r.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })}
                  </div>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ----- Companions ----- */

type Companion = {
  id: string;
  name: string;
  role: string;
  emoji: string;
  rating: number;
  exp: number;
  fee: number;
  city: string;
  schedule: string;
  status: "pending" | "approved" | "none";
};

const SEED_COMPANIONS: Companion[] = [
  { id: "c1", name: "Anita Verma", role: "Day companion", emoji: "👩‍🦰", rating: 4.8, exp: 6, fee: 450, city: "Bandra W", schedule: "Tue, Thu · 10am–1pm", status: "pending" },
  { id: "c2", name: "Rajesh Kumar", role: "Medical attendant", emoji: "🧔", rating: 4.9, exp: 9, fee: 700, city: "Andheri E", schedule: "Mon–Fri · 9am–6pm", status: "approved" },
  { id: "c3", name: "Priya Nair", role: "Evening companion", emoji: "👩", rating: 4.7, exp: 4, fee: 400, city: "Khar", schedule: "Wed, Sat · 5pm–8pm", status: "none" },
];

function CompanionsTab() {
  const [list, setList] = useState(SEED_COMPANIONS);
  const [chatWith, setChatWith] = useState<Companion | null>(null);

  return (
    <>
      <div className="space-y-2.5">
        {list.map((c) => (
          <div key={c.id} className="rounded-2xl bg-white p-3 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-yel/50 text-xl">{c.emoji}</div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-semibold text-ink">{c.name}</div>
                <div className="text-[11px] text-muted-foreground">{c.role} · {c.city}</div>
                <div className="mt-0.5 flex items-center gap-2 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-0.5 text-yel-d"><Star className="h-3 w-3 fill-current" />{c.rating}</span>
                  <span>· {c.exp}y</span>
                  <span>· ₹{c.fee}/visit</span>
                </div>
              </div>
              {c.status === "approved" && (
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-semibold uppercase text-emerald-700">
                  Active
                </span>
              )}
              {c.status === "pending" && (
                <span className="rounded-full bg-yel px-2 py-0.5 text-[9px] font-semibold uppercase text-yel-d">
                  Pending
                </span>
              )}
            </div>
            <div className="mt-2 text-[11px] text-muted-foreground">
              <Calendar className="mr-1 inline h-3 w-3" /> {c.schedule}
            </div>

            <div className="mt-3 flex items-center gap-2 border-t border-lav-l pt-2.5">
              <button
                onClick={() => window.alert(`Calling ${c.name}…`)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-emerald-50 py-2 text-[11px] font-semibold text-emerald-700"
              >
                <Phone className="h-3.5 w-3.5" /> Call
              </button>
              <button
                onClick={() => setChatWith(c)}
                className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-lav-l py-2 text-[11px] font-semibold text-lav-dd"
              >
                <MessageCircle className="h-3.5 w-3.5" /> Message
              </button>
              {c.status === "pending" && (
                <button
                  onClick={() =>
                    setList((xs) => xs.map((x) => (x.id === c.id ? { ...x, status: "approved" } : x)))
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-lav-d py-2 text-[11px] font-semibold text-white"
                >
                  <Check className="h-3.5 w-3.5" /> Approve
                </button>
              )}
              {c.status === "none" && (
                <button
                  onClick={() =>
                    setList((xs) => xs.map((x) => (x.id === c.id ? { ...x, status: "pending" } : x)))
                  }
                  className="flex flex-1 items-center justify-center gap-1 rounded-xl bg-yel py-2 text-[11px] font-semibold text-yel-d"
                >
                  <UserPlus className="h-3.5 w-3.5" /> Request
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {chatWith && <CompanionChat companion={chatWith} onClose={() => setChatWith(null)} />}
    </>
  );
}

function CompanionChat({ companion, onClose }: { companion: Companion; onClose: () => void }) {
  const [msgs, setMsgs] = useState<{ from: "me" | "them"; text: string }[]>([
    { from: "them", text: `Namaste 🙏 This is ${companion.name.split(" ")[0]}. How can I help?` },
  ]);
  const [draft, setDraft] = useState("");
  const send = () => {
    if (!draft.trim()) return;
    setMsgs((m) => [...m, { from: "me", text: draft.trim() }]);
    setDraft("");
    setTimeout(() => {
      setMsgs((m) => [...m, { from: "them", text: "Sure, happy to help your parent. I'll be there on time." }]);
    }, 700);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-end bg-ink/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="mx-auto flex h-[75vh] w-full max-w-[640px] flex-col overflow-hidden rounded-t-3xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-lav-l px-5 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yel/50">{companion.emoji}</div>
            <div>
              <div className="text-sm font-semibold text-ink">{companion.name}</div>
              <div className="text-[10px] text-emerald-600">● online</div>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full bg-lav-l p-1.5"><X className="h-3.5 w-3.5" /></button>
        </div>
        <div className="flex-1 space-y-2 overflow-y-auto p-4">
          {msgs.map((m, i) => (
            <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className="max-w-[75%] rounded-2xl px-3 py-2 text-xs"
                style={m.from === "me"
                  ? { background: "var(--lav-d)", color: "#fff" }
                  : { background: "var(--lav-l)", color: "var(--ink)" }}
              >
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-lav-l p-3">
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder="Type a message…"
            className="flex-1 rounded-full border border-lav-l bg-white px-4 py-2 text-xs outline-none focus:border-lav-d"
          />
          <button onClick={send} className="rounded-full bg-lav-d p-2.5 text-white"><Send className="h-3.5 w-3.5" /></button>
        </div>
      </div>
    </div>
  );
}

/* =============================== REPORTS SECTION =============================== */

interface CalendarEvent {
  title: string;
  time: string;
  name: string; // Doctor or Companion name
  type: "doctor" | "blood" | "volunteer" | "leisure" | "session";
}

const JUNE_2026_EVENTS: Record<number, CalendarEvent> = {
  2: { title: "HbA1c Blood Test", time: "9:00 AM", name: "Dr. Sneha Iyer", type: "blood" },
  8: { title: "Cardiology Consult", time: "6:30 PM", name: "Dr. Rakesh Mehta", type: "doctor" },
  10: { title: "Elderly Support Call", time: "4:00 PM", name: "Anita Verma", type: "volunteer" },
  12: { title: "Morning Yoga Session", time: "7:00 AM", name: "Anita Verma", type: "session" },
  15: { title: "Vrindavan & Mathura Trip", time: "All Day (Day 1)", name: "Priya Nair", type: "leisure" },
  16: { title: "Vrindavan & Mathura Trip", time: "All Day (Day 2)", name: "Priya Nair", type: "leisure" },
  17: { title: "Vrindavan & Mathura Trip", time: "All Day (Day 3)", name: "Priya Nair", type: "leisure" },
  21: { title: "Lipid Profile Test", time: "8:00 AM", name: "Apollo Lab Assistant", type: "blood" },
  24: { title: "Orthopaedic Checkup", time: "11:00 AM", name: "Dr. Arvind Pillai", type: "doctor" },
  26: { title: "Evening Companion Visit", time: "5:00 PM", name: "Rajesh Kumar", type: "volunteer" },
};

interface MedicalRecord {
  id: string;
  title: string;
  date: string;
  doctor: string;
  status: "Review" | "Normal" | "Low";
  findings: string;
  recommendations: string;
  history: { date: string; value: number }[];
  unit: string;
  normalRange: string;
}

const MEDICAL_RECORDS: MedicalRecord[] = [
  {
    id: "m1",
    title: "HbA1c Blood Test",
    date: "Jun 2, 2026",
    doctor: "Dr. Sneha Iyer",
    status: "Review",
    findings: "Average blood glucose level is 7.8% (estimated average glucose of 177 mg/dL). This is in the diabetic range, showing moderate glucose elevation over the past 3 months.",
    recommendations: "Reduce carbohydrate intake, prioritize high-fiber foods. Walk for 30 minutes daily after meals. Follow up in 3 months for a repeat HbA1c check.",
    unit: "%",
    normalRange: "< 5.7% (Normal), 5.7% - 6.4% (Prediabetes), >= 6.5% (Diabetes)",
    history: [
      { date: "Dec 2025", value: 8.2 },
      { date: "Jan 2026", value: 8.0 },
      { date: "Feb 2026", value: 8.1 },
      { date: "Mar 2026", value: 7.9 },
      { date: "Apr 2026", value: 7.7 },
      { date: "Jun 2026", value: 7.8 },
    ]
  },
  {
    id: "m2",
    title: "ECG Report",
    date: "May 20, 2026",
    doctor: "Dr. Rakesh Mehta",
    status: "Normal",
    findings: "Normal sinus rhythm at 74 bpm. Normal axis. No significant ST-T wave abnormalities or signs of ischemia detected. Cardiac conduction is completely healthy.",
    recommendations: "Maintain current physical activities. Hydrate well and perform light stretching or walking exercises daily. Regular annual screening recommended.",
    unit: "bpm",
    normalRange: "60 - 100 bpm (Normal sinus rhythm)",
    history: [
      { date: "Dec 2025", value: 72 },
      { date: "Jan 2026", value: 75 },
      { date: "Feb 2026", value: 73 },
      { date: "Mar 2026", value: 76 },
      { date: "Apr 2026", value: 74 },
      { date: "May 2026", value: 74 },
    ]
  },
  {
    id: "m3",
    title: "Bone Density Scan",
    date: "Apr 10, 2026",
    doctor: "Dr. Arvind Pillai",
    status: "Low",
    findings: "T-Score at femoral neck is -1.5. This indicates mild osteopenia (bone thinning), which represents an intermediate risk of fracture. No osteoporotic range noted.",
    recommendations: "Take oral Calcium Carbonate (500mg daily) and Cholecalciferol (Vitamin D3, 60,000 IU weekly). Perform light weight-bearing walking and yoga under supervision.",
    unit: "T-Score",
    normalRange: "> -1.0 (Normal), -1.0 to -2.5 (Osteopenia), < -2.5 (Osteoporosis)",
    history: [
      { date: "Dec 2025", value: -1.2 },
      { date: "Jan 2026", value: -1.3 },
      { date: "Feb 2026", value: -1.3 },
      { date: "Mar 2026", value: -1.4 },
      { date: "Apr 2026", value: -1.5 },
    ]
  }
];

function ReportsSection() {
  const [view, setView] = useState<"calendar" | "detail">("calendar");
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [activeEventDay, setActiveEventDay] = useState<number | null>(null);
  const [isGoogleSynced, setIsGoogleSynced] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [syncingState, setSyncingState] = useState<"idle" | "authorizing" | "syncing" | "success">("idle");

  const startOffset = 1; // 1 empty cell for Sunday start layout
  const daysInMonth = 30;
  const calendarCells = [];
  for (let i = 0; i < startOffset; i++) {
    calendarCells.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }
  while (calendarCells.length % 7 !== 0) {
    calendarCells.push(null);
  }

  const triggerGoogleSync = () => {
    setShowSyncModal(true);
    setSyncingState("authorizing");
  };

  if (view === "detail" && selectedRecord) {
    return (
      <ReportSummaryView
        record={selectedRecord}
        onBack={() => {
          setView("calendar");
          setSelectedRecord(null);
        }}
      />
    );
  }

  return (
    <div className="-mt-3 px-4 pt-3 space-y-5">
      {/* Smart Suggestions */}
      <section className="rounded-3xl p-4 shadow-[0_2px_16px_rgba(74,48,128,0.06)] bg-[#FFE066]/15 border border-[#FFE066]/40">
        <h3 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-lav-dd">
          <Sparkles className="h-4 w-4 text-yel-d" /> Smart Suggestions
        </h3>
        <ul className="mt-2.5 space-y-2 text-xs">
          <li className="flex items-center gap-2 font-medium text-ink">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            <span>HbA1c at 7.8 — Schedule diet consult this week.</span>
          </li>
          <li className="flex items-center gap-2 font-medium text-ink">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            <span>Vitamin D deficient — Add supplement.</span>
          </li>
          <li className="flex items-center gap-2 font-medium text-ink">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>BP stable at 128/82 — Continue medication.</span>
          </li>
        </ul>
      </section>

      {/* Calendar Widget */}
      <section className="rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(74,48,128,0.08)]">
        <div className="flex items-center justify-between border-b border-lav-l pb-3">
          <div>
            <h2 className="font-display text-lg text-lav-dd">June 2026</h2>
            <p className="text-[10px] text-muted-foreground mt-0.5">Elders Schedule Summary</p>
          </div>
          <button
            onClick={triggerGoogleSync}
            disabled={isGoogleSynced}
            className={`rounded-full px-3.5 py-1.5 text-[11px] font-semibold transition shadow-xs flex items-center gap-1 ${
              isGoogleSynced
                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                : "bg-lav-d text-white hover:bg-lav-dd"
            }`}
          >
            {isGoogleSynced ? "✓ Synced" : "Sync with Google Calendar"}
          </button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-y-2.5 text-center mt-3">
          {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
            <div key={day} className="text-[10px] font-bold text-soft uppercase tracking-wider">{day}</div>
          ))}
          {calendarCells.map((day, idx) => {
            if (day === null) return <div key={`empty-${idx}`} />;
            
            const event = JUNE_2026_EVENTS[day];
            const isToday = day === 4; // June 4 marked active in design
            
            return (
              <div key={`day-${day}`} className="relative flex flex-col items-center py-1">
                <button
                  onClick={() => event && setActiveEventDay(activeEventDay === day ? null : day)}
                  className={`h-9 w-9 flex items-center justify-center rounded-xl text-xs font-semibold transition relative
                    ${isToday ? 'border-2 border-lav-d text-lav-dd' : 'text-ink hover:bg-lav-l/30'}
                    ${event ? 'font-bold' : ''}
                  `}
                  style={event ? { backgroundColor: "rgba(201, 184, 232, 0.15)" } : undefined}
                >
                  {day}
                  
                  {/* Event dot */}
                  {event && (
                    <span className={`absolute bottom-1 h-1.5 w-1.5 rounded-full ${
                      event.type === 'doctor' ? 'bg-purple-500' :
                      event.type === 'blood' ? 'bg-red-500' :
                      event.type === 'volunteer' ? 'bg-emerald-500' :
                      event.type === 'leisure' ? 'bg-amber-500' :
                      'bg-blue-500'
                    }`} />
                  )}
                </button>
                
                {/* Floating Event Popover */}
                {activeEventDay === day && event && (
                  <div className="absolute bottom-11 z-40 w-44 rounded-2xl bg-white border border-lav-l p-3 text-left shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-150">
                    <div className="flex justify-between items-center">
                      <span className="text-[8px] uppercase font-bold tracking-widest text-lav-dd">
                        {event.type === 'doctor' ? 'Doctor Appt' :
                         event.type === 'blood' ? 'Blood Test' :
                         event.type === 'volunteer' ? 'Volunteer Call' :
                         event.type === 'leisure' ? 'Leisure Trip' : 'Session'}
                      </span>
                      <button onClick={(e) => { e.stopPropagation(); setActiveEventDay(null); }} className="text-[10px] text-muted-foreground hover:text-black">✕</button>
                    </div>
                    <div className="text-xs font-bold text-ink mt-1 leading-tight">{event.title}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{event.time}</div>
                    <div className="text-[9px] text-lav-dd font-semibold mt-1.5">Companion/Doctor:</div>
                    <div className="text-[10px] font-medium text-ink leading-tight">{event.name}</div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="mt-5 pt-3 border-t border-lav-l flex flex-wrap gap-x-4 gap-y-1.5 justify-center">
          {[
            { label: "Doctor Appt", color: "bg-purple-500" },
            { label: "Blood Test", color: "bg-red-500" },
            { label: "Volunteer Call", color: "bg-emerald-500" },
            { label: "Leisure Trip", color: "bg-amber-500" },
            { label: "Session", color: "bg-blue-500" }
          ].map((item) => (
            <div key={item.label} className="flex items-center gap-1.5 text-[10px] font-semibold text-soft">
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Medical Records */}
      <section className="space-y-2.5">
        <h2 className="font-display text-lg text-lav-dd px-1">Medical Records</h2>
        <div className="space-y-2.5">
          {MEDICAL_RECORDS.map((record) => (
            <button
              key={record.id}
              onClick={() => {
                setSelectedRecord(record);
                setView("detail");
              }}
              className="flex w-full items-center gap-3 rounded-2xl bg-white p-3.5 text-left shadow-[0_2px_12px_rgba(74,48,128,0.06)] transition active:scale-[0.99] hover:shadow-[0_4px_18px_rgba(74,48,128,0.1)]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
                <FileText className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="font-bold text-ink text-sm truncate">{record.title}</div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  {record.date} · {record.doctor}
                </div>
              </div>
              <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
                record.status === "Normal" ? "bg-emerald-50 text-emerald-700" :
                record.status === "Review" ? "bg-amber-50 text-amber-700" :
                "bg-rose-50 text-rose-700"
              }`}>
                {record.status}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Sync Consent Modal */}
      {showSyncModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200">
            {syncingState === "authorizing" && (
              <div className="flex flex-col items-center text-center py-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600 text-2xl font-bold font-sans">G</div>
                <h3 className="text-base font-bold text-ink mt-3">Sign in with Google</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs leading-relaxed">
                  Kartavya requests access to your Google Calendar to sync all health & travel schedules.
                </p>
                <div className="w-full border-t border-lav-l my-4" />
                <div className="flex flex-col gap-2 w-full text-left bg-lav-l/25 p-3.5 rounded-2xl">
                  <div className="text-[10px] uppercase font-bold tracking-wider text-soft">Requested scope:</div>
                  <label className="flex items-start gap-2 mt-1">
                    <input type="checkbox" defaultChecked disabled className="mt-0.5 accent-lav-d" />
                    <span className="text-[11px] text-ink font-semibold leading-tight">View and edit calendar events</span>
                  </label>
                </div>
                <div className="mt-5 flex gap-2 w-full">
                  <button
                    onClick={() => { setShowSyncModal(false); setSyncingState("idle"); }}
                    className="flex-1 rounded-xl bg-lav-l py-2.5 text-xs font-semibold text-soft"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setSyncingState("syncing");
                      setTimeout(() => {
                        setSyncingState("success");
                        setIsGoogleSynced(true);
                        setTimeout(() => {
                          setShowSyncModal(false);
                          setSyncingState("idle");
                        }, 1200);
                      }, 1500);
                    }}
                    className="flex-1 rounded-xl bg-blue-600 py-2.5 text-xs font-semibold text-white shadow hover:bg-blue-700"
                  >
                    Authorize
                  </button>
                </div>
              </div>
            )}
            
            {syncingState === "syncing" && (
              <div className="flex flex-col items-center text-center py-8">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-lav-l border-t-lav-d" />
                <h3 className="text-sm font-bold text-ink mt-4">Syncing schedules...</h3>
                <p className="text-xs text-muted-foreground mt-1">Populating elder's appointments as events</p>
              </div>
            )}
            
            {syncingState === "success" && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 text-2xl font-bold">
                  ✓
                </div>
                <h3 className="text-base font-bold text-lav-dd mt-3">Schedules Synced!</h3>
                <p className="text-xs text-muted-foreground mt-1">Google Calendar sync complete.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* =============================== REPORT DETAIL SUB VIEW =============================== */

function ReportSummaryView({ record, onBack }: { record: MedicalRecord; onBack: () => void }) {
  const [copied, setCopied] = useState(false);

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Header Logo & Brand
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(74, 48, 128); // var(--lav-dd)
    doc.text("KARTAVYA CARE", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 91, 138); // var(--soft)
    doc.text("Care that connects generations", 20, 26);
    doc.text("Universal ID: KTV-DL-2024-00847", 130, 20);
    doc.text("Date Generated: " + new Date().toLocaleDateString("en-IN"), 130, 26);
    
    // Divider
    doc.setDrawColor(201, 184, 232); // var(--lav)
    doc.setLineWidth(0.5);
    doc.line(20, 32, 190, 32);
    
    // Patient Details Block (light purple)
    doc.setFillColor(237, 230, 248); // var(--lav-l)
    doc.rect(20, 38, 170, 28, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(42, 31, 69); // var(--ink)
    doc.text("Patient Name: Ramesh Kumar", 25, 44);
    doc.text("Age / Gender: 72 yrs / Male", 25, 50);
    doc.text("Blood Group: B+", 25, 56);
    doc.text("City: Delhi", 25, 62);
    
    doc.text("Aadhaar: XXXX XXXX 7823", 110, 44);
    doc.text("Emergency Contact: Riya (Daughter)", 110, 50);
    doc.text("Mobile: 98765 43210", 110, 56);
    
    // Section Title
    doc.setFontSize(14);
    doc.setTextColor(74, 48, 128);
    doc.text("MEDICAL RECORD ANALYSIS SUMMARY", 20, 78);
    
    // Table content
    doc.setDrawColor(237, 230, 248);
    doc.rect(20, 84, 170, 20);
    doc.setFontSize(9);
    doc.text("Report Title", 25, 90);
    doc.text("Test Date", 80, 90);
    doc.text("Doctor / In-Charge", 125, 90);
    doc.text("Status", 165, 90);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    doc.text(record.title, 25, 98);
    doc.text(record.date, 80, 98);
    doc.text(record.doctor, 125, 98);
    
    if (record.status === "Normal") doc.setTextColor(5, 150, 105);
    else if (record.status === "Review") doc.setTextColor(232, 200, 50);
    else doc.setTextColor(225, 29, 72);
    doc.setFont("helvetica", "bold");
    doc.text(record.status, 165, 98);
    
    // Plain findings
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(74, 48, 128);
    doc.text("Findings & Analysis (Plain Language):", 20, 114);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    doc.setFontSize(10);
    const splitFindings = doc.splitTextToSize(record.findings, 170);
    doc.text(splitFindings, 20, 120);
    
    // Recommendations
    let nextY = 120 + (splitFindings.length * 5) + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(74, 48, 128);
    doc.text("Primary Recommendation:", 20, nextY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    doc.setFontSize(10);
    const splitRecs = doc.splitTextToSize(record.recommendations, 170);
    doc.text(splitRecs, 20, nextY + 6);
    
    // Normal Ranges
    nextY = nextY + 6 + (splitRecs.length * 5) + 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(107, 91, 138);
    doc.text("Reference / Standard Range Info:", 20, nextY);
    doc.setFont("helvetica", "normal");
    doc.text(record.normalRange, 20, nextY + 5);
    
    // Sign-off
    nextY = nextY + 25;
    doc.line(130, nextY, 180, nextY);
    doc.setFontSize(9);
    doc.text("Authorized Medical Assessor", 130, nextY + 5);
    doc.text(record.doctor, 130, nextY + 9);
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This is an automatically generated profile summary from verified labs. Securely stored under HIPAA compliance.", 20, 285);
    
    doc.save(`${record.title.replace(/\s+/g, "_")}_summary.pdf`);
  };

  const handleShare = () => {
    const text = `Kartavya Medical Record Summary for Ramesh Kumar: ${record.title} (${record.date}). Doctor in charge: ${record.doctor}. Status: ${record.status}. Managed under KTV-DL-2024-00847.`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="-mt-3 px-4 pt-3 space-y-5">
      {/* Back Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="rounded-full bg-lav-l p-2 text-lav-dd hover:bg-lav-l/70">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <h2 className="font-display text-lg text-lav-dd">Report Summary</h2>
          <p className="text-[10px] text-muted-foreground">Detailed Diagnostic Insights</p>
        </div>
      </div>

      {/* Main summary card */}
      <div className="rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(74,48,128,0.06)] space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">{record.title}</h3>
            <span className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${
              record.status === "Normal" ? "bg-emerald-50 text-emerald-700" :
              record.status === "Review" ? "bg-amber-50 text-amber-700" :
              "bg-rose-50 text-rose-700"
            }`}>
              {record.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground mt-1">Performed: {record.date} · Prescribed: {record.doctor}</p>
        </div>

        <div className="border-t border-lav-l pt-3 space-y-3.5">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-lav-d">Findings in Plain Language</h4>
            <p className="text-xs leading-relaxed text-ink mt-1.5 bg-lav-l/20 p-3 rounded-2xl">
              {record.findings}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-lav-d">Doctor's Recommendations</h4>
            <p className="text-xs leading-relaxed text-ink mt-1.5 bg-lav-l/20 p-3 rounded-2xl border border-lav-l/40">
              {record.recommendations}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={downloadPDF}
            className="flex-1 rounded-2xl bg-lav-d text-white font-semibold text-xs py-3 shadow-md hover:bg-lav-dd flex items-center justify-center gap-1.5"
          >
            <Download className="h-4 w-4" /> Download PDF
          </button>
          <button
            onClick={handleShare}
            className="flex-1 rounded-2xl bg-white border border-lav-l text-lav-dd font-semibold text-xs py-3 hover:bg-lav-l/20 flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-600" /> Copied Info
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" /> Share with Doctor
              </>
            )}
          </button>
        </div>
      </div>

      {/* Trend Graph Section */}
      <section className="rounded-3xl bg-white p-4 shadow-[0_2px_16px_rgba(74,48,128,0.08)]">
        <h3 className="font-display text-sm font-semibold text-lav-dd border-b border-lav-l pb-2">
          Trend History (Last 6 Months)
        </h3>
        <div className="mt-4 h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={record.history} margin={{ top: 8, right: 8, left: -25, bottom: 0 }}>
              <CartesianGrid stroke="#EDE6F8" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 9, fill: "#6B5B8A" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 9, fill: "#6B5B8A" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #EDE6F8", fontSize: 11 }} />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--lav-d)"
                strokeWidth={2.5}
                dot={{ r: 3, fill: "var(--lav-d)" }}
                activeDot={{ r: 5 }}
                name={record.title.includes("HbA1c") ? "HbA1c Level (%)" : record.title.includes("ECG") ? "Heart Rate (bpm)" : "T-Score"}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          Normal limit reference: {record.normalRange.split(",")[0]}
        </p>
      </section>
    </div>
  );
}

/* =============================== LEISURE SECTION =============================== */

interface LeisureItem {
  id: string;
  title: string;
  subtitle: string;
  type: "trip" | "session";
  date: string;
  duration: string;
  price: number;
  inclusions: string[];
  counter: string;
  description: string;
  rating: number;
  reviewsCount: number;
  imageUrl: string;
  itinerary: { day: string; detail: string }[];
  whoIsThisFor: string;
}

const LEISURE_ITEMS: LeisureItem[] = [
  {
    id: "l1",
    title: "Vrindavan & Mathura Tour",
    subtitle: "Spiritual temple tour tailored for seniors",
    type: "trip",
    date: "Jun 15 – 17",
    duration: "3 Days",
    price: 4200,
    inclusions: ["AC Coach transport", "Sattvic Meals", "Elderly-friendly hotel stay", "Wheelchair assistance", "Dedicated guide"],
    counter: "Only 6 spots left",
    description: "An auspicious 3-day spiritual journey to the holy towns of Vrindavan and Mathura. Designed specifically for senior citizens with customized slow-paced travel itineraries, wheelchair access, and caring tour guides.",
    rating: 4.7,
    reviewsCount: 38,
    imageUrl: "linear-gradient(135deg, var(--lav-dd), var(--lav-d))",
    itinerary: [
      { day: "Day 1", detail: "AC Coach departure from Mumbai. Check-in at the hotel in Mathura. Evening Aarti and slow-guided visit to Krishna Janmabhoomi temple." },
      { day: "Day 2", detail: "Vrindavan temple visits (Banke Bihari, Prem Mandir). Specialized entry and seating arrangements. Sunset Yamuna Aarti." },
      { day: "Day 3", detail: "Dwarkadhish temple morning prayers. Shopping session and return journey in AC Coach with dinner." },
    ],
    whoIsThisFor: "Perfect for seniors with limited mobility. Includes hand-holding support at temples, customized menu, and constant coordinator availability."
  },
  {
    id: "l2",
    title: "Rishikesh Wellness Tour",
    subtitle: "Ganga Aarti, yoga, and meditation retreat",
    type: "trip",
    date: "Jul 5 – 7",
    duration: "3 Days",
    price: 3800,
    inclusions: ["AC Coach transport", "Organic Meals", "Riverside retreat stay", "Yoga instruction", "Specialized guide"],
    counter: "Only 12 spots left",
    description: "Rejuvenate the body and soul in the yoga capital of Rishikesh. Enjoy relaxing meditation sessions, evening Ganga Aarti at Triveni Ghat, and peaceful walks by the Ganges.",
    rating: 4.8,
    reviewsCount: 22,
    imageUrl: "linear-gradient(135deg, #10B981, #059669)",
    itinerary: [
      { day: "Day 1", detail: "Arrival in Dehradun, transfer to Rishikesh riverside resort. Evening gentle yoga briefing and group meditation." },
      { day: "Day 2", detail: "Early morning breathing exercises, visit to Ashrams, and reserved seating for Ganga Aarti." },
      { day: "Day 3", detail: "Meditation session by the riverbank. Vegetarian lunch and departure." },
    ],
    whoIsThisFor: "Suitable for seniors seeking mental peace, flexibility exercises, and breathing rejuvenation. Low-impact walks only."
  },
  {
    id: "l3",
    title: "Morning Yoga Class",
    subtitle: "Gentle stretches and joint exercise",
    type: "session",
    date: "Mon – Sat 7:00 AM",
    duration: "Monthly Subscription",
    price: 800,
    inclusions: ["Live online classes", "Interactive sessions", "Joint pain exercises", "Recordings access"],
    counter: "Ongoing",
    description: "Start the day energized! Gentle stretches, breathing exercises (Pranayam), and joint mobility exercises specially structured for senior health and arthritis management.",
    rating: 4.9,
    reviewsCount: 104,
    imageUrl: "linear-gradient(135deg, var(--lav-dd), var(--lav-d))",
    itinerary: [
      { day: "Week 1", detail: "Breathing techniques and joint pain relief exercises." },
      { day: "Week 2", detail: "Gentle muscle stretching and balance improvement." },
      { day: "Week 3", detail: "Core strengthening and digestion improvement poses." },
      { day: "Week 4", detail: "Mindfulness and relaxation techniques." },
    ],
    whoIsThisFor: "Seniors of all fitness levels. Poses are performed sitting on a chair or with wall support. Very safe and easy."
  },
  {
    id: "l4",
    title: "Bhajan Class",
    subtitle: "Sing and connect with peers",
    type: "session",
    date: "Tue & Thu 5:00 PM",
    duration: "Monthly Subscription",
    price: 500,
    inclusions: ["Interactive group sessions", "Lyrics sheets PDF", "Harmonium lessons", "Weekly meets"],
    counter: "Ongoing",
    description: "A joyful community singing session. Learn traditional bhajans, connect with friends, and find spiritual solace through music.",
    rating: 4.8,
    reviewsCount: 65,
    imageUrl: "linear-gradient(135deg, var(--yel-d), #B8881A)",
    itinerary: [
      { day: "Week 1", detail: "Devotional songs for Krishna and lyrics discussion." },
      { day: "Week 2", detail: "Traditional chants and rhythmic clapping." },
      { day: "Week 3", detail: "Shiva bhajans and simple harmonium beats." },
      { day: "Week 4", detail: "Monthly group performance show." },
    ],
    whoIsThisFor: "Seniors who love music and social interactions. No prior singing experience needed."
  },
  {
    id: "l5",
    title: "Art Therapy Class",
    subtitle: "Explore creativity & reduce stress",
    type: "session",
    date: "Sat 10:00 AM",
    duration: "Weekly Session",
    price: 0,
    inclusions: ["Art supplies list", "Instructor-guided painting", "Exhibition opportunity", "Free entry"],
    counter: "Free Session",
    description: "A relaxing art workshop where seniors can express themselves, paint with watercolors, and reduce stress in a friendly environment.",
    rating: 4.7,
    reviewsCount: 18,
    imageUrl: "linear-gradient(135deg, #10B981, #059669)",
    itinerary: [
      { day: "Saturday", detail: "Watercolors and abstract landscape painting step-by-step guidance." },
    ],
    whoIsThisFor: "Anyone looking for a calm, relaxing, and creative hobby. Beginners are welcome!"
  }
];

function LeisureSection() {
  const [view, setView] = useState<"list" | "detail">("list");
  const [selectedItem, setSelectedItem] = useState<LeisureItem | null>(null);
  const [showPayment, setShowPayment] = useState(false);

  if (view === "detail" && selectedItem) {
    return (
      <TripDetailView
        item={selectedItem}
        onBack={() => {
          setView("list");
          setSelectedItem(null);
        }}
        onBook={() => setShowPayment(true)}
        showPayment={showPayment}
        onClosePayment={() => setShowPayment(false)}
      />
    );
  }

  const trips = LEISURE_ITEMS.filter((x) => x.type === "trip");
  const classes = LEISURE_ITEMS.filter((x) => x.type === "session");

  return (
    <div className="-mt-3 px-4 pt-3 space-y-5 pb-5">
      {/* Featured Trip list */}
      <section className="space-y-3">
        <h2 className="font-display text-lg text-lav-dd px-1">Featured Trips</h2>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 snap-x">
          {trips.map((trip) => (
            <div
              key={trip.id}
              onClick={() => {
                setSelectedItem(trip);
                setView("detail");
              }}
              className="flex-shrink-0 w-[280px] snap-center rounded-3xl p-5 text-white shadow-lg flex flex-col justify-between cursor-pointer transition active:scale-[0.98]"
              style={{ background: trip.imageUrl }}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-white/70">Featured Trip</span>
                <h3 className="font-display text-lg font-bold mt-1 leading-tight">{trip.title}</h3>
                <p className="text-[11px] text-white/80 mt-1">{trip.date} · {trip.duration} · AC Coach</p>
              </div>
              <div className="mt-8 flex items-center justify-between pt-2 border-t border-white/20">
                <div>
                  <div className="text-lg font-bold">₹{trip.price.toLocaleString("en-IN")}</div>
                  <div className="text-[9px] text-white/70">per person · {trip.counter.toLowerCase()}</div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItem(trip);
                    setView("detail");
                  }}
                  className="rounded-full bg-yel px-3.5 py-1.5 text-[10px] font-bold text-ink shadow-sm"
                >
                  Book Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Enrol in Classes */}
      <section className="space-y-3">
        <h2 className="font-display text-lg text-lav-dd px-1">Enrol in Classes & Sessions</h2>
        <div className="grid grid-cols-2 gap-3">
          {classes.map((cls) => (
            <div
              key={cls.id}
              onClick={() => {
                setSelectedItem(cls);
                setView("detail");
              }}
              className="rounded-2xl p-4 bg-white shadow-[0_2px_12px_rgba(74,48,128,0.06)] border border-lav-l/40 flex flex-col justify-between cursor-pointer transition active:scale-[0.98] hover:shadow-[0_4px_18px_rgba(74,48,128,0.1)]"
            >
              <div>
                <div className="flex justify-between items-start">
                  <span className="text-2xl">
                    {cls.id === "l3" ? "🧘" : cls.id === "l4" ? "🎵" : "🎨"}
                  </span>
                  {cls.price === 0 && (
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[8px] font-bold uppercase text-emerald-700 border border-emerald-200">
                      FREE
                    </span>
                  )}
                </div>
                <h3 className="font-bold text-ink text-sm mt-3 leading-tight">{cls.title}</h3>
                <p className="text-[10px] text-muted-foreground mt-1">{cls.date}</p>
              </div>
              <div className="mt-5 pt-2.5 border-t border-lav-l/50 flex justify-between items-center">
                <span className="text-xs font-bold text-lav-dd">
                  {cls.price > 0 ? `₹${cls.price}/mo` : "FREE 🎉"}
                </span>
                <span className="text-[9px] text-muted-foreground">Select →</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

/* =============================== TRIP DETAIL SUB VIEW =============================== */

function TripDetailView({
  item,
  onBack,
  onBook,
  showPayment,
  onClosePayment,
}: {
  item: LeisureItem;
  onBack: () => void;
  onBook: () => void;
  showPayment: boolean;
  onClosePayment: () => void;
}) {
  const [activeItineraryDay, setActiveItineraryDay] = useState<string | null>(item.itinerary[0]?.day || null);

  return (
    <div className="-mt-3 relative flex flex-col min-h-screen bg-background pb-24">
      {/* Banner top */}
      <div className="relative h-48 w-full flex flex-col justify-between p-5 text-white" style={{ background: item.imageUrl }}>
        <button onClick={onBack} className="self-start rounded-full bg-white/20 p-2 text-white hover:bg-white/30 transition">
          <ArrowLeft className="h-4.5 w-4.5" />
        </button>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-white/80 bg-white/20 px-2 py-0.5 rounded-full">
            {item.type === "trip" ? "Tour Package" : "Class Session"}
          </span>
          <h1 className="font-display text-2xl font-bold mt-1.5 leading-tight">{item.title}</h1>
          <p className="text-xs opacity-90 mt-1">{item.subtitle}</p>
        </div>
      </div>

      <div className="px-4 pt-4 space-y-4 flex-1">
        {/* Core meta card */}
        <div className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)] flex items-center justify-between">
          <div>
            <div className="text-[10px] uppercase font-bold text-soft">Schedule</div>
            <div className="text-xs font-bold text-ink mt-0.5">{item.date} ({item.duration})</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] uppercase font-bold text-soft">Cost</div>
            <div className="text-xs font-bold text-lav-dd mt-0.5">
              {item.price > 0 ? `₹${item.price.toLocaleString("en-IN")}` : "FREE"}
            </div>
          </div>
        </div>

        {/* Rating and Reviews */}
        <div className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)] space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-lav-l">
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm text-ink">★ {item.rating}</span>
              <span className="text-xs text-muted-foreground">({item.reviewsCount} reviews)</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              Verified Reviews
            </span>
          </div>

          <div className="space-y-3">
            {[
              { author: "Rakesh S. (Son)", comment: "Wonderfully organized. The tour guide was very patient with elderly seniors.", rating: 5 },
              { author: "Priya M. (Daughter)", comment: "My mother had a great time! Very safe and comfortable coach.", rating: 5 },
              { author: "Sunita K. (Elder)", comment: "Food was delicious and senior-friendly (less spicy). Easy temple walks.", rating: 4 },
            ].map((rev, i) => (
              <div key={i} className="text-xs space-y-1 bg-lav-l/15 p-2.5 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-ink">{rev.author}</span>
                  <span className="text-yel-d font-bold">{"★".repeat(rev.rating)}</span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-[11px]">{rev.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Inclusions */}
        <div className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lav-d mb-2">What's Included</h3>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            {item.inclusions.map((inc, i) => (
              <li key={i} className="flex items-center gap-2 font-medium text-ink">
                <span className="h-1.5 w-1.5 rounded-full bg-lav-d" />
                {inc}
              </li>
            ))}
          </ul>
        </div>

        {/* Itinerary Accordion */}
        <div className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)] space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lav-d pb-2 border-b border-lav-l">
            {item.type === "trip" ? "Day-by-Day Itinerary" : "Weekly Schedule"}
          </h3>
          <div className="space-y-1.5 mt-2">
            {item.itinerary.map((dayPlan, i) => {
              const isOpen = activeItineraryDay === dayPlan.day;
              return (
                <div key={i} className="border-b border-lav-l/50 pb-2 last:border-b-0">
                  <button
                    onClick={() => setActiveItineraryDay(isOpen ? null : dayPlan.day)}
                    className="flex items-center justify-between w-full text-left py-1 text-xs font-bold text-ink"
                  >
                    <span>{dayPlan.day}</span>
                    <ChevronRight className={`h-4.5 w-4.5 text-lav-d transition-transform ${isOpen ? 'rotate-90' : ''}`} />
                  </button>
                  {isOpen && (
                    <p className="text-[11px] text-muted-foreground leading-relaxed mt-1.5 pl-1.5 border-l-2 border-lav-l bg-lav-l/10 p-2 rounded-r-xl">
                      {dayPlan.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Who is this for */}
        <div className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)]">
          <h3 className="text-xs font-bold uppercase tracking-wider text-lav-d mb-1.5">Who is this for?</h3>
          <p className="text-xs text-ink leading-relaxed font-medium">
            {item.whoIsThisFor}
          </p>
        </div>
      </div>

      {/* Booking Floating Bar */}
      <div className="fixed bottom-14 left-0 right-0 mx-auto max-w-[640px] bg-white/95 border-t border-lav-l p-4 backdrop-blur shadow-2xl flex items-center justify-between z-20">
        <div>
          <div className="text-[10px] uppercase font-bold text-soft">Amount</div>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-lg font-bold text-ink">
              {item.price > 0 ? `₹${item.price.toLocaleString("en-IN")}` : "FREE"}
            </span>
            {item.price > 0 && <span className="text-[10px] text-muted-foreground">/ person</span>}
          </div>
          <div className="text-[9px] font-bold text-rose-600 mt-0.5">{item.counter}</div>
        </div>
        <button
          onClick={onBook}
          className="rounded-2xl bg-lav-d text-white font-bold text-xs px-7 py-3.5 shadow-md hover:bg-lav-dd"
        >
          Book Now
        </button>
      </div>

      {/* Slide up payment bottom sheet */}
      {showPayment && (
        <PaymentBottomSheet
          item={item}
          onClose={onClosePayment}
        />
      )}
    </div>
  );
}

/* =============================== PAYMENT BOTTOM SHEET =============================== */

function PaymentBottomSheet({
  item,
  onClose,
}: {
  item: LeisureItem;
  onClose: () => void;
}) {
  const [tab, setTab] = useState<"upi" | "card" | "netbanking">("upi");
  
  // UPI State
  const [upiId, setUpiId] = useState("");
  const [upiVerified, setUpiVerified] = useState(false);
  const [showQr, setShowQr] = useState(false);

  // Card State
  const [cardNo, setCardNo] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  // Netbanking State
  const [selectedBank, setSelectedBank] = useState("");

  // Animation Success States
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [confirmNo, setConfirmNo] = useState("");

  const convenienceFee = item.price > 0 ? 50 : 0;
  const totalAmount = item.price + convenienceFee;

  const handleCardNoChange = (v: string) => {
    // Keep digits only, space out every 4
    const digits = v.replace(/\D/g, "").slice(0, 16);
    const parts = [];
    for (let i = 0; i < digits.length; i += 4) {
      parts.push(digits.substring(i, i + 4));
    }
    setCardNo(parts.join(" "));
  };

  const handleExpiryChange = (v: string) => {
    const digits = v.replace(/\D/g, "").slice(0, 4);
    if (digits.length >= 3) {
      setExpiry(`${digits.substring(0, 2)}/${digits.substring(2, 4)}`);
    } else {
      setExpiry(digits);
    }
  };

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setConfirmNo(`KTV-TXN-${Math.floor(100000 + Math.random() * 900000)}`);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-xs" onClick={onClose}>
      {/* Bottom Sheet wrapper */}
      <div
        className="w-full max-w-[640px] rounded-t-[32px] bg-white shadow-2xl p-5 border-t border-lav-l animate-in slide-in-from-bottom duration-300 transform translate-y-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Swipe drag handle */}
        <div className="w-12 h-1.5 bg-lav-l rounded-full mx-auto mb-4 cursor-pointer" onClick={onClose} />
        
        {isDone ? (
          /* SUCCESS SCREEN */
          <div className="flex flex-col items-center text-center py-8 space-y-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600 animate-bounce">
              ✓
            </div>
            <div>
              <h3 className="font-display text-xl font-bold text-lav-dd">Booking Confirmed!</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Your slot for <span className="font-bold text-ink">{item.title}</span> is secured.
              </p>
            </div>
            
            <div className="w-full bg-lav-l/20 p-4 rounded-2xl border border-lav-l space-y-1.5 text-xs text-left max-w-sm">
              <div className="flex justify-between">
                <span className="text-soft font-semibold">Confirmation Number:</span>
                <span className="font-bold text-ink">{confirmNo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft font-semibold">Amount Paid:</span>
                <span className="font-bold text-ink">₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-soft font-semibold">Scheduled Date:</span>
                <span className="font-bold text-ink">{item.date}</span>
              </div>
            </div>

            <button onClick={onClose} className="rounded-2xl bg-lav-d text-white text-xs font-semibold py-3 px-8 shadow hover:bg-lav-dd w-full max-w-sm">
              Done
            </button>
          </div>
        ) : isProcessing ? (
          /* PROCESSING SCREEN */
          <div className="flex flex-col items-center text-center py-12 space-y-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-lav-l border-t-lav-d" />
            <h3 className="text-sm font-bold text-ink">Processing Secure Payment...</h3>
            <p className="text-xs text-muted-foreground">Do not refresh or go back.</p>
          </div>
        ) : (
          /* BILLING PAYMENT FORM */
          <div className="space-y-4 max-h-[80vh] overflow-y-auto pb-4">
            <div>
              <h3 className="text-base font-bold text-ink">Order Summary</h3>
              <p className="text-[10px] text-muted-foreground">Complete your booking securely</p>
            </div>

            {/* Bill summary block */}
            <div className="bg-lav-l/25 p-3 rounded-2xl border border-lav-l/50 space-y-1 text-xs text-ink font-semibold">
              <div className="flex justify-between text-muted-foreground font-medium">
                <span>{item.title}</span>
                <span>₹{item.price.toLocaleString("en-IN")}</span>
              </div>
              {convenienceFee > 0 && (
                <div className="flex justify-between text-muted-foreground font-medium">
                  <span>Convenience Fee</span>
                  <span>₹{convenienceFee}</span>
                </div>
              )}
              <div className="flex justify-between pt-2.5 border-t border-lav-l text-sm font-bold text-lav-dd">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div>
              <div className="text-[10px] uppercase font-bold text-soft tracking-wider mb-2">Pay with</div>
              <div className="grid grid-cols-3 gap-2 bg-lav-l/25 p-1 rounded-xl">
                {[
                  { id: "upi", label: "UPI", icon: <Smartphone className="h-4 w-4" /> },
                  { id: "card", label: "Card", icon: <CreditCard className="h-4 w-4" /> },
                  { id: "netbanking", label: "NetBanking", icon: <Mail className="h-4 w-4" /> }
                ].map((t) => {
                  const on = tab === t.id;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setTab(t.id as any)}
                      className={`flex flex-col items-center py-2.5 rounded-xl text-[10px] font-bold transition ${
                        on ? "bg-white text-lav-dd shadow-xs border border-lav-l" : "text-soft hover:bg-white/50"
                      }`}
                    >
                      {t.icon}
                      <span className="mt-1">{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* UPI view */}
            {tab === "upi" && (
              <div className="space-y-3 p-1">
                <div className="flex gap-2">
                  <input
                    value={upiId}
                    onChange={(e) => { setUpiId(e.target.value); setUpiVerified(false); }}
                    placeholder="Enter UPI ID (e.g. name@upi)"
                    className="flex-1 rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d"
                  />
                  <button
                    onClick={() => { if (upiId.trim()) setUpiVerified(true); }}
                    disabled={!upiId.trim() || upiVerified}
                    className={`rounded-xl px-4 py-3 text-xs font-bold transition ${
                      upiVerified ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-lav-l text-lav-dd hover:bg-lav-l/80"
                    }`}
                  >
                    {upiVerified ? "Verified ✓" : "Verify"}
                  </button>
                </div>
                <div className="text-center py-1">
                  <button
                    onClick={() => setShowQr(!showQr)}
                    className="text-[11px] font-semibold text-lav-d underline underline-offset-2"
                  >
                    {showQr ? "Hide QR Code" : "Or Pay via QR Code"}
                  </button>
                </div>
                {showQr && (
                  <div className="flex flex-col items-center p-4 bg-lav-l/10 border border-lav-l rounded-2xl max-w-[200px] mx-auto space-y-2 animate-in fade-in duration-200">
                    <QrCode className="h-28 w-28 text-lav-dd" />
                    <span className="text-[9px] text-muted-foreground text-center leading-tight">
                      Scan this QR code from any UPI app to complete payment.
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* CARD view */}
            {tab === "card" && (
              <div className="space-y-2.5 p-1 text-xs">
                <input
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  placeholder="Cardholder Name"
                  className="w-full rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d"
                />
                <input
                  value={cardNo}
                  onChange={(e) => handleCardNoChange(e.target.value)}
                  placeholder="Card Number (XXXX XXXX XXXX XXXX)"
                  className="w-full rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d tracking-widest"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={expiry}
                    onChange={(e) => handleExpiryChange(e.target.value)}
                    placeholder="Expiry (MM/YY)"
                    className="rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d"
                  />
                  <input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                    type="password"
                    placeholder="CVV"
                    className="rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d"
                  />
                </div>
              </div>
            )}

            {/* NETBANKING view */}
            {tab === "netbanking" && (
              <div className="p-1">
                <select
                  value={selectedBank}
                  onChange={(e) => setSelectedBank(e.target.value)}
                  className="w-full rounded-xl border border-lav-l bg-white p-3 text-xs outline-none focus:border-lav-d font-semibold text-ink"
                >
                  <option value="">-- Select your Indian Bank --</option>
                  <option value="SBI">State Bank of India (SBI)</option>
                  <option value="HDFC">HDFC Bank</option>
                  <option value="ICICI">ICICI Bank</option>
                  <option value="AXIS">Axis Bank</option>
                  <option value="KOTAK">Kotak Mahindra Bank</option>
                  <option value="PNB">Punjab National Bank (PNB)</option>
                  <option value="BOB">Bank of Baroda (BoB)</option>
                  <option value="INDUSIND">IndusInd Bank</option>
                  <option value="UNION">Union Bank of India</option>
                  <option value="CANARA">Canara Bank</option>
                </select>
              </div>
            )}

            {/* Pay Button */}
            <button
              onClick={handlePay}
              disabled={
                (tab === "upi" && !upiVerified && !showQr) ||
                (tab === "card" && (cardNo.length < 19 || expiry.length < 5 || cvv.length < 3 || !cardName.trim())) ||
                (tab === "netbanking" && !selectedBank)
              }
              className="w-full rounded-2xl bg-lav-d text-white font-bold text-xs py-4 shadow hover:bg-lav-dd disabled:opacity-40 flex items-center justify-center gap-1.5"
            >
              <Lock className="h-4 w-4" /> Pay ₹{totalAmount.toLocaleString("en-IN")} Securely
            </button>
            <p className="text-[9px] text-center text-muted-foreground">
              🔒 Your transaction is secured with 256-bit encryption.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* =============================== HEALTH ID SECTION =============================== */

function HealthIdSection() {
  const [copiedLink, setCopiedLink] = useState(false);
  const [whatsAppShared, setWhatsAppShared] = useState(false);
  const [emailOpened, setEmailOpened] = useState(false);

  const downloadHealthIDPDF = () => {
    const doc = new jsPDF();
    
    // Brand header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(74, 48, 128); // var(--lav-dd)
    doc.text("KARTAVYA CARE", 20, 20);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(107, 91, 138); // var(--soft)
    doc.text("Universal Health Profile & Records Summary", 20, 26);
    doc.text("Generated: " + new Date().toLocaleDateString("en-IN"), 140, 20);
    
    // Divider
    doc.setDrawColor(201, 184, 232); // var(--lav)
    doc.line(20, 32, 190, 32);
    
    // Health ID Card Box - Styled Navy Blue Block mimicking the UI card
    doc.setFillColor(42, 31, 69); // var(--ink)
    doc.roundedRect(20, 38, 170, 52, 5, 5, "F");
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(201, 184, 232); // light purple
    doc.text("IN KARTAVYA HEALTH RECORD", 28, 46);
    
    doc.setFontSize(18);
    doc.setTextColor(255, 255, 255);
    doc.text("Ramesh Kumar", 28, 56);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(255, 255, 255);
    doc.text("Male  ·  72 yrs  ·  B+  ·  Delhi", 28, 63);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(232, 200, 50); // Gold
    doc.text("X X X X   X X X X   7 8 2 3", 28, 73);
    
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text("✓ Aadhaar Verified", 28, 81);
    doc.text("🔗 ABHA Linked", 70, 81);
    
    doc.setFont("helvetica", "bold");
    doc.text("Conditions:", 115, 63);
    doc.setFont("helvetica", "normal");
    doc.text("BP, Diabetes, Arthritis", 115, 68);
    
    doc.setFont("helvetica", "bold");
    doc.text("Blood Group:", 115, 76);
    doc.setFont("helvetica", "normal");
    doc.text("B Positive", 115, 81);
    
    // Universal ID Box
    doc.setFillColor(237, 230, 248); // var(--lav-l)
    doc.rect(20, 96, 170, 15, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(74, 48, 128);
    doc.text("Kartavya Universal ID:", 25, 105);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    doc.text("KTV-DL-2024-00847", 70, 105);
    
    // Medications Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(74, 48, 128);
    doc.text("Current Medications:", 20, 126);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    doc.text("• Metformin 500mg (1 tablet after breakfast for blood sugar management)", 20, 134);
    doc.text("• Atorvastatin 10mg (1 tablet after dinner for cholesterol control)", 20, 140);
    doc.text("• Calcium Carbonate (500mg daily after lunch for bone health)", 20, 146);
    doc.text("• Cholecalciferol / Vitamin D3 (60,000 IU weekly on Sunday for bone density)", 20, 152);
    
    // Allergies & Emergency Section
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(74, 48, 128);
    doc.text("Known Allergies:", 20, 166);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("• Penicillin (severe rash reaction)", 20, 174);
    doc.text("• Dust / pollen (seasonal allergic rhinitis)", 20, 180);
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Emergency Contacts:", 20, 194);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Primary: Riya (Daughter)  -  Phone: +91 98765 43210", 20, 202);
    doc.text("Secondary: Anita Verma (Companion)  -  Phone: +91 91234 56789", 20, 208);
    doc.text("Primary Doctor: Dr. Rakesh Mehta  -  Phone: +91 99999 88888", 20, 214);
    
    // Linked Medical Reports Table
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(74, 48, 128);
    doc.text("Linked Medical Reports History:", 20, 228);
    
    doc.setFillColor(237, 230, 248);
    doc.rect(20, 234, 170, 8, "F");
    doc.setFontSize(9);
    doc.setTextColor(74, 48, 128);
    doc.text("Date", 23, 239);
    doc.text("Test / Report Title", 50, 239);
    doc.text("Lab / Hospital Name", 110, 239);
    doc.text("Status", 165, 239);
    
    doc.setFont("helvetica", "normal");
    doc.setTextColor(42, 31, 69);
    const reportsList = [
      { date: "02-Jun-2026", title: "HbA1c Blood Test", lab: "SRL Diagnostics", status: "Review" },
      { date: "20-May-2026", title: "ECG Report", lab: "Apollo Hospitals", status: "Normal" },
      { date: "10-Apr-2026", title: "Bone Density Scan", lab: "Kokilaben Hospital", status: "Low" },
      { date: "18-Mar-2026", title: "X-Ray (Knee)", lab: "Kokilaben Hospital", status: "Normal" },
      { date: "04-Feb-2026", title: "Lipid Profile", lab: "SRL Diagnostics", status: "Normal" }
    ];
    
    let currentY = 246;
    reportsList.forEach((r) => {
      doc.text(r.date, 23, currentY);
      doc.text(r.title, 50, currentY);
      doc.text(r.lab, 110, currentY);
      doc.text(r.status, 165, currentY);
      currentY += 6;
    });
    
    // Footer
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("This health card summary is secured and linked via ABHA system. Shared records expire in 48 hours.", 20, 285);
    doc.text("Page 1 of 1", 175, 285);
    
    doc.save("Kartavya_Health_Record_KTV-DL-2024-00847.pdf");
  };

  const shareWhatsApp = () => {
    const text = `Ramesh Kumar's Health Profile Card (KTV-DL-2024-00847). View-only record link: https://kartavya.care/records/summary/ramesh_kumar. Note: Link expires in 48 hours.`;
    navigator.clipboard.writeText(text);
    setWhatsAppShared(true);
    setTimeout(() => setWhatsAppShared(false), 2000);
  };

  const shareEmail = () => {
    setEmailOpened(true);
    setTimeout(() => setEmailOpened(false), 2000);
    window.location.href = `mailto:?subject=Ramesh%20Kumar%20-%20Health%20Profile%20Record%20(KTV-DL-2024-00847)&body=Hi,%20Please%20find%20attached%20Ramesh%20Kumar's%20Kartavya%20Health%20Record.%20Universal%20ID:%20KTV-DL-2024-00847.%20This%20record%20will%20expire%20in%2048%20hours.`;
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://kartavya.care/records/summary/ramesh_kumar");
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const triggerPrint = () => {
    window.print();
  };

  return (
    <div className="-mt-3 px-4 pt-3 space-y-4 pb-5">
      {/* Dark Card */}
      <section
        className="rounded-3xl p-5 text-white shadow-xl space-y-4"
        style={{ backgroundColor: "var(--ink)" }}
      >
        <div className="flex justify-between items-start">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#C9B8E8]/70">
              In Kartavya Health Record
            </span>
            <h2 className="font-display text-2xl font-bold mt-1 text-white">Ramesh Kumar</h2>
            <p className="text-xs text-white/80 mt-0.5">Male · 72 yrs · B+ · Delhi</p>
          </div>
          <span className="text-2xl">💳</span>
        </div>

        <div className="font-display text-xl font-bold tracking-[0.15em] text-[#FFE066] pt-1">
          X X X X   X X X X   7 8 2 3
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="rounded-md bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[9px] font-bold text-emerald-400">
            ✓ Aadhaar Verified
          </span>
          <span className="rounded-md bg-blue-500/20 border border-blue-500/40 px-2 py-0.5 text-[9px] font-bold text-blue-400">
            🔗 ABHA Linked
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-3.5 border-t border-white/10 text-xs">
          <div>
            <span className="text-white/60 font-medium">Conditions</span>
            <div className="font-semibold text-white mt-0.5">BP · Diabetes · Arthritis</div>
          </div>
          <div>
            <span className="text-white/60 font-medium">Blood Group</span>
            <div className="font-semibold text-white mt-0.5">B Positive</div>
          </div>
        </div>
      </section>

      {/* Universal ID info */}
      <div className="rounded-2xl bg-[#EDE6F8]/30 border border-[#EDE6F8] p-3 flex justify-between items-center text-xs">
        <div>
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">Kartavya Universal ID</span>
          <div className="font-mono font-bold text-lav-dd mt-0.5">KTV-DL-2024-00847</div>
        </div>
        <button
          onClick={copyLink}
          className="text-xs font-bold text-lav-d hover:text-lav-dd flex items-center gap-1 bg-white border border-lav-l rounded-lg px-2 py-1.5 shadow-2xs"
        >
          <Copy className="h-3 w-3" /> Copy
        </button>
      </div>

      {/* Linked Records Section */}
      <section className="rounded-3xl bg-white p-4 shadow-[0_2px_12px_rgba(74,48,128,0.06)] space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-lav-dd pb-1.5 border-b border-lav-l">
          Linked Records (Last 3 Reports)
        </h3>
        <div className="space-y-2">
          {[
            { title: "HbA1c Blood Test", date: "Jun 2, 2026", status: "Review", color: "bg-amber-50 text-amber-700" },
            { title: "ECG Report", date: "May 20, 2026", status: "Normal", color: "bg-emerald-50 text-emerald-700" },
            { title: "Bone Density Scan", date: "Apr 10, 2026", status: "Low", color: "bg-rose-50 text-rose-700" },
          ].map((rec, i) => (
            <div key={i} className="flex justify-between items-center py-1.5 border-b border-lav-l/40 last:border-0 text-xs">
              <div>
                <div className="font-bold text-ink">{rec.title}</div>
                <div className="text-[10px] text-muted-foreground mt-0.5">{rec.date}</div>
              </div>
              <span className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase ${rec.color}`}>
                {rec.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Wallet Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => alert("Added to Apple Wallet!")}
          className="flex-1 rounded-2xl bg-black border border-black text-white font-bold text-xs py-3.5 shadow-md flex items-center justify-center gap-2"
        >
          <span className="text-base"></span> Add to Apple Wallet
        </button>
        <button
          onClick={() => alert("Added to Google Pay!")}
          className="flex-1 rounded-2xl bg-white border border-lav-l text-ink font-bold text-xs py-3.5 shadow-sm hover:bg-lav-l/20 flex items-center justify-center gap-2"
        >
          <span className="text-base">🤖</span> Add to Google Pay
        </button>
      </div>

      {/* Export Action */}
      <button
        onClick={downloadHealthIDPDF}
        className="w-full rounded-2xl bg-lav-d text-white font-bold text-xs py-4 shadow-md hover:bg-lav-dd flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" /> Export Full Health PDF
      </button>

      {/* Share Options Row */}
      <section className="space-y-2.5">
        <div className="grid grid-cols-4 gap-2">
          <button
            onClick={shareWhatsApp}
            className={`rounded-2xl p-2.5 bg-white border border-lav-l text-[10px] font-semibold text-soft hover:bg-lav-l/10 flex flex-col items-center justify-center gap-1.5 ${
              whatsAppShared ? "text-emerald-700 border-emerald-300" : ""
            }`}
          >
            <Share2 className="h-4.5 w-4.5 text-lav-d" />
            <span>{whatsAppShared ? "Copied!" : "WhatsApp"}</span>
          </button>
          <button
            onClick={shareEmail}
            className={`rounded-2xl p-2.5 bg-white border border-lav-l text-[10px] font-semibold text-soft hover:bg-lav-l/10 flex flex-col items-center justify-center gap-1.5 ${
              emailOpened ? "text-emerald-700 border-emerald-300" : ""
            }`}
          >
            <Mail className="h-4.5 w-4.5 text-lav-d" />
            <span>Email</span>
          </button>
          <button
            onClick={copyLink}
            className={`rounded-2xl p-2.5 bg-white border border-lav-l text-[10px] font-semibold text-soft hover:bg-lav-l/10 flex flex-col items-center justify-center gap-1.5 ${
              copiedLink ? "text-emerald-700 border-emerald-300" : ""
            }`}
          >
            <Copy className="h-4.5 w-4.5 text-lav-d" />
            <span>{copiedLink ? "Copied!" : "Copy Link"}</span>
          </button>
          <button
            onClick={triggerPrint}
            className="rounded-2xl p-2.5 bg-white border border-lav-l text-[10px] font-semibold text-soft hover:bg-lav-l/10 flex flex-col items-center justify-center gap-1.5"
          >
            <Printer className="h-4.5 w-4.5 text-lav-d" />
            <span>Print</span>
          </button>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-1">
          ⚠️ Shared records are view-only and expire in 48 hours.
        </p>
      </section>
    </div>
  );
}

/* ----- Placeholder ----- */

function Placeholder({ title, icon }: { title: string; icon: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lav-l text-lav-dd">
        {icon}
      </div>
      <h2 className="mt-4 font-display text-2xl text-lav-dd">{title}</h2>
      <p className="mt-1 text-sm text-muted-foreground">Coming up next ✨</p>
    </div>
  );
}