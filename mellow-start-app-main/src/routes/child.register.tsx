import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/child/register")({
  head: () => ({
    meta: [
      { title: "Parent Profile — Kartavya" },
      { name: "description", content: "Tell us about your parent so we can personalise their care." },
    ],
  }),
  component: ChildRegister,
});

const MEDICAL = ["💉 Diabetes", "❤️ Hypertension", "🦴 Arthritis", "🧠 Dementia", "👁️ Vision", "👂 Hearing", "🫁 Respiratory", "🦷 Dental"];
const INTERESTS = ["🏏 Cricket", "🕉️ Bhajans", "♟️ Chess", "📚 Reading", "🌿 Gardening", "🎵 Music", "🎨 Art", "🍳 Cooking", "🧘 Yoga", "✈️ Travel"];
const CARE = ["💊 Medication", "🏥 Doctor visits", "😊 Emotional support", "🍽️ Nutrition", "🚶 Physical activity", "🤝 Social connection"];

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-[11px] font-bold uppercase tracking-wider text-lav-d">{title}</div>
      {children}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[12px] font-medium text-ink/80">{label}</div>
      {children}
    </div>
  );
}

const inpCls =
  "w-full rounded-xl border-[1.5px] border-lav-l bg-white px-3.5 py-2.5 text-sm outline-none focus:border-lav-d";

function ChipGroup({ items, value, onChange }: { items: string[]; value: string[]; onChange: (v: string[]) => void }) {
  const toggle = (i: string) =>
    onChange(value.includes(i) ? value.filter((x) => x !== i) : [...value, i]);
  return (
    <div className="mt-1.5 flex flex-wrap gap-1.5">
      {items.map((i) => {
        const on = value.includes(i);
        return (
          <button
            key={i}
            type="button"
            onClick={() => toggle(i)}
            className={`rounded-full px-3 py-1 text-[11.5px] font-semibold transition ${
              on
                ? "bg-lav-d text-white"
                : "bg-lav-l text-lav-d hover:bg-lav-l/70"
            }`}
          >
            {i}
          </button>
        );
      })}
    </div>
  );
}

function ChildRegister() {
  const navigate = useNavigate();
  const [med, setMed] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [care, setCare] = useState<string[]>([]);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const profile = Object.fromEntries(fd.entries());
    const full = { ...profile, medical: med, interests, care };
    localStorage.setItem("kartavya_child_profile", JSON.stringify(full));
    localStorage.setItem("kartavya_session", "child");
    navigate({ to: "/child/dashboard" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex items-center justify-between px-5 py-4 text-white"
        style={{ background: "linear-gradient(135deg, var(--lav-dd), var(--lav-d))" }}>
        <Link to="/child/auth" className="rounded-full bg-white/20 px-3 py-1 text-xs">← Back</Link>
        <span className="font-display text-base tracking-wide">Parent Profile</span>
        <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white/50 bg-yel text-base">👩</span>
      </div>

      <div className="flex-1 px-5 pb-28 pt-5">
        <h2 className="font-display text-2xl text-lav-dd">Tell us about your parent</h2>
        <p className="mb-5 mt-1 text-xs text-muted-foreground">
          This helps us personalise their news feed, find suitable friends, and suggest the best care.
        </p>

        <form onSubmit={onSubmit} className="flex flex-col gap-5 rounded-3xl bg-white p-5 shadow-[0_2px_16px_rgba(74,48,128,0.10)]">
          <Section title="About You (Son/Daughter)">
            <Field label="Your Full Name"><input required name="your_name" className={inpCls} placeholder="e.g. Priya Sharma" /></Field>
            <Field label="Your Mobile Number"><input required name="your_mobile" type="tel" className={inpCls} placeholder="+91 XXXXX XXXXX" /></Field>
            <Field label="Your City"><input name="your_city" className={inpCls} placeholder="e.g. Delhi" /></Field>
          </Section>

          <div className="h-px bg-lav-l" />

          <Section title="Parent's Basic Information">
            <Field label="Parent's Full Name"><input required name="parent_name" className={inpCls} placeholder="e.g. Ramesh Kumar" /></Field>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Age"><input name="age" type="number" className={inpCls} placeholder="e.g. 72" /></Field>
              <Field label="Gender">
                <select name="gender" className={inpCls}>
                  <option>Male</option><option>Female</option><option>Other</option>
                </select>
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <Field label="Height (cm)"><input name="height" type="number" className={inpCls} placeholder="e.g. 165" /></Field>
              <Field label="Weight (kg)"><input name="weight" type="number" className={inpCls} placeholder="e.g. 72" /></Field>
            </div>
            <Field label="City / Locality"><input name="parent_city" className={inpCls} placeholder="e.g. Lajpat Nagar, Delhi" /></Field>
            <Field label="Religion">
              <select name="religion" className={inpCls}>
                {["Hindu","Muslim","Sikh","Christian","Jain","Buddhist","Other"].map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Mother Tongue / Language Preference">
              <select name="language" className={inpCls}>
                {["Hindi","Punjabi","Bengali","Marathi","Tamil","Telugu","Gujarati","Kannada","Other"].map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
          </Section>

          <div className="h-px bg-lav-l" />

          <Section title="Health & Medical">
            <Field label="Known Medical Conditions (select all)">
              <ChipGroup items={MEDICAL} value={med} onChange={setMed} />
            </Field>
            <Field label="Current Medications (optional)"><input name="medications" className={inpCls} placeholder="e.g. Metformin, Amlodipine" /></Field>
            <Field label="Allergies"><input name="allergies" className={inpCls} placeholder="e.g. Penicillin, Dust" /></Field>
            <Field label="Mobility Level">
              <select name="mobility" className={inpCls}>
                {["Fully Mobile","Walks with support","Wheelchair user","Bedridden"].map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
          </Section>

          <div className="h-px bg-lav-l" />

          <Section title="Interests & Personality">
            <Field label="Key Interests / Hobbies (select all that apply)">
              <ChipGroup items={INTERESTS} value={interests} onChange={setInterests} />
            </Field>
            <Field label="Favourite Cuisine / Food"><input name="cuisine" className={inpCls} placeholder="e.g. North Indian, Rajasthani" /></Field>
            <Field label="Things They Enjoy (Likings)">
              <textarea name="likings" className={`${inpCls} h-20 resize-none`} placeholder="e.g. Morning walks, chai time, watching news, grandchildren visits…" />
            </Field>
            <Field label="Things They Dislike">
              <textarea name="dislikes" className={`${inpCls} h-20 resize-none`} placeholder="e.g. Loud noise, spicy food, crowded places…" />
            </Field>
            <Field label="Personality">
              <select name="personality" className={inpCls}>
                {["Very Social — loves people","Moderately social","Prefers small groups","Mostly introverted"].map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
          </Section>

          <div className="h-px bg-lav-l" />

          <Section title="Care Priorities">
            <Field label="Key areas of support needed">
              <ChipGroup items={CARE} value={care} onChange={setCare} />
            </Field>
            <Field label="Lives with whom?">
              <select name="lives_with" className={inpCls}>
                {["Alone","With spouse","With us (children)","With extended family","In senior care home"].map(r=><option key={r}>{r}</option>)}
              </select>
            </Field>
            <Field label="Any additional notes for companions / caregivers">
              <textarea name="notes" className={`${inpCls} h-20 resize-none`} placeholder="Special instructions, sensitivities, family dynamics…" />
            </Field>
          </Section>

          <button type="submit" className="mt-2 w-full rounded-2xl bg-lav-d py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-95">
            Save & Get Started 🙏
          </button>
        </form>
      </div>
    </div>
  );
}
