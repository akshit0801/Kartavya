import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useRef } from "react";
import {
  ArrowLeft, Heart, Moon, Phone, Home as HomeIcon, MessageSquare, Video, Star,
  Camera, Image as ImageIcon, PenTool, Check, ChevronRight, X, Play, Pause,
  SkipBack, SkipForward, Share2, Search, Newspaper, Gamepad2, Plus, Calendar,
  Mic, Send, Eye, HeartHandshake, Film, Stethoscope, Volume2, ShieldAlert, CheckCircle2,
  Settings, Copy, Printer
} from "lucide-react";

export const Route = createFileRoute("/elder/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — Kartavya Elder" }] }),
  component: ElderDashboard,
});

type Tab = "home" | "friends" | "entertain" | "profile" | "companions";

function ElderDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("home");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Settings Drawer states
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [profileName, setProfileName] = useState("Ramesh Kumar");
  const [profileBio, setProfileBio] = useState("Retired teacher looking for good conversation, chess partners, and fellow cricket fans.");
  const [profileLanguage, setProfileLanguage] = useState("English");
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);
  const [isPrivacyEnabled, setIsPrivacyEnabled] = useState(true);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // SOS state
  const [showSosMenu, setShowSosMenu] = useState(false);

  // Plan Enrollment states
  const [hasEnrolledArt, setHasEnrolledArt] = useState(false);
  const [hasCancelledVrindavan, setHasCancelledVrindavan] = useState(false);

  // Google Calendar Sync states
  const [isCalendarSynced, setIsCalendarSynced] = useState(false);
  const [showGoogleAuthModal, setShowGoogleAuthModal] = useState(false);
  const [syncingProgress, setSyncingProgress] = useState(false);

  // Appointment Sheet state
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem("kartavya_session");
    if (session !== "elder") {
      navigate({ to: "/" });
      return;
    }
    const savedTheme = localStorage.getItem("kartavya_theme") || "dark";
    setTheme(savedTheme as "light" | "dark");
    document.documentElement.classList.toggle("dark", savedTheme === "dark");
  }, [navigate]);

  const handleToggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("kartavya_theme", nextTheme);
    document.documentElement.classList.toggle("dark", nextTheme === "dark");
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const isDark = theme === "dark";

  // Build the local styles mapping backgrounds, text, borders
  const themeStyles = {
    "--bg-main": isDark ? "#1A0F35" : "#FFFFFF",
    "--bg-card": isDark ? "#2A1F45" : "#F8F6FC",
    "--text-main": isDark ? "#FFFFFF" : "#1A0F35",
    "--text-muted": isDark ? "rgba(255, 255, 255, 0.6)" : "rgba(26, 15, 53, 0.6)",
    "--border-main": isDark ? "rgba(255, 255, 255, 0.1)" : "#E4DCF3",
    "--accent-color": isDark ? "#FFE066" : "#7C5CBF",
    "--accent-text": isDark ? "#1A0F35" : "#FFFFFF",
  } as React.CSSProperties;

  const handleGoogleSync = () => {
    setShowGoogleAuthModal(true);
  };

  const startOAuthSync = () => {
    setSyncingProgress(true);
    setTimeout(() => {
      setSyncingProgress(false);
      setShowGoogleAuthModal(false);
      setIsCalendarSynced(true);
      triggerToast("📅 Successfully synced all events to Google Calendar!");
    }, 2000);
  };

  return (
    <div
      className={`flex min-h-screen flex-col font-sans pb-24 text-[15px] transition-colors duration-200 ${
        isDark ? "text-white bg-[#1A0F35]" : "text-[#1A0F35] bg-white"
      }`}
      style={themeStyles}
    >
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm rounded-2xl bg-emerald-500 text-white font-bold p-4 shadow-2xl text-center border-2 border-emerald-400 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-center gap-2">
            <span className="text-xl">✨</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Main Tab Render */}
      <div className="flex-1">
        {tab === "home" && (
          <ElderHomeView
            triggerToast={triggerToast}
            setShowSettings={setShowSettings}
            profileName={profileName}
            hasEnrolledArt={hasEnrolledArt}
            setHasEnrolledArt={setHasEnrolledArt}
            hasCancelledVrindavan={hasCancelledVrindavan}
            setHasCancelledVrindavan={setHasCancelledVrindavan}
            showAppointmentDetails={showAppointmentDetails}
            setShowAppointmentDetails={setShowAppointmentDetails}
            theme={theme}
          />
        )}
        {tab === "friends" && <ElderFriendsView triggerToast={triggerToast} />}
        {tab === "entertain" && <ElderEntertainmentView triggerToast={triggerToast} />}
        {tab === "profile" && (
          <ElderProfileView
            setTab={setTab}
            profileName={profileName}
            profileBio={profileBio}
            hasEnrolledArt={hasEnrolledArt}
            hasCancelledVrindavan={hasCancelledVrindavan}
            triggerToast={triggerToast}
            isCalendarSynced={isCalendarSynced}
            handleGoogleSync={handleGoogleSync}
            showAppointmentDetails={() => setShowAppointmentDetails(true)}
            theme={theme}
          />
        )}
        {tab === "companions" && <ElderCompanionsView triggerToast={triggerToast} />}
      </div>

      {/* SOS Floating FAB and slide-up spring-animated menu */}
      <div className="fixed bottom-24 right-5 z-40">
        <button
          onClick={() => setShowSosMenu(!showSosMenu)}
          className="h-16 w-16 rounded-full bg-red-600 border-4 border-red-500 shadow-2xl flex flex-col items-center justify-center font-bold text-xs text-white transform active:scale-95 transition-transform cursor-pointer"
        >
          <span className="text-[20px]">🆘</span>
          <span className="text-[10px] font-bold mt-0.5">SOS</span>
        </button>

        {showSosMenu && (
          <>
            {/* Backdrop darkens slightly */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 transition-opacity duration-300"
              onClick={() => setShowSosMenu(false)}
            />
            {/* SOS Menu container - slide up with spring-like cubic bezier */}
            <div
              className={`fixed bottom-24 right-4 left-4 z-50 max-w-sm mx-auto rounded-3xl p-4 shadow-2xl space-y-2.5 max-h-[70vh] overflow-y-auto border-2 border-red-500 animate-in slide-in-from-bottom duration-300 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] ${
                isDark ? "bg-[#1A0F35]" : "bg-white"
              }`}
            >
              <div className="flex justify-between items-center pb-2 border-b border-white/10">
                <h3 className="font-display text-sm font-bold uppercase tracking-wider text-red-505 flex items-center gap-1.5 text-red-500">
                  <span>🆘</span> SOS Emergency Menu
                </h3>
                <button
                  onClick={() => setShowSosMenu(false)}
                  className="rounded-full bg-white/10 p-1.5 hover:bg-white/20 text-white dark:text-white text-slate-800 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2">
                {/* 1. Ambulance card - Solid Red, White bold label */}
                <button
                  onClick={() => {
                    setShowSosMenu(false);
                    triggerToast("🚑 Emergency Ambulance Call placed! GPS location auto-shared with emergency dispatch.");
                  }}
                  className="w-full text-left bg-red-600 active:bg-red-700 text-white p-3.5 rounded-2xl flex items-center gap-3 shadow hover:opacity-95 transition-all border-2 border-red-500 cursor-pointer"
                >
                  <span className="text-3xl shrink-0">🚑</span>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm leading-tight text-white">Call Ambulance</h4>
                    <p className="text-[10px] text-white/95 mt-0.5 leading-snug">Urgent medical emergency. Automatically shares your live GPS.</p>
                  </div>
                </button>

                {/* 2-8 Items: White rounded card with icon left, bold label, small description below */}
                {[
                  {
                    id: "priya",
                    icon: "📞",
                    title: "Alert Priya (Daughter)",
                    desc: "Calls/messages emergency contact Priya.",
                    toast: "📞 Priya has been notified via phone call and SMS! Help is arriving.",
                  },
                  {
                    id: "cab",
                    icon: "🚗",
                    title: "Book a Cab for me",
                    desc: "Books nearest cab to home address.",
                    toast: "🚗 Nearest cab booked! Details sent to Priya's app.",
                  },
                  {
                    id: "lonely",
                    icon: "😔",
                    title: "Feeling Lonely",
                    desc: "Triggers companion call request instantly.",
                    toast: "😔 Companion request sent! Priya will coordinate a call.",
                  },
                  {
                    id: "hungry",
                    icon: "🍽️",
                    title: "I'm Hungry",
                    desc: "Sends nudge notification to Priya.",
                    toast: "🍽️ Food nudge notification sent to Priya's phone!",
                  },
                  {
                    id: "sick",
                    icon: "🤒",
                    title: "I Feel Sick",
                    desc: "Sends urgent nudge to Priya with sick status.",
                    toast: "🤒 Health status alert sent to Priya! She will contact you.",
                  },
                  {
                    id: "medicine",
                    icon: "💊",
                    title: "Remind Priya: Medicine",
                    desc: "Sends medicine reminder to child.",
                    toast: "💊 Medicine log nudge sent to Priya's phone!",
                  },
                  {
                    id: "police",
                    icon: "🚔",
                    title: "Call Police (100)",
                    desc: "Dials 100 for police services.",
                    toast: "🚔 Dialing Police (100) instantly...",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setShowSosMenu(false);
                      triggerToast(item.toast);
                    }}
                    className="w-full text-left bg-white text-slate-900 p-3.5 rounded-2xl flex items-center gap-3 shadow hover:bg-slate-50 transition-all border border-slate-200 cursor-pointer animate-in fade-in duration-100"
                  >
                    <span className="text-3xl shrink-0">{item.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-slate-900 leading-tight">{item.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{item.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Settings Drawer */}
      {showSettings && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs animate-fade-in"
          onClick={() => setShowSettings(false)}
        >
          <div
            className={`h-full w-4/5 max-w-sm border-l p-5 shadow-2xl overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-200 ${
              isDark ? "bg-[#1A0F35] text-white border-white/10" : "bg-white text-[#1A0F35] border-slate-200"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              {/* Drawer Top */}
              <div className={`flex items-center justify-between pb-3 border-b ${isDark ? "border-white/10" : "border-slate-200"}`}>
                <h3 className="font-display text-lg font-bold">Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`rounded-full p-1.5 cursor-pointer ${isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"}`}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* User Profile Info */}
              <div className="flex flex-col items-center text-center space-y-2 py-2">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-3xl border ${isDark ? "bg-white/10 border-white/10" : "bg-slate-100 border-slate-200"}`}>
                  👵
                </div>
                <div>
                  <h4 className="font-bold text-base">{profileName}</h4>
                  <p className="text-xs text-slate-500 dark:text-white/50">{profileLanguage}</p>
                </div>
                <button
                  onClick={() => setEditingProfile(!editingProfile)}
                  className="text-xs font-semibold text-[#7C5CBF] dark:text-[#FFE066] hover:underline cursor-pointer"
                >
                  {editingProfile ? "Close Editor" : "Edit Profile"}
                </button>
              </div>

              <hr className={isDark ? "border-white/10" : "border-slate-200"} />

              {/* Edit Profile Form */}
              {editingProfile ? (
                <div className={`space-y-3 p-3 rounded-2xl border ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                  <h4 className="text-xs font-bold uppercase tracking-wider">Edit Profile</h4>
                  <div className="space-y-2.5">
                    <div>
                      <label className="text-[10px] font-bold text-white/60 dark:text-white/60 uppercase">Name</label>
                      <input
                        value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className={`w-full rounded-xl p-2.5 text-xs outline-none border ${
                          isDark 
                            ? "border-white/10 bg-white/5 text-white focus:border-[#FFE066]" 
                            : "border-slate-200 bg-white text-[#1A0F35] focus:border-[#7C5CBF]"
                        }`}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-white/60 dark:text-white/60 uppercase">Bio</label>
                      <textarea
                        value={profileBio}
                        onChange={(e) => setProfileBio(e.target.value)}
                        className={`w-full rounded-xl p-2.5 text-xs outline-none border ${
                          isDark 
                            ? "border-white/10 bg-white/5 text-white focus:border-[#FFE066]" 
                            : "border-slate-200 bg-white text-[#1A0F35] focus:border-[#7C5CBF]"
                        }`}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Theme Mode Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">{theme === "dark" ? "🌙" : "☀️"}</span>
                      <div>
                        <div className="text-xs font-semibold">Dark Mode</div>
                        <div className="text-[9px] text-slate-500 dark:text-white/50">Toggle app theme</div>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleTheme}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        theme === "dark" ? "bg-[#FFE066]" : "bg-[#7C5CBF]"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          theme === "dark" ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Notifications toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🔔</span>
                      <div>
                        <div className="text-xs font-semibold">Notifications</div>
                        <div className="text-[9px] text-slate-500 dark:text-white/50">Medication and appointments alerts</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsNotificationsEnabled(!isNotificationsEnabled)}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        isNotificationsEnabled ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          isNotificationsEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Privacy settings */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🔒</span>
                      <div>
                        <div className="text-xs font-semibold">Privacy Settings</div>
                        <div className="text-[9px] text-slate-500 dark:text-white/50">Profile visibility & requests</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsPrivacyEnabled(!isPrivacyEnabled)}
                      className={`h-6 w-11 rounded-full p-0.5 transition-colors duration-200 cursor-pointer ${
                        isPrivacyEnabled ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                    >
                      <div
                        className={`h-5 w-5 rounded-full bg-white shadow transform transition-transform duration-200 ${
                          isPrivacyEnabled ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Language Selector */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <span className="text-lg">🌐</span>
                      <div className="text-xs font-semibold">Language / भाषा</div>
                    </div>
                    <select
                      value={profileLanguage}
                      onChange={(e) => setProfileLanguage(e.target.value)}
                      className={`w-full mt-1.5 rounded-xl p-2.5 text-xs outline-none border ${
                        isDark 
                          ? "border-white/10 bg-white/5 text-white" 
                          : "border-slate-200 bg-white text-[#1A0F35]"
                      }`}
                    >
                      <option value="English">English</option>
                      <option value="हिंदी">हिंदी</option>
                      <option value="Punjabi">Punjabi</option>
                      <option value="Tamil">Tamil</option>
                      <option value="Bengali">Bengali</option>
                    </select>
                  </div>

                  {/* FAQ Accordion */}
                  <div className="space-y-2">
                    <div className="text-xs font-bold uppercase tracking-wider pt-1">❓ FAQ & Help</div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                      {[
                        { q: "How do I request a companion?", a: "Go to the Companions tab, select a companion, and click Request Call. Priya will approve and schedule it for you." },
                        { q: "How does the SOS button work?", a: "Tapping the red SOS button at the bottom right instantly opens a menu of 8 emergency actions to call services or alert Priya." },
                        { q: "How can I see my Health Card?", a: "Navigate to the Profile tab. Your Aadhaar-style Health Card and Copy/Share buttons are displayed right there." },
                        { q: "How do I check my appointments?", a: "Your upcoming plans are shown on the Home screen. You can also view details on the Health Calendar in your Profile tab." }
                      ].map((item, idx) => {
                        const isExpanded = expandedFaq === idx;
                        return (
                          <div
                            key={idx}
                            className={`border rounded-xl overflow-hidden ${
                              isDark ? "border-white/10 bg-white/5" : "border-slate-200 bg-slate-50"
                            }`}
                          >
                            <button
                              onClick={() => setExpandedFaq(isExpanded ? null : idx)}
                              className="w-full text-left px-3 py-2 text-xs font-bold flex justify-between items-center cursor-pointer"
                            >
                              <span>{item.q}</span>
                              <span className="text-[10px]">{isExpanded ? "▲" : "▼"}</span>
                            </button>
                            {isExpanded && (
                              <div className={`px-3 pb-2 text-[11px] leading-relaxed border-t pt-1.5 ${
                                isDark ? "text-white/75 border-white/10" : "text-slate-600 border-slate-200"
                              }`}>
                                {item.a}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Support details */}
                  <div className={`border p-3 rounded-2xl text-[11px] space-y-1 ${
                    isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
                  }`}>
                    <div className="font-bold">📞 Contact Support</div>
                    <div>Phone: <a href="tel:+919876543210" className="underline font-semibold text-[#7C5CBF] dark:text-[#FFE066]">+91 98765 43210</a></div>
                    <div>WhatsApp: <a href="https://wa.me/919876543210" className="text-emerald-500 underline font-semibold animate-pulse">Chat Support</a></div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className={`pt-4 border-t space-y-2 ${isDark ? "border-white/10" : "border-slate-200"}`}>
              <button
                onClick={() => alert("Thank you for rating Kartavya App!")}
                className={`w-full rounded-xl font-bold text-xs py-2 hover:opacity-90 cursor-pointer ${
                  isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                ⭐ Rate the App
              </button>
              <button
                onClick={() => setShowLogoutConfirm(true)}
                className="w-full rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-bold text-xs py-2.5 hover:bg-rose-100 cursor-pointer"
              >
                🚪 Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout confirmation dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className={`w-11/12 max-w-sm rounded-3xl border p-5 text-center space-y-4 shadow-2xl ${
            isDark ? "bg-[#1A0F35] border-white/10 text-white" : "bg-white border-slate-200 text-slate-900"
          }`}>
            <div className="text-3xl">🚪</div>
            <h3 className="font-display text-lg font-bold">Confirm Logout</h3>
            <p className="text-xs text-slate-400 dark:text-white/60 leading-relaxed">
              Are you sure you want to logout? You will need to verify with a 4-digit OTP next time you sign in.
            </p>
            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className={`flex-1 rounded-2xl font-bold text-xs py-3.5 cursor-pointer ${
                  isDark ? "bg-white/10 text-white" : "bg-slate-100 text-slate-800"
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  setShowSettings(false);
                  localStorage.removeItem("kartavya_session");
                  localStorage.setItem("kartavya_logged_out", "true");
                  navigate({ to: "/" });
                }}
                className="flex-1 rounded-2xl bg-red-600 text-white font-bold text-xs py-3.5 shadow hover:bg-red-700 cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Google OAuth Simulation Modal */}
      {showGoogleAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs">
          <div className="w-11/12 max-w-sm rounded-3xl bg-white border border-slate-200 p-6 text-center space-y-5 shadow-2xl text-slate-900 animate-in zoom-in-95 duration-200">
            {/* Google Logo representation */}
            <div className="flex justify-center items-center gap-1.5">
              <span className="text-xl font-bold font-sans">
                <span className="text-blue-600">G</span>
                <span className="text-red-600">o</span>
                <span className="text-amber-500">o</span>
                <span className="text-blue-600">g</span>
                <span className="text-green-600">l</span>
                <span className="text-red-600">e</span>
              </span>
              <span className="text-xs text-slate-400 font-bold">Sign-In</span>
            </div>

            <h3 className="font-display text-base font-bold text-slate-800">
              Access Google Calendar
            </h3>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Kartavya app wants to access your Google Calendar to sync appointments, blood tests, volunteer calls, and leisure trips.
            </p>

            <div className="border border-slate-100 rounded-2xl p-3 flex items-center gap-3 bg-slate-50 text-left">
              <div className="h-10 w-10 rounded-full bg-slate-250 flex items-center justify-center text-lg shrink-0">
                👴
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-slate-700 truncate">Ramesh Kumar</div>
                <div className="text-[10px] text-slate-400 truncate font-semibold">ramesh.kumar@gmail.com</div>
              </div>
              <span className="text-emerald-500 text-xs font-bold shrink-0">Active</span>
            </div>

            {syncingProgress ? (
              <div className="py-4 flex flex-col items-center justify-center gap-3">
                <div className="h-8 w-8 border-4 border-[#7C5CBF] border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-bold text-slate-500">Syncing with Google Calendar...</span>
              </div>
            ) : (
              <div className="flex gap-2.5 pt-2">
                <button
                  onClick={() => setShowGoogleAuthModal(false)}
                  className="flex-1 rounded-2xl bg-slate-100 text-slate-850 font-bold text-xs py-3.5 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={startOAuthSync}
                  className="flex-1 rounded-2xl bg-[#7C5CBF] text-white font-bold text-xs py-3.5 shadow hover:bg-[#6849a6] cursor-pointer"
                >
                  Allow Sync
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Appointment Detail Bottom Sheet (Renders globally in Elder portal) */}
      {showAppointmentDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs" onClick={() => setShowAppointmentDetails(false)}>
          <div
            className={`w-full max-w-[640px] rounded-t-[32px] shadow-2xl p-5 border-t-2 border-[#FFE066] animate-in slide-in-from-bottom duration-300 transform translate-y-0 ${
              isDark ? "bg-[#1A0F35] text-white" : "bg-white text-slate-900"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag bar indicator */}
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowAppointmentDetails(false)} />
            
            <div className="space-y-4">
              <div>
                <h3 className="font-display text-xl font-bold text-[#7C5CBF] dark:text-[#FFE066]">Appointment Details</h3>
                <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5 font-bold">Cardiology Consult</p>
              </div>

              {/* Profile Card */}
              <div className={`border p-4 rounded-2xl flex items-center gap-3 ${isDark ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"}`}>
                <div className="h-12 w-12 rounded-full bg-[#FFE066]/25 flex items-center justify-center text-xl text-[#FFE066]">👨‍⚕️</div>
                <div>
                  <h4 className="font-bold text-[#7C5CBF] dark:text-[#FFE066]">Dr. Rakesh Mehta</h4>
                  <p className="text-xs text-slate-600 dark:text-white/70">Cardiologist · 22 yrs exp</p>
                  <p className="text-xs text-slate-400 dark:text-white/50 mt-1">Apollo Hospitals · Bandra, Delhi</p>
                </div>
              </div>

              {/* Why this matters (Elder simplified wording) */}
              <div className={`border p-4 rounded-2xl ${isDark ? "bg-[#FFE066]/10 border-[#FFE066]/30" : "bg-[#7C5CBF]/10 border-[#7C5CBF]/20"}`}>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C5CBF] dark:text-[#FFE066]">Why this appointment matters for you:</h4>
                <p className="text-xs leading-relaxed font-semibold mt-1">
                  "Your blood sugar was slightly high last time. Dr. Mehta will check if your medicines are working well and suggest diet changes. Missing this can affect your kidneys."
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => { setShowAppointmentDetails(false); triggerToast("📅 Appointment added to calendar!"); }}
                  className="w-full rounded-2xl bg-[#FFE066] text-[#1A0F35] font-bold text-xs py-3.5 shadow-md flex items-center justify-center gap-1.5 hover:opacity-90 transition cursor-pointer"
                >
                  Add to Calendar
                </button>
                <button
                  onClick={() => { setShowAppointmentDetails(false); triggerToast("🚗 Transport support request sent! Priya will coordinate."); }}
                  className={`w-full rounded-2xl font-bold text-xs py-3.5 flex items-center justify-center gap-1.5 transition border cursor-pointer ${
                    isDark 
                      ? "bg-white/5 border-white/20 text-[#FFE066] hover:bg-white/10" 
                      : "bg-white border-slate-200 text-[#7C5CBF] hover:bg-slate-50"
                  }`}
                >
                  I need help getting there
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Bar - Seniors Sized */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-30 mx-auto flex max-w-[640px] items-center justify-around border-t px-2 py-3 backdrop-blur-md transition-colors"
        style={{
          backgroundColor: "var(--nav-bg)",
          borderColor: "var(--nav-border)"
        }}
      >
        {[
          { id: "home", label: "Home", icon: <HomeIcon className="h-6 w-6" /> },
          { id: "friends", label: "Friends", icon: <HeartHandshake className="h-6 w-6" /> },
          { id: "entertain", label: "Entertain", icon: <Film className="h-6 w-6" /> },
          { id: "profile", label: "Profile", icon: <Heart className="h-6 w-6" /> },
          { id: "companions", label: "Companions", icon: <Heart className="h-6 w-6" /> },
        ].map((n) => {
          const active = tab === n.id;
          return (
            <button
              key={n.id}
              onClick={() => { setTab(n.id as Tab); setShowSosMenu(false); }}
              className="flex flex-1 flex-col items-center gap-1 transition cursor-pointer"
              style={{ color: active ? "var(--nav-active-text)" : "var(--nav-inactive-text)" }}
            >
              <span
                className="flex h-10 w-14 items-center justify-center rounded-2xl transition"
                style={{ backgroundColor: active ? "var(--nav-active-bg)" : "transparent" }}
              >
                {n.icon}
              </span>
              <span className="text-xs font-bold">{n.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

/* ============================================================================== */
/* 1. ELDER HOME VIEW                                                             */
/* ============================================================================== */

interface Medicine {
  id: string;
  emoji: string;
  name: string;
  time: string;
  instruction: string;
  done: boolean;
}

const MED_MESSAGES = [
  "शाबाश! Great job Ramesh Ji! 💪",
  "Well done! Your health matters 🌟",
  "Bahut achha! Keep it up 🙏",
  "You're doing amazing today! ⭐"
];

function ElderHomeView({
  triggerToast,
  setShowSettings,
  profileName,
  hasEnrolledArt,
  setHasEnrolledArt,
  hasCancelledVrindavan,
  setHasCancelledVrindavan,
  showAppointmentDetails,
  setShowAppointmentDetails,
  theme
}: {
  triggerToast: (msg: string) => void;
  setShowSettings: (val: boolean) => void;
  profileName: string;
  hasEnrolledArt: boolean;
  setHasEnrolledArt: (val: boolean) => void;
  hasCancelledVrindavan: boolean;
  setHasCancelledVrindavan: (val: boolean) => void;
  showAppointmentDetails: boolean;
  setShowAppointmentDetails: (val: boolean) => void;
  theme: "light" | "dark";
}) {
  const [meds, setMeds] = useState<Medicine[]>([
    { id: "m1", emoji: "💊", name: "Metformin 500mg", time: "8:30 AM", instruction: "After breakfast", done: false },
    { id: "m2", emoji: "💊", name: "Multivitamin", time: "1:30 PM", instruction: "After lunch", done: false },
    { id: "m3", emoji: "💊", name: "Atorvastatin 10mg", time: "9:00 PM", instruction: "After dinner", done: false },
  ]);

  // Bottom sheets local visibility states
  const [showVrindavanDetails, setShowVrindavanDetails] = useState(false);
  const [showYogaDetails, setShowYogaDetails] = useState(false);
  const [showArtEnrollment, setShowArtEnrollment] = useState(false);

  const markMedDone = (id: string) => {
    setMeds((ms) =>
      ms.map((m) => {
        if (m.id === id) {
          if (!m.done) {
            const randomMsg = MED_MESSAGES[Math.floor(Math.random() * MED_MESSAGES.length)];
            triggerToast(randomMsg);
          }
          return { ...m, done: true };
        }
        return m;
      })
    );
  };

  const isDark = theme === "dark";

  // Build the upcoming plans list dynamically
  const plans = [];

  if (!hasCancelledVrindavan) {
    plans.push({
      id: "vrindavan",
      title: "Vrindavan & Mathura Tour",
      date: "June 15 - June 18",
      emoji: "🛕",
      bgGradient: "from-purple-900 to-[#1A0F35]",
      border: "border-purple-500/50",
      enrolled: true,
      onClick: () => setShowVrindavanDetails(true)
    });
  }

  plans.push({
    id: "yoga",
    title: "Morning Yoga Session",
    date: "Daily 7:00 AM - 8:00 AM",
    emoji: "🧘",
    bgGradient: "from-emerald-900 to-[#1A0F35]",
    border: "border-emerald-500/50",
    enrolled: true,
    onClick: () => setShowYogaDetails(true)
  });

  plans.push({
    id: "art",
    title: "Art Therapy Session",
    date: "Sunday, June 14 · 10:30 AM",
    emoji: "🎨",
    bgGradient: hasEnrolledArt ? "from-amber-900 to-[#1A0F35]" : "from-slate-700 to-[#1A0F35]",
    border: hasEnrolledArt ? "border-amber-500/50" : "border-white/10 border-dashed",
    enrolled: hasEnrolledArt,
    onClick: () => {
      if (!hasEnrolledArt) {
        setShowArtEnrollment(true);
      } else {
        triggerToast("🎨 You are enrolled! Art Therapy is on Sunday, June 14.");
      }
    }
  });

  return (
    <div className="px-5 pt-5 space-y-6">
      {/* Header Info */}
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[#FFE066] dark:text-[#FFE066] font-display text-[22px] font-bold tracking-wide">Karta<em className="not-italic text-[#7C5CBF] dark:text-white">vya</em></span>
          <div className="text-[11px] uppercase tracking-widest text-slate-500 dark:text-white/50 mt-2 font-semibold">सुप्रभात · Good Morning</div>
          <h1 className="font-display text-3xl font-bold mt-0.5">{profileName} Ji 🙏</h1>
          <p className="text-xs text-slate-500 dark:text-white/60 mt-1 font-semibold">Thursday, June 4 · Delhi · 28°C ☀️</p>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-white/10 flex items-center justify-center text-lg shadow-sm border border-slate-200 dark:border-white/20">💛</div>
          <button
            onClick={() => setShowSettings(true)}
            className="h-10 w-10 rounded-full bg-[#7C5CBF] text-white dark:bg-[#FFE066] dark:text-[#1A0F35] flex items-center justify-center shadow border border-[#7C5CBF] dark:border-[#FFE066] hover:opacity-90 cursor-pointer"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Live Vitals strip */}
      <section className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl bg-[#E11D48]/10 border-2 border-[#E11D48]/40 p-3 flex flex-col justify-between">
          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
            <span className="text-[9px] uppercase font-bold tracking-wider text-[#E11D48]">LIVE</span>
          </div>
          <div className="text-2xl font-bold mt-1">74</div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-white/60">❤️ bpm</div>
        </div>

        <div className="rounded-2xl bg-emerald-500/10 border-2 border-emerald-500/40 p-3 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold tracking-wider text-emerald-500 dark:text-emerald-400">Stable</span>
          <div className="text-2xl font-bold mt-1">97%</div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-white/60">🩸 SpO₂</div>
        </div>

        <div className="rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 dark:bg-[#FFE066]/10 dark:border-[#FFE066]/40 p-3 flex flex-col justify-between">
          <span className="text-[9px] uppercase font-bold tracking-wider text-amber-600 dark:text-[#FFE066]">Target 8h</span>
          <div className="text-2xl font-bold mt-1">6.2</div>
          <div className="text-[10px] font-semibold text-slate-500 dark:text-white/60">😴 Sleep</div>
        </div>
      </section>

      {/* 2x2 Feature Grid */}
      <section className="bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-3xl space-y-3">
        <h3 className="text-xs uppercase font-bold tracking-wider text-[#1A0F35]/50 dark:text-white/50 px-1">Quick Features</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Find Friends", emoji: "🤝" },
            { label: "Entertainment", emoji: "🎬" },
            { label: "My Profile", emoji: "📷" },
            { label: "Companions", emoji: "💛" }
          ].map((f) => (
            <div key={f.label} className="rounded-2xl bg-white dark:bg-[#2A1F45] border border-slate-200 dark:border-white/10 p-4 flex flex-col items-center text-center justify-center gap-2 shadow-xs hover:scale-[1.02] transition-transform">
              <span className="text-3xl">{f.emoji}</span>
              <span className="text-xs font-bold">{f.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming Appointment card */}
      <section className="rounded-3xl border-2 border-[#FFE066] bg-gradient-to-br from-[#2A1F45] to-[#1A0F35] p-4 shadow-[0_0_20px_rgba(255,224,102,0.15)] animate-pulse relative overflow-hidden">
        <div className="flex justify-between items-start">
          <div className="text-white">
            <div className="flex items-center gap-1.5">
              <span className="text-[#FFE066] text-xs">⚡</span>
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#FFE066]">UPCOMING APPOINTMENT</span>
            </div>
            <h3 className="font-display text-lg font-bold text-[#FFE066] mt-2 flex items-center gap-2">
              <Stethoscope className="h-5 w-5 text-[#FFE066]" /> Dr. Mehta – Jun 8
            </h3>
            <p className="text-xs text-white/80 mt-1 pl-7">11:00 AM · Apollo Delhi</p>
          </div>
          <button
            onClick={() => setShowAppointmentDetails(true)}
            className="rounded-full bg-[#FFE066] text-[#1A0F35] font-bold text-xs px-4 py-2 shadow-md hover:opacity-90 transition pr-4 cursor-pointer"
          >
            View
          </button>
        </div>
      </section>

      {/* Daily Medication tracker */}
      <section className="space-y-3">
        <h2 className="font-display text-lg text-[#7C5CBF] dark:text-[#FFE066] px-1 font-bold">Daily Medication</h2>
        <div className="space-y-2.5">
          {meds.map((med) => (
            <div
              key={med.id}
              className={`rounded-2xl p-4 flex items-center justify-between border transition-all duration-300 ${
                med.done
                  ? "bg-emerald-500/10 border-emerald-500/50"
                  : "bg-white dark:bg-white/5 border-slate-200 dark:border-white/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{med.emoji}</span>
                <div>
                  <h4 className={`text-sm font-bold ${med.done ? "text-slate-400 dark:text-white/60 line-through" : ""}`}>
                    {med.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-white/50">{med.time} · {med.instruction}</p>
                </div>
              </div>

              <button
                onClick={() => markMedDone(med.id)}
                disabled={med.done}
                className={`rounded-xl px-4 py-2.5 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  med.done
                    ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30"
                    : "bg-[#FFE066] text-[#1A0F35] shadow hover:opacity-90"
                }`}
              >
                {med.done ? (
                  <>
                    <Check className="h-4 w-4" /> Taken
                  </>
                ) : (
                  "✓ Done"
                )}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 🗓️ Your Upcoming Plans Carousel */}
      <section className="space-y-3">
        <h2 className="font-display text-lg text-[#7C5CBF] dark:text-[#FFE066] px-1 font-bold flex items-center gap-1.5">
          <span>🗓️</span> Your Upcoming Plans
        </h2>

        {plans.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 dark:border-white/20 bg-slate-50 dark:bg-white/5 p-6 text-center space-y-2">
            <p className="text-xs text-slate-500 dark:text-white/50 font-semibold">No trips or sessions yet</p>
            <button
              onClick={() => triggerToast("Browse leisure trips on the Child portal or ask Priya to book! 🚌")}
              className="text-[#7C5CBF] dark:text-[#FFE066] font-bold text-xs hover:underline flex items-center justify-center gap-1 mx-auto"
            >
              Browse Leisure →
            </button>
          </div>
        ) : (
          <div className="flex gap-4 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none">
            {plans.map((p) => (
              <div
                key={p.id}
                onClick={p.onClick}
                className={`flex-shrink-0 w-64 rounded-3xl p-4 border bg-gradient-to-br ${p.bgGradient} ${p.border} shadow-lg cursor-pointer transition-all hover:scale-[1.02] flex flex-col justify-between h-36`}
              >
                <div className="text-white">
                  <div className="flex justify-between items-start">
                    <span className="text-3xl">{p.emoji}</span>
                    <span className={`rounded-full px-2.5 py-0.5 text-[9px] font-bold ${
                      p.enrolled 
                        ? "bg-emerald-500/25 text-emerald-450 border border-emerald-500/35" 
                        : "bg-white/10 text-white/50 border border-white/10"
                    }`}>
                      {p.enrolled ? "✓ Enrolled" : "Not enrolled"}
                    </span>
                  </div>
                  <h3 className="font-display text-sm font-bold mt-2 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-[11px] text-white/70 mt-0.5">{p.date}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Voice Assistant Strip */}
      <section className="rounded-2xl bg-slate-50 dark:bg-[#2A1F45] border border-slate-200 dark:border-white/10 p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5 text-xs font-semibold">
          <span className="text-xl">🤖</span>
          <span>Kartavya Voice Assistant</span>
        </div>
        <button
          onClick={() => triggerToast("🎙️ Listening to voice assistant...")}
          className="rounded-full bg-[#FFE066] text-[#1A0F35] font-bold text-xs px-3.5 py-2 flex items-center gap-1 hover:opacity-90 shadow-sm cursor-pointer"
        >
          <Volume2 className="h-4 w-4" /> Speak to Assistant
        </button>
      </section>

      {/* Vrindavan Detail Sheet */}
      {showVrindavanDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs" onClick={() => setShowVrindavanDetails(false)}>
          <div
            className="w-full max-w-[640px] rounded-t-[32px] bg-[#1A0F35] border-t-2 border-[#FFE066] shadow-2xl p-6 text-white animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowVrindavanDetails(false)} />
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[#FFE066] text-xs">🛕</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#FFE066]">Leisure Pilgrimage</span>
                </div>
                <h3 className="font-display text-xl font-bold text-[#FFE066] mt-1">Vrindavan & Mathura Tour</h3>
                <p className="text-xs text-white/50">June 15 - June 18 · AC Bus Tour</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 text-xs">
                <p className="font-semibold leading-relaxed text-white/90">
                  "A comfortable 4-day pilgrimage tour including Bankey Bihari temple visits, Yamuna Aarti, Krishna Janmabhoomi temple, and guided local tour with fellow seniors."
                </p>
                <div className="pt-2.5 border-t border-white/5 grid grid-cols-2 gap-2 text-[11px] font-bold text-white/70">
                  <div>🚌 AC Transport Included</div>
                  <div>🍲 Pure Veg Meals</div>
                  <div>🩺 Medical Support On-Board</div>
                  <div>🛕 Dedicated Guide</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => { setShowVrindavanDetails(false); triggerToast("📍 Mapping Vrindavan tour route..."); }}
                  className="w-full rounded-2xl bg-[#FFE066] text-[#1A0F35] font-bold text-xs py-3.5 shadow-md hover:opacity-90 transition cursor-pointer"
                >
                  View on Map
                </button>
                <button
                  onClick={() => {
                    if (confirm("Are you sure you want to cancel your enrollment for the Vrindavan tour? Priya will be notified.")) {
                      setHasCancelledVrindavan(true);
                      setShowVrindavanDetails(false);
                      triggerToast("Enrollment cancelled. Priya has been notified.");
                    }
                  }}
                  className="w-full rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-450 font-bold text-xs py-3.5 hover:bg-rose-500/25 transition cursor-pointer"
                >
                  Cancel Enrollment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Yoga Detail Sheet */}
      {showYogaDetails && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs" onClick={() => setShowYogaDetails(false)}>
          <div
            className="w-full max-w-[640px] rounded-t-[32px] bg-[#1A0F35] border-t-2 border-emerald-500 shadow-2xl p-6 text-white animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowYogaDetails(false)} />
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-emerald-400 text-xs">🧘</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">Daily Wellness Session</span>
                </div>
                <h3 className="font-display text-xl font-bold text-emerald-400 mt-1">Morning Yoga Session</h3>
                <p className="text-xs text-white/50">Daily 7:00 AM - 8:00 AM</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2.5 text-xs text-white/95">
                <div>
                  <span className="text-white/60">Location:</span>
                  <div className="font-bold text-white mt-0.5">Community Park, Sector 4, Delhi</div>
                </div>
                <div>
                  <span className="text-white/60">Instructor:</span>
                  <div className="font-bold text-white mt-0.5">Acharya Rajesh Sharma (15 yrs exp)</div>
                </div>
                <p className="font-semibold text-white/80 border-t border-white/5 pt-2.5 leading-relaxed">
                  "Designed for seniors. Gentle stretching, pranayama breathing exercises, and meditation. Helps keep you active, limber, and healthy."
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => { setShowYogaDetails(false); triggerToast("✅ Attendance marked for June 4 Yoga! Great job!"); }}
                  className="w-full rounded-2xl bg-emerald-500 text-white font-bold text-xs py-3.5 shadow-md hover:bg-emerald-600 transition cursor-pointer"
                >
                  Mark Attendance
                </button>
                <button
                  onClick={() => setShowYogaDetails(false)}
                  className="w-full rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-xs py-3.5 hover:bg-white/10 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Art Therapy Enrollment Sheet */}
      {showArtEnrollment && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs" onClick={() => setShowArtEnrollment(false)}>
          <div
            className="w-full max-w-[640px] rounded-t-[32px] bg-[#1A0F35] border-t-2 border-amber-500 shadow-2xl p-6 text-white animate-in slide-in-from-bottom duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowArtEnrollment(false)} />
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-amber-400 text-xs">🎨</span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400">Leisure & Social</span>
                </div>
                <h3 className="font-display text-xl font-bold text-amber-400 mt-1">Art Therapy Session</h3>
                <p className="text-xs text-white/50">Sunday, June 14 · 10:30 AM · Activity Room</p>
              </div>

              <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2 text-xs text-white/95">
                <p className="font-semibold leading-relaxed">
                  "Join other seniors for a creative painting session. Helps improve cognitive focus, hand-eye coordination, and reduces stress. Meet fellow seniors in a relaxed, social atmosphere."
                </p>
                <div className="pt-2 border-t border-white/5 text-[11px] font-bold text-white/70">
                  🖌️ No prior painting skills required. All materials provided!
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  onClick={() => {
                    setHasEnrolledArt(true);
                    setShowArtEnrollment(false);
                    triggerToast("🎨 Enrolled in Art Therapy! Priya has been updated.");
                  }}
                  className="w-full rounded-2xl bg-amber-500 text-white font-bold text-xs py-3.5 shadow-md hover:bg-amber-600 transition cursor-pointer"
                >
                  Confirm Enrollment
                </button>
                <button
                  onClick={() => setShowArtEnrollment(false)}
                  className="w-full rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-xs py-3.5 hover:bg-white/10 transition cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


/* ============================================================================== */
/* 2. ELDER FRIENDS VIEW                                                          */
/* ============================================================================== */

interface Story {
  id: string;
  name: string;
  avatar: string;
  emoji: string;
  ring: "gold" | "green" | "none";
}

interface Person {
  id: string;
  name: string;
  age: number;
  avatarEmoji: string;
  avatarBg: string;
  location: string;
  profession: string;
  distance: string;
  interests: string[];
  bio: string;
  sharedCondition?: string;
}

const PEOPLE_NEARBY: Person[] = [
  { id: "p1", name: "Vijay Sharma", age: 68, avatarEmoji: "👴", avatarBg: "bg-blue-600", location: "Lajpat Nagar", profession: "Retired Teacher", distance: "2.1 km", interests: ["Cricket", "Bhajans", "Chess"], bio: "Looking for chess partners and morning walk companions.", sharedCondition: "Cardiology consult" },
  { id: "p2", name: "Kamla Devi", age: 65, avatarEmoji: "👵", avatarBg: "bg-amber-600", location: "Saket", profession: "Retired Banker", distance: "0.8 km", interests: ["Yoga", "Cooking", "Gardening"], bio: "Happy grandmother who loves light gardening and morning walks.", sharedCondition: "Hypertension support" },
  { id: "p3", name: "Mohan Lal", age: 71, avatarEmoji: "👨", avatarBg: "bg-emerald-600", location: "Khel Gaon", profession: "Retired Engineer", distance: "1.4 km", interests: ["Chess", "Books", "Classical Music"], bio: "Always down for a good game of chess and sharing book reviews.", sharedCondition: "Arthritis management" },
  { id: "p4", name: "Rajan Kapoor", age: 74, avatarEmoji: "🧔", avatarBg: "bg-indigo-600", location: "Dwarka", profession: "Retired Postmaster", distance: "3.2 km", interests: ["Card Games", "History", "Radio"], bio: "Looking to connect with other history buffs and play card games.", sharedCondition: "Diabetes management" },
];

interface ChatMessage {
  id: string;
  from: "them" | "me";
  text?: string;
  voiceUrl?: boolean;
  time: string;
}

function ElderFriendsView({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const [stories, setStories] = useState<Story[]>([
    { id: "s1", name: "Vijay Ji", avatar: "👴", emoji: "🏏", ring: "gold" },
    { id: "s2", name: "Kamla Ji", avatar: "👵", emoji: "🌸", ring: "green" },
    { id: "s3", name: "Mohan Ji", avatar: "👨", emoji: "📚", ring: "gold" },
    { id: "s4", name: "Sarla Ji", avatar: "👩", emoji: "🍲", ring: "green" },
  ]);

  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [showPostStory, setShowPostStory] = useState(false);
  const [storyText, setStoryText] = useState("");
  const [storyColor, setStoryColor] = useState("bg-purple-600");

  // Matching swipe card index
  const [swipeIdx, setSwipeIdx] = useState(0);
  const [showMatchOverlay, setShowMatchOverlay] = useState(false);
  const [matchPerson, setMatchPerson] = useState<Person | null>(null);

  // Profile View
  const [activeProfile, setActiveProfile] = useState<Person | null>(null);

  // Inbox & Chat Screen
  const [showInbox, setShowInbox] = useState(false);
  const [activeChat, setActiveChat] = useState<Person | null>(null);
  const [chatDraft, setChatDraft] = useState("");
  const [chatHistory, setChatHistory] = useState<Record<string, ChatMessage[]>>({
    p1: [
      { id: "c1", from: "them", text: "Namaste Ramesh Ji! Are you coming for the morning walk tomorrow?", time: "5:30 PM" },
      { id: "c2", from: "me", text: "Haan Vijay Ji, absolute on time!", time: "5:32 PM" },
    ]
  });

  const [isRecording, setIsRecording] = useState(false);

  const currentPerson = PEOPLE_NEARBY[swipeIdx % PEOPLE_NEARBY.length];

  const handleSwipe = (action: "pass" | "like" | "super") => {
    if (action === "like") {
      setMatchPerson(currentPerson);
      setShowMatchOverlay(true);
    } else {
      setSwipeIdx((prev) => prev + 1);
    }
  };

  const handlePostStory = () => {
    if (!storyText.trim()) return;
    const newStory: Story = {
      id: "u" + Date.now(),
      name: "Your Story",
      avatar: "👵",
      emoji: "✍️",
      ring: "gold"
    };
    setStories([newStory, ...stories]);
    setStoryText("");
    setShowPostStory(false);
    triggerToast("Story Posted successfully!");
  };

  const sendChatMessage = (text?: string, voice?: boolean) => {
    if (!activeChat) return;
    const msgId = "m" + Date.now();
    const time = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
    const newMsg: ChatMessage = {
      id: msgId,
      from: "me",
      text,
      voiceUrl: voice,
      time
    };

    setChatHistory((hist) => ({
      ...hist,
      [activeChat.id]: [...(hist[activeChat.id] || []), newMsg]
    }));
    setChatDraft("");

    // Reply Simulation
    setTimeout(() => {
      const replyMsg: ChatMessage = {
        id: "r" + Date.now(),
        from: "them",
        text: "Theek hai, dhanyavad! See you soon.",
        time: new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })
      };
      setChatHistory((hist) => ({
        ...hist,
        [activeChat.id]: [...(hist[activeChat.id] || []), replyMsg]
      }));
    }, 1500);
  };

  const startVoiceRecording = () => {
    setIsRecording(true);
    triggerToast("🎤 Recording voice note... Hold to record.");
  };

  const stopVoiceRecording = () => {
    setIsRecording(false);
    sendChatMessage(undefined, true);
  };

  if (activeProfile) {
    return (
      <div className="px-5 pt-5 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveProfile(null)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-bold">Profile Details</h2>
        </div>

        <div className="rounded-3xl bg-[#2A1F45] border border-white/10 p-6 space-y-4 text-center">
          <div className={`h-24 w-24 rounded-full ${activeProfile.avatarBg} mx-auto flex items-center justify-center text-4xl border-4 border-[#FFE066]`}>
            {activeProfile.avatarEmoji}
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white flex items-center justify-center gap-2">
              {activeProfile.name}, {activeProfile.age}
              <span className="text-sm rounded-full bg-[#FFE066]/20 text-[#FFE066] px-2 py-0.5 border border-[#FFE066]/40">✓</span>
            </h3>
            <p className="text-xs text-white/60 mt-1">{activeProfile.profession} · {activeProfile.location}</p>
            <p className="text-xs text-[#FFE066] font-semibold mt-1">📍 {activeProfile.distance} nearby</p>
          </div>

          <p className="text-xs italic bg-white/5 p-3.5 rounded-2xl text-white/80 leading-relaxed max-w-sm mx-auto border border-white/10">
            "{activeProfile.bio}"
          </p>

          <div className="flex justify-center flex-wrap gap-2 pt-2">
            {activeProfile.interests.map((x) => (
              <span key={x} className="rounded-full bg-white/10 px-3.5 py-1 text-[11px] font-bold text-white/80">
                {x}
              </span>
            ))}
          </div>

          {activeProfile.sharedCondition && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-3 rounded-2xl text-xs flex items-center justify-center gap-2">
              <span className="text-emerald-400 font-bold">✓ Shared Interest:</span>
              <span className="text-white/80">{activeProfile.sharedCondition}</span>
            </div>
          )}

          <div className="flex flex-col gap-2.5 pt-4">
            <button
              onClick={() => {
                setActiveChat(activeProfile);
                setShowInbox(true);
                setActiveProfile(null);
              }}
              className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-sm py-4 shadow hover:opacity-90 transition flex items-center justify-center gap-1.5"
            >
              Send Message
            </button>
            <button
              onClick={() => {
                setActiveProfile(null);
                triggerToast(`Request sent to connect with ${activeProfile.name}!`);
              }}
              className="w-full rounded-2xl bg-white/5 border border-white/20 text-[#FFE066] font-bold text-sm py-3.5 hover:bg-white/10 transition"
            >
              Connect
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showInbox) {
    const activeConvo = activeChat ? activeChat : PEOPLE_NEARBY[0];
    const msgs = chatHistory[activeConvo.id] || [];

    return (
      <div className="px-5 pt-5 space-y-4 flex flex-col h-[85vh] text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <button onClick={() => { setShowInbox(false); setActiveChat(null); }} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2">
              <div className={`h-9 w-9 rounded-full ${activeConvo.avatarBg} flex items-center justify-center text-lg`}>
                {activeConvo.avatarEmoji}
              </div>
              <div>
                <h3 className="font-bold text-sm">{activeConvo.name}</h3>
                <span className="text-[10px] text-emerald-400 font-semibold">● Online</span>
              </div>
            </div>
          </div>
        </div>

        {/* Messages view */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {msgs.map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                  m.from === "me"
                    ? "bg-[#FFE066] text-ink rounded-tr-none font-semibold"
                    : "bg-[#2A1F45] text-white rounded-tl-none border border-white/10"
                }`}
              >
                {m.voiceUrl ? (
                  <div className="flex items-center gap-2">
                    <span className="text-base">🎙️</span>
                    <div className="flex items-center gap-1 w-24">
                      <span className="h-3 w-0.5 bg-current animate-pulse" />
                      <span className="h-2 w-0.5 bg-current animate-pulse" />
                      <span className="h-4 w-0.5 bg-current animate-pulse" />
                      <span className="h-3 w-0.5 bg-current animate-pulse" />
                      <span className="h-1 w-0.5 bg-current animate-pulse" />
                    </div>
                    <span className="text-[9px] opacity-70">Voice Note</span>
                  </div>
                ) : (
                  m.text
                )}
                <div className={`text-[8px] mt-1 text-right ${m.from === "me" ? "text-ink/60" : "text-white/40"}`}>
                  {m.time}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input area */}
        <div className="space-y-2.5 pb-2">
          {/* Quick replies */}
          <div className="flex gap-1.5 overflow-x-auto pb-1">
            {["👍 Haan", "😊 Theek hai", "🙏 Dhanyavad", "📞 Call karein"].map((reply) => (
              <button
                key={reply}
                onClick={() => sendChatMessage(reply)}
                className="whitespace-nowrap rounded-full bg-white/10 px-3.5 py-2 text-xs font-bold text-white border border-white/10 hover:bg-white/20"
              >
                {reply}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 border-t border-white/10 pt-3">
            <button
              onClick={() => triggerToast("📷 Sending photo...")}
              className="rounded-full bg-white/10 p-3 text-[#FFE066] hover:bg-white/20 transition"
            >
              <Camera className="h-5 w-5" />
            </button>

            <button
              onMouseDown={startVoiceRecording}
              onMouseUp={stopVoiceRecording}
              onTouchStart={startVoiceRecording}
              onTouchEnd={stopVoiceRecording}
              className={`rounded-full p-3 transition ${
                isRecording ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-[#FFE066] hover:bg-white/20"
              }`}
            >
              <Mic className="h-5 w-5" />
            </button>

            <input
              value={chatDraft}
              onChange={(e) => setChatDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && chatDraft.trim() && sendChatMessage(chatDraft.trim())}
              placeholder="Type message / संदेश लिखें..."
              className="flex-1 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-xs text-white outline-none focus:border-[#FFE066]"
            />

            <button
              onClick={() => chatDraft.trim() && sendChatMessage(chatDraft.trim())}
              className="rounded-full bg-[#FFE066] p-3 text-ink hover:opacity-90 shadow-sm"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-3 px-4 pt-3 space-y-5 pb-5">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-[#FFE066] font-bold">Friends ✨</h2>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/70">14</span>
        </div>
        <button
          onClick={() => setShowInbox(true)}
          className="relative rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition"
        >
          <MessageSquare className="h-5 w-5" />
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-[#1A0F35]">
            2
          </span>
        </button>
      </div>

      {/* Stories row */}
      <section className="flex gap-4 overflow-x-auto pb-1 -mx-4 px-4 scrollbar-none border-b border-white/10">
        <button
          onClick={() => setShowPostStory(true)}
          className="flex flex-col items-center gap-1.5 flex-shrink-0"
        >
          <div className="h-14 w-14 rounded-full border-2 border-dashed border-[#FFE066] flex items-center justify-center text-xl text-[#FFE066] bg-white/5">
            +
          </div>
          <span className="text-[10px] font-bold text-white/70">Your Story</span>
        </button>

        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => setActiveStory(story)}
            className="flex flex-col items-center gap-1.5 flex-shrink-0"
          >
            <div className={`h-14 w-14 rounded-full border-2 flex items-center justify-center text-2xl bg-[#2A1F45] ${
              story.ring === "gold" ? "border-[#FFE066]" : story.ring === "green" ? "border-emerald-500" : "border-white/10"
            }`}>
              {story.avatar}
            </div>
            <span className="text-[10px] font-bold text-white/70">{story.name}</span>
          </button>
        ))}
      </section>

      {/* Main Swipe card */}
      <section className="flex justify-center pt-2">
        <div className="rounded-3xl bg-gradient-to-b from-[#2A1F45] to-[#1A0F35] border border-white/10 p-5 shadow-2xl w-full max-w-[340px] flex flex-col justify-between space-y-4">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="h-24 w-24 rounded-full bg-[#FFE066]/10 mx-auto flex items-center justify-center text-4xl border-4 border-[#FFE066]">
              {currentPerson.avatarEmoji}
            </div>
            <div className="flex items-center gap-1 justify-center">
              <span className="h-1.5 w-1.5 rounded-full bg-[#FFE066]" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
              <span className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>

            <div>
              <h3 className="font-display text-xl font-bold text-white flex items-center justify-center gap-2">
                {currentPerson.name}, {currentPerson.age}
                <span className="text-xs rounded-full bg-[#FFE066]/20 text-[#FFE066] px-1.5 py-0.5 border border-[#FFE066]/40">✓</span>
              </h3>
              <p className="text-xs text-white/60 mt-1">{currentPerson.profession} · {currentPerson.location}</p>
              <p className="text-[10px] text-[#FFE066] font-semibold mt-1">📍 {currentPerson.distance} away</p>
            </div>

            <div className="flex flex-wrap justify-center gap-1.5 pt-1">
              {currentPerson.interests.slice(0, 3).map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-1 text-[10px] font-bold text-white/70">
                  {tag}
                </span>
              ))}
            </div>

            <div className="w-full bg-white/5 p-3 rounded-2xl border border-white/10 text-xs italic text-white/80 text-center leading-relaxed mt-2">
              "{currentPerson.bio}"
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-5 pt-3 border-t border-white/10">
            <button
              onClick={() => handleSwipe("pass")}
              className="h-12 w-12 rounded-full bg-white/10 text-white font-bold flex items-center justify-center text-lg border border-white/20 hover:bg-white/20 active:scale-95 transition"
            >
              ✕
            </button>
            <button
              onClick={() => handleSwipe("super")}
              className="h-14 w-14 rounded-full bg-[#FFE066] text-ink font-bold flex items-center justify-center text-xl shadow-lg border border-[#FFE066] hover:opacity-90 active:scale-95 transition"
            >
              ⭐
            </button>
            <button
              onClick={() => handleSwipe("like")}
              className="h-12 w-12 rounded-full bg-emerald-500 text-white font-bold flex items-center justify-center text-lg border border-emerald-400 hover:bg-emerald-600 active:scale-95 transition"
            >
              ♥
            </button>
          </div>
        </div>
      </section>

      {/* People Nearby Section */}
      <section className="space-y-3 pt-2">
        <h3 className="text-xs uppercase font-bold tracking-wider text-white/50 px-1">People Nearby</h3>
        <div className="flex gap-3 overflow-x-auto pb-1 -mx-4 px-4 snap-x">
          {PEOPLE_NEARBY.map((person) => (
            <div
              key={person.id}
              onClick={() => setActiveProfile(person)}
              className="flex-shrink-0 w-36 bg-[#2A1F45] border border-white/10 rounded-2xl p-3 text-center space-y-2 snap-center cursor-pointer transition active:scale-[0.98]"
            >
              <div className={`h-11 w-11 rounded-full ${person.avatarBg} mx-auto flex items-center justify-center text-xl`}>
                {person.avatarEmoji}
              </div>
              <div>
                <h4 className="font-bold text-xs text-white truncate">{person.name}, {person.age}</h4>
                <p className="text-[10px] text-white/50">{person.distance}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveChat(person);
                  setShowInbox(true);
                }}
                className="w-full rounded-xl bg-[#FFE066] text-ink font-bold text-[10px] py-1.5 shadow"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Matched by Treatment Section */}
      <section className="space-y-3 pt-2">
        <h3 className="text-xs uppercase font-bold tracking-wider text-white/50 px-1">Matched by shared health interest</h3>
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-emerald-600 flex items-center justify-center text-lg">👩</div>
            <div>
              <h4 className="font-bold text-xs">Sarla Gupta, 69</h4>
              <p className="text-[10px] text-white/60">Lodi Colony · Same cardiologist</p>
              <div className="flex gap-1 mt-1">
                <span className="rounded-md bg-emerald-500/20 px-1.5 py-0.5 text-[8px] font-bold text-emerald-400">Type-2</span>
                <span className="rounded-md bg-rose-500/20 px-1.5 py-0.5 text-[8px] font-bold text-rose-400">Hypertension</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const target = PEOPLE_NEARBY.find(x => x.name.includes("Vijay")) || PEOPLE_NEARBY[0];
              setActiveChat(target);
              setShowInbox(true);
            }}
            className="rounded-xl bg-emerald-500 text-white font-bold text-xs px-4 py-2 hover:bg-emerald-600 transition"
          >
            Say Hi
          </button>
        </div>
      </section>

      {/* Story Viewer Overlay */}
      {activeStory && (
        <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4" onClick={() => setActiveStory(null)}>
          {/* Progress bar */}
          <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#FFE066] animate-progress w-full" style={{ animationDuration: "5s" }} />
          </div>

          <div className="flex justify-between items-center text-white/80 mt-2 px-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{activeStory.avatar}</span>
              <span className="font-bold text-xs">{activeStory.name}</span>
            </div>
            <button onClick={() => setActiveStory(null)} className="rounded-full bg-white/10 p-2 text-white">✕</button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
            <span className="text-[120px] filter drop-shadow-lg animate-bounce">{activeStory.emoji}</span>
            <p className="text-xl font-bold text-white max-w-xs leading-relaxed">
              {activeStory.name} shared a moment!
            </p>
          </div>

          <div className="flex justify-center text-xs text-white/40 pb-5">
            Swipe down to close
          </div>
        </div>
      )}

      {/* Post a Story bottom sheet */}
      {showPostStory && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-xs" onClick={() => setShowPostStory(false)}>
          <div
            className="w-full max-w-[640px] rounded-t-[32px] bg-[#1A0F35] shadow-2xl p-5 border-t border-white/10 animate-in slide-in-from-bottom duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-4 cursor-pointer" onClick={() => setShowPostStory(false)} />
            
            <div className="space-y-4 text-white">
              <h3 className="font-display text-lg font-bold text-[#FFE066]">Post a New Story</h3>
              
              <div className="space-y-3">
                <button
                  onClick={() => { setShowPostStory(false); triggerToast("📷 Camera opened... simulated upload!"); }}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 py-3.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  📷 Take Photo
                </button>
                <button
                  onClick={() => { setShowPostStory(false); triggerToast("🖼️ Gallery opened... simulated upload!"); }}
                  className="w-full rounded-2xl bg-white/5 border border-white/10 py-3.5 text-xs font-bold flex items-center justify-center gap-2 hover:bg-white/10"
                >
                  🖼️ Choose from Gallery
                </button>

                <div className="border-t border-white/10 pt-3.5 space-y-2">
                  <span className="text-xs font-bold text-white/70">✍️ Write a text story:</span>
                  <input
                    value={storyText}
                    onChange={(e) => setStoryText(e.target.value)}
                    placeholder="What are you doing today? e.g. Having tea..."
                    className="w-full rounded-xl p-3 bg-white/5 border border-white/10 text-xs outline-none focus:border-[#FFE066]"
                  />
                  <div className="flex gap-2 justify-center py-2">
                    {[
                      "bg-purple-600", "bg-amber-600", "bg-emerald-600",
                      "bg-orange-500", "bg-pink-600", "bg-[#2A1F45]"
                    ].map((col) => (
                      <button
                        key={col}
                        onClick={() => setStoryColor(col)}
                        className={`h-7 w-7 rounded-full border-2 ${col} ${storyColor === col ? 'border-white' : 'border-transparent'}`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={handlePostStory}
                  disabled={!storyText.trim()}
                  className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-3.5 shadow disabled:opacity-40"
                >
                  Post Story
                </button>
                
                <p className="text-[10px] text-center text-white/50">
                  ⌛ Story will automatically expire after 24 hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Match Overlay Animation */}
      {showMatchOverlay && matchPerson && (
        <div className="fixed inset-0 z-50 bg-[#1A0F35]/95 backdrop-blur-md flex flex-col justify-between p-6 text-center text-white">
          <div className="w-full flex justify-end">
            <button onClick={() => setShowMatchOverlay(false)} className="rounded-full bg-white/10 p-2 text-white">✕</button>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center space-y-6">
            {/* Sparkles / Gold Burst Simulation */}
            <div className="relative">
              <span className="absolute -top-6 -left-6 text-3xl animate-bounce">✨</span>
              <span className="absolute -bottom-6 -right-6 text-3xl animate-bounce">🌟</span>
              <div className="flex gap-4">
                <div className="h-24 w-24 rounded-full bg-[#FFE066]/20 border-4 border-[#FFE066] flex items-center justify-center text-4xl shadow-xl">
                  👵
                </div>
                <div className="h-24 w-24 rounded-full bg-emerald-600/20 border-4 border-emerald-500 flex items-center justify-center text-4xl shadow-xl">
                  {matchPerson.avatarEmoji}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="font-display text-3xl font-bold text-[#FFE066]">नमस्ते!</h2>
              <h3 className="font-display text-xl font-bold">You matched with {matchPerson.name} Ji!</h3>
              <p className="text-xs text-white/60 max-w-xs mx-auto">
                You both share similar interests. Say hello and start a conversation!
              </p>
            </div>
          </div>

          <div className="space-y-3.5 pb-10 w-full max-w-sm mx-auto">
            <button
              onClick={() => {
                setActiveChat(matchPerson);
                setShowInbox(true);
                setShowMatchOverlay(false);
              }}
              className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-4 shadow-md hover:opacity-90"
            >
              Say Hi
            </button>
            <button
              onClick={() => {
                setShowMatchOverlay(false);
                setSwipeIdx((prev) => prev + 1);
              }}
              className="w-full rounded-2xl bg-white/5 border border-white/20 text-[#FFE066] font-bold text-xs py-3.5 hover:bg-white/10"
            >
              Keep Browsing
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ============================================================================== */
/* 3. ELDER ENTERTAINMENT VIEW                                                    */
/* ============================================================================== */

interface NewsArticle {
  id: string;
  emoji: string;
  headline: string;
  source: string;
  time: string;
  body: string;
}

const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: "n1",
    emoji: "📺",
    headline: "PM मोदी ने वरिष्ठ नागरिकों के लिए नई स्वास्थ्य योजना शुरू की",
    source: "Aaj Tak",
    time: "अभी-अभी",
    body: "प्रधानमंत्री नरेंद्र मोदी ने वरिष्ठ नागरिकों के लिए एक नई स्वास्थ्य बीमा योजना की घोषणा की है। इस योजना के तहत 70 वर्ष से अधिक आयु के सभी बुजुर्गों को 5 लाख रुपये तक का मुफ्त इलाज दिया जाएगा। योजना का लाभ सीधे डिजिटल कार्ड के माध्यम से मिलेगा, जिसे आसानी से डाउनलोड किया जा सकता है। यह योजना देश के सभी राज्यों में तुरंत प्रभाव से लागू कर दी गई है।"
  },
  {
    id: "n2",
    emoji: "🏏",
    headline: "India beats England in T20 – Rohit Sharma's stunning century!",
    source: "NDTV Sports",
    time: "1 hr ago",
    body: "In a spectacular showing of batsmanship, Indian skipper Rohit Sharma scored an unbeaten 104 off 52 balls to lead India to a historic victory against England in the T20 series decider. Sharma hit 9 sixes and 8 fours, setting a mammoth target. The bowlers successfully restricted England, winning by 45 runs."
  },
  {
    id: "n3",
    emoji: "🌧️",
    headline: "दिल्ली में मानसून इस सप्ताह दस्तक दे सकता है",
    source: "Dainik Jagran",
    time: "2 hr ago",
    body: "दिल्ली-NCR के निवासियों को जल्द ही भीषण गर्मी से राहत मिलने वाली है। मौसम विभाग ने भविष्यवाणी की है कि दक्षिण-पश्चिम मानसून इस सप्ताह के अंत तक दिल्ली में प्रवेश कर जाएगा, जिससे तापमान में भारी गिरावट आएगी। हल्की हवाएं और बौछारें पड़ने की उम्मीद है, जिससे वरिष्ठ नागरिकों को सलाह दी जाती है कि वे अपने स्वास्थ्य का ध्यान रखें और मानसून की फुहारों का सुरक्षित आनंद लें।"
  },
  {
    id: "n4",
    emoji: "📈",
    headline: "Sensex reaches new high — what it means for senior investors",
    source: "Business Standard",
    time: "3 hr ago",
    body: "The Indian stock market indices reached unprecedented heights today, with the Sensex crossing the historic mark. Financial analysts recommend that senior citizen investors consider booking partial profits from equity and shifting allocations towards stable fixed income assets or senior savings schemes for capital preservation."
  }
];

interface Song {
  id: string;
  emoji: string;
  title: string;
  artist: string;
  duration: string;
  category: "devotional" | "oldhindi" | "ghazal" | "radio";
}

const SONGS: Song[] = [
  { id: "s1", emoji: "🕉️", title: "Hanuman Chalisa", artist: "Hariharan", duration: "8:12", category: "devotional" },
  { id: "s2", emoji: "🎸", title: "Raghupati Raghav Raja Ram", artist: "Classical Chorus", duration: "4:30", category: "devotional" },
  { id: "s3", emoji: "🎶", title: "Lag Jaa Gale", artist: "Lata Mangeshkar", duration: "4:15", category: "oldhindi" },
  { id: "s4", emoji: "🎙️", title: "Kabhi Kabhie Mere Dil Mein", artist: "Mukesh", duration: "4:55", category: "oldhindi" },
  { id: "s5", emoji: "🍷", title: "Tum Itna Jo Muskura Rahe Ho", artist: "Jagjit Singh", duration: "5:20", category: "ghazal" },
];

function ElderEntertainmentView({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const [activeNews, setActiveNews] = useState<NewsArticle | null>(null);

  // Music Player States
  const [activeSong, setActiveSong] = useState<Song>(SONGS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicCategory, setMusicCategory] = useState<string>("All");
  const [searchSongQuery, setSearchSongQuery] = useState("");

  // Word Search Game States
  const [showWordSearch, setShowWordSearch] = useState(false);
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [selectedWordCells, setSelectedWordCells] = useState<number[]>([]);
  const [timerCount, setTimerCount] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Word search board config (10x10 letters)
  // Hidden words: CHAI, ROTI, DELHI, TEMPLE, CRICKET
  const gridLetters = [
    "C", "H", "A", "I", "X", "Z", "Q", "W", "E", "R",
    "T", "Y", "R", "O", "T", "I", "U", "I", "O", "P",
    "A", "S", "D", "F", "D", "E", "L", "H", "I", "G",
    "K", "L", "Z", "X", "T", "E", "M", "P", "L", "E",
    "C", "R", "I", "C", "K", "E", "T", "V", "B", "N",
    "M", "Q", "W", "E", "R", "T", "Y", "U", "I", "O",
    "P", "A", "S", "D", "F", "G", "H", "J", "K", "L",
    "Z", "X", "C", "V", "B", "N", "M", "Q", "W", "E",
    "R", "T", "Y", "U", "I", "O", "P", "A", "S", "D",
    "F", "G", "H", "J", "K", "L", "Z", "X", "C", "V",
  ];

  // Helper map for word grids indexes
  const wordsMap: Record<string, number[]> = {
    CHAI: [0, 1, 2, 3],
    ROTI: [12, 13, 14, 15],
    DELHI: [24, 25, 26, 27, 28],
    TEMPLE: [34, 35, 36, 37, 38, 39],
    CRICKET: [40, 41, 42, 43, 44, 45, 46]
  };

  const handleCellClick = (idx: number) => {
    // Basic word search selection simulator
    const nextSelect = [...selectedWordCells];
    if (nextSelect.includes(idx)) {
      setSelectedWordCells(nextSelect.filter(x => x !== idx));
    } else {
      const updated = [...nextSelect, idx].sort((a, b) => a - b);
      setSelectedWordCells(updated);
      
      // Check if matches any target word
      Object.entries(wordsMap).forEach(([word, cells]) => {
        if (!foundWords.includes(word) && cells.every(c => updated.includes(c))) {
          setFoundWords([...foundWords, word]);
          setSelectedWordCells([]);
          triggerToast(`शाबाश! Found it! 🌟  ${word} resolved.`);
        }
      });
    }
  };

  const startWordSearchGame = () => {
    setShowWordSearch(true);
    setFoundWords([]);
    setSelectedWordCells([]);
    setTimerCount(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setTimerCount((t) => t + 1), 1000);
  };

  const closeWordSearchGame = () => {
    setShowWordSearch(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const filteredSongs = SONGS.filter((song) => {
    const matchesCat = musicCategory === "All" || song.category === musicCategory;
    const matchesSearch = song.title.toLowerCase().includes(searchSongQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchSongQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  if (activeNews) {
    return (
      <div className="px-5 pt-5 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveNews(null)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-bold">Breaking News</h2>
        </div>

        <div className="rounded-3xl bg-[#2A1F45] border border-white/10 p-5 space-y-4">
          <div className="flex items-center gap-2 text-xs text-white/50 pb-2 border-b border-white/10">
            <span className="text-lg">{activeNews.emoji}</span>
            <span>{activeNews.source} · {activeNews.time}</span>
          </div>

          <h3 className="font-display text-xl font-bold text-[#FFE066] leading-snug">
            {activeNews.headline}
          </h3>

          <div className="space-y-4 text-sm leading-relaxed text-white/90">
            <p className="text-[16px]">{activeNews.body}</p>
          </div>

          <div className="bg-[#FFE066]/10 border-l-4 border-[#FFE066] p-4 rounded-r-2xl text-xs italic text-white/90 font-medium">
            "We hope this update brings you helpful context today. Stay tuned for further developments."
          </div>

          <div className="flex gap-2.5 pt-3">
            <button
              onClick={() => triggerToast("📤 Sharing article summary...")}
              className="flex-1 rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-3.5 shadow flex items-center justify-center gap-1.5"
            >
              Share News
            </button>
            <button
              onClick={() => setActiveNews(null)}
              className="flex-1 rounded-2xl bg-white/5 border border-white/20 text-[#FFE066] font-bold text-xs py-3.5 hover:bg-white/10"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showWordSearch) {
    const isWin = foundWords.length === 5;
    return (
      <div className="px-5 pt-5 space-y-5 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={closeWordSearchGame} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="font-display text-lg font-bold">Word Search</h2>
          </div>
          <span className="text-xs font-mono font-bold text-[#FFE066]">
            ⏱ {Math.floor(timerCount / 60)}:{(timerCount % 60).toString().padStart(2, "0")}
          </span>
        </div>

        {isWin ? (
          <div className="rounded-3xl bg-[#2A1F45] border-2 border-[#FFE066] p-8 text-center space-y-4 shadow-2xl">
            <span className="text-5xl animate-bounce">🏆</span>
            <h3 className="font-display text-2xl font-bold text-[#FFE066]">शाबाश! Ramesh Ji!</h3>
            <p className="text-xs text-white/70">
              You found all 5 words in {Math.floor(timerCount / 60)} min {timerCount % 60} seconds!
            </p>
            <div className="pt-4 flex gap-2">
              <button
                onClick={startWordSearchGame}
                className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-4 shadow"
              >
                New Game
              </button>
              <button
                onClick={closeWordSearchGame}
                className="w-full rounded-2xl bg-white/5 border border-white/20 text-white font-bold text-xs py-4"
              >
                Exit
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* 10x10 Letters Grid */}
            <div className="grid grid-cols-10 gap-1 bg-[#2A1F45] border border-white/10 p-3 rounded-2xl mx-auto max-w-sm">
              {gridLetters.map((letter, idx) => {
                const isSelected = selectedWordCells.includes(idx);
                // Check if index belongs to any successfully found words
                const isPartFound = Object.entries(wordsMap).some(([word, cells]) =>
                  foundWords.includes(word) && cells.includes(idx)
                );

                return (
                  <button
                    key={idx}
                    onClick={() => handleCellClick(idx)}
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold transition-all ${
                      isSelected
                        ? "bg-[#FFE066] text-ink scale-105"
                        : isPartFound
                        ? "bg-emerald-500 text-white"
                        : "bg-white/5 text-white/90 hover:bg-white/10"
                    }`}
                  >
                    {letter}
                  </button>
                );
              })}
            </div>

            {/* Checklist of words */}
            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-2.5">
              <h4 className="text-[10px] uppercase font-bold text-white/50 tracking-wider">Find these 5 Words:</h4>
              <div className="flex flex-wrap gap-2">
                {["CHAI", "ROTI", "DELHI", "TEMPLE", "CRICKET"].map((word) => {
                  const done = foundWords.includes(word);
                  return (
                    <span
                      key={word}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-bold border transition ${
                        done
                          ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40 line-through"
                          : "bg-white/5 text-white border-white/10"
                      }`}
                    >
                      {word} {done ? "✓" : ""}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="-mt-3 px-4 pt-3 space-y-6 pb-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xl">🎬</span>
        <h2 className="font-display text-lg text-[#FFE066] font-bold">Entertainment</h2>
      </div>

      {/* ============================================================================== */}
      {/* SECTION 1: BREAKING NEWS                                                       */}
      {/* ============================================================================== */}
      <section className="space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 px-1">
          <Newspaper className="h-4 w-4 text-[#FFE066]" /> Breaking News
        </div>
        <div className="space-y-2.5">
          {NEWS_ARTICLES.map((art) => (
            <button
              key={art.id}
              onClick={() => setActiveNews(art)}
              className="flex w-full items-center gap-3 rounded-2xl bg-[#2A1F45] border border-white/5 p-3.5 text-left transition hover:bg-white/5 active:scale-[0.99]"
            >
              <span className="text-2xl">{art.emoji}</span>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-white text-sm leading-snug">{art.headline}</h4>
                <p className="text-[10px] text-white/50 mt-1">{art.source} · {art.time}</p>
              </div>
              <ChevronRight className="h-5 w-5 text-white/40 shrink-0" />
            </button>
          ))}
        </div>
      </section>

      {/* ============================================================================== */}
      {/* SECTION 2: MUSIC                                                               */}
      {/* ============================================================================== */}
      <section className="space-y-3.5 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 px-1">
          <span className="text-base">🎵</span> Music & Radio
        </div>

        {/* Now Playing Widget */}
        <div className="rounded-3xl bg-gradient-to-br from-[#2A1F45] to-[#1A0F35] border border-[#FFE066]/20 p-4 space-y-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="h-14 w-14 rounded-2xl bg-[#FFE066]/20 flex items-center justify-center text-3xl shadow-sm">
              {activeSong.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-display font-bold text-white text-base leading-tight truncate">{activeSong.title}</h4>
              <p className="text-xs text-[#FFE066] mt-0.5">{activeSong.artist}</p>
            </div>
          </div>

          {/* Progress bar mock */}
          <div className="space-y-1">
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-[#FFE066]" style={{ width: isPlaying ? "45%" : "20%" }} />
            </div>
            <div className="flex justify-between text-[9px] text-white/40 font-mono">
              <span>{isPlaying ? "2:04" : "0:52"}</span>
              <span>{activeSong.duration}</span>
            </div>
          </div>

          {/* Controls Row */}
          <div className="flex items-center justify-center gap-5 pt-1">
            <button className="text-white hover:text-[#FFE066]"><SkipBack className="h-5 w-5" /></button>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="h-11 w-11 rounded-full bg-[#FFE066] text-ink flex items-center justify-center hover:opacity-90 shadow-md transition active:scale-95"
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 pl-0.5" />}
            </button>
            <button className="text-white hover:text-[#FFE066]"><SkipForward className="h-5 w-5" /></button>
            <button
              onClick={() => triggerToast(`🔗 Shared song "${activeSong.title}"!`)}
              className="text-white/60 hover:text-white ml-6"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Music Category Filter pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {[
            { id: "All", label: "All Songs" },
            { id: "devotional", label: "🕉️ Devotional" },
            { id: "oldhindi", label: "🎸 Old Hindi" },
            { id: "ghazal", label: "🍷 Ghazals" }
          ].map((cat) => {
            const on = musicCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setMusicCategory(cat.id)}
                className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-bold border transition ${
                  on
                    ? "bg-[#FFE066] text-ink border-[#FFE066]"
                    : "bg-[#2A1F45] text-white/70 border-white/10 hover:bg-white/5"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Live Search bar for music */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
          <input
            value={searchSongQuery}
            onChange={(e) => setSearchSongQuery(e.target.value)}
            placeholder="Search songs or artists..."
            className="w-full rounded-2xl border border-white/10 bg-[#2A1F45] py-3 pl-10 pr-4 text-xs text-white outline-none focus:border-[#FFE066]"
          />
        </div>

        {/* Filtered Song Rows */}
        <div className="space-y-2.5">
          {filteredSongs.map((song) => (
            <div
              key={song.id}
              className="rounded-2xl bg-[#2A1F45] p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{song.emoji}</span>
                <div>
                  <h4 className="font-bold text-xs text-white leading-tight">{song.title}</h4>
                  <p className="text-[10px] text-white/50 mt-0.5">{song.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setActiveSong(song);
                    setIsPlaying(true);
                    triggerToast(`Now playing: ${song.title}`);
                  }}
                  className="rounded-full bg-[#FFE066]/10 p-2 border border-[#FFE066]/30 text-[#FFE066] hover:bg-[#FFE066]/20 transition"
                >
                  <Play className="h-4.5 w-4.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================================== */}
      {/* SECTION 3: QUICK GAMES                                                         */}
      {/* ============================================================================== */}
      <section className="space-y-3 pt-2">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/60 px-1">
          <Gamepad2 className="h-4 w-4 text-[#FFE066]" /> Quick Games
        </div>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={startWordSearchGame}
            className="rounded-2xl bg-[#2A1F45] border border-white/10 p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-3xl">abc</span>
            <span className="text-xs font-bold">Word Search</span>
          </button>
          <button
            onClick={() => triggerToast("🧩 Sudoku is locked... coming soon!")}
            className="rounded-2xl bg-[#2A1F45] border border-white/10 p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-3xl">🧩</span>
            <span className="text-xs font-bold">Sudoku</span>
          </button>
          <button
            onClick={() => triggerToast("♟️ Chess is locked... coming soon!")}
            className="rounded-2xl bg-[#2A1F45] border border-white/10 p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-3xl">♟️</span>
            <span className="text-xs font-bold">Chess</span>
          </button>
          <button
            onClick={() => triggerToast("🎴 Antakshari is locked... coming soon!")}
            className="rounded-2xl bg-[#2A1F45] border border-white/10 p-4 flex flex-col items-center justify-center gap-2 hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-3xl">🎴</span>
            <span className="text-xs font-bold">Antakshari</span>
          </button>
        </div>
      </section>
    </div>
  );
}

/* ============================================================================== */
/* 4. ELDER PROFILE VIEW                                                          */
/* ============================================================================== */

interface Friend {
  id: string;
  name: string;
  age: number;
  avatar: string;
  avatarBg: string;
  city: string;
  interests: string[];
}

const SEED_FRIENDS: Friend[] = [
  { id: "f1", name: "Vijay Sharma", age: 68, avatar: "👴", avatarBg: "bg-blue-600", city: "Lajpat Nagar", interests: ["Cricket", "Chess", "Walks"] },
  { id: "f2", name: "Kamla Devi", age: 65, avatar: "👵", avatarBg: "bg-amber-600", city: "Saket", interests: ["Yoga", "Bhajans"] },
  { id: "f3", name: "Mohan Lal", age: 71, avatar: "👨", avatarBg: "bg-emerald-600", city: "Khel Gaon", interests: ["Chess", "Books"] },
];

const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
const startDayOffset = (month: number, year: number) => {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1; // Mon=0, Tue=1, ..., Sun=6
};

interface CalendarEvent {
  title: string;
  time: string;
  name: string;
  type: "doctor" | "blood" | "volunteer" | "leisure" | "session";
  color: string;
}

const EVENTS_DB: Record<string, CalendarEvent[]> = {
  "2026-05-10": [
    { title: "Fasting Blood Sugar", time: "8:30 AM", name: "Lal Pathlabs", type: "blood", color: "red" }
  ],
  "2026-05-25": [
    { title: "Eye Checkup Appt", time: "3:00 PM", name: "Dr. Khanna", type: "doctor", color: "purple" }
  ],
  "2026-06-02": [
    { title: "HbA1c Blood Test", time: "9:00 AM", name: "Lal Pathlabs", type: "blood", color: "red" }
  ],
  "2026-06-04": [
    { title: "Catch-up Chat", time: "4:00 PM", name: "Companion Amit", type: "volunteer", color: "green" }
  ],
  "2026-06-08": [
    { title: "Cardiology Consult", time: "11:00 AM", name: "Dr. Rakesh Mehta", type: "doctor", color: "purple" }
  ],
  "2026-06-14": [
    { title: "Art Therapy Session", time: "10:30 AM", name: "Instructor Sneha", type: "session", color: "blue" }
  ],
  "2026-06-15": [
    { title: "Vrindavan Pilgrimage", time: "8:00 AM", name: "AC Bus Departure", type: "leisure", color: "yellow" }
  ],
  "2026-06-16": [
    { title: "Vrindavan Day 2", time: "9:00 AM", name: "Guided Tour", type: "leisure", color: "yellow" }
  ],
  "2026-06-17": [
    { title: "Vrindavan Day 3", time: "9:00 AM", name: "Temples visit", type: "leisure", color: "yellow" }
  ],
  "2026-06-18": [
    { title: "Vrindavan Return", time: "4:00 PM", name: "Return Journey", type: "leisure", color: "yellow" }
  ]
};

function ElderProfileView({
  setTab,
  profileName,
  profileBio,
  hasEnrolledArt,
  hasCancelledVrindavan,
  triggerToast,
  isCalendarSynced,
  handleGoogleSync,
  showAppointmentDetails,
  theme
}: {
  setTab: (tab: Tab) => void;
  profileName: string;
  profileBio: string;
  hasEnrolledArt: boolean;
  hasCancelledVrindavan: boolean;
  triggerToast: (msg: string) => void;
  isCalendarSynced: boolean;
  handleGoogleSync: () => void;
  showAppointmentDetails: () => void;
  theme: "light" | "dark";
}) {
  const [showFriendsList, setShowFriendsList] = useState(false);
  const [searchFriendQuery, setSearchFriendQuery] = useState("");

  // Calendar states
  const [calMonth, setCalMonth] = useState(5); // June 2026
  const [calYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState<string>("2026-06-04");

  const filteredFriends = SEED_FRIENDS.filter((f) =>
    f.name.toLowerCase().includes(searchFriendQuery.toLowerCase())
  );

  const getEventsForDay = (dateStr: string) => {
    const events = EVENTS_DB[dateStr] || [];
    return events.filter((evt) => {
      if (evt.title.includes("Vrindavan") && hasCancelledVrindavan) return false;
      if (evt.title.includes("Art Therapy") && !hasEnrolledArt) return false;
      return true;
    });
  };

  const selectedDayEvents = getEventsForDay(selectedDay);
  const selectedDayLabel = selectedDay
    ? new Date(selectedDay).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  const isDark = theme === "dark";

  const generateCalendarDays = () => {
    const totalDays = daysInMonth(calMonth, calYear);
    const offset = startDayOffset(calMonth, calYear);
    const cells = [];

    // Empty cells for offset
    for (let i = 0; i < offset; i++) {
      cells.push(<div key={`empty-${i}`} className="aspect-square" />);
    }

    // Days cells
    for (let day = 1; day <= totalDays; day++) {
      const dateStr = `${calYear}-${(calMonth + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
      const isToday = calMonth === 5 && calYear === 2026 && day === 4;
      const isSelected = selectedDay === dateStr;
      
      const dayEvents = getEventsForDay(dateStr);

      cells.push(
        <button
          key={`day-${day}`}
          onClick={() => setSelectedDay(dateStr)}
          className={`aspect-square flex flex-col items-center justify-between py-1 rounded-xl transition-all relative border text-xs font-bold cursor-pointer ${
            isToday 
              ? "border-amber-400 bg-white/5 text-[#FFE066]" 
              : isSelected 
                ? isDark
                  ? "border-[#FFE066] bg-[#FFE066]/10 text-white"
                  : "border-[#7C5CBF] bg-[#7C5CBF]/10 text-[#7C5CBF]"
                : "border-transparent text-slate-800 dark:text-white/80 hover:bg-slate-105 dark:hover:bg-white/5"
          }`}
          style={{ minWidth: "36px", minHeight: "36px" }}
        >
          <span>{day}</span>
          
          {/* Dots row */}
          <div className="flex gap-0.5 justify-center w-full min-h-[4px]">
            {dayEvents.slice(0, 3).map((evt, idx) => (
              <span
                key={idx}
                className={`h-1.5 w-1.5 rounded-full ${
                  evt.type === 'doctor' ? 'bg-purple-500' :
                  evt.type === 'blood' ? 'bg-red-500' :
                  evt.type === 'volunteer' ? 'bg-emerald-500' :
                  evt.type === 'leisure' ? 'bg-amber-400' : 'bg-blue-500'
                }`}
              />
            ))}
          </div>
        </button>
      );
    }

    return cells;
  };

  if (showFriendsList) {
    return (
      <div className="px-5 pt-5 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setShowFriendsList(false)} className="rounded-full bg-slate-200 dark:bg-white/10 p-2 hover:bg-slate-300 dark:hover:bg-white/20 transition cursor-pointer">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-bold">My Friends (14)</h2>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-white/40" />
          <input
            value={searchFriendQuery}
            onChange={(e) => setSearchFriendQuery(e.target.value)}
            placeholder="Search friends..."
            className="w-full rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#2A1F45] py-3 pl-10 pr-4 text-xs outline-none focus:border-[#7C5CBF] dark:focus:border-[#FFE066] text-slate-900 dark:text-white font-semibold"
          />
        </div>

        <div className="space-y-2.5">
          {filteredFriends.map((f) => (
            <div
              key={f.id}
              className="rounded-2xl bg-white dark:bg-[#2A1F45] border border-slate-200 dark:border-white/5 p-3 flex justify-between items-center"
            >
              <div className="flex items-center gap-3">
                <div className={`h-11 w-11 rounded-full ${f.avatarBg} flex items-center justify-center text-xl`}>
                  {f.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-xs">{f.name}, {f.age}</h4>
                  <p className="text-[10px] text-slate-500 dark:text-white/50 mt-0.5">{f.city}</p>
                </div>
              </div>

              <button
                onClick={() => setTab("friends")}
                className="rounded-xl bg-[#FFE066] text-[#1A0F35] font-bold text-[10px] px-3.5 py-2 cursor-pointer shadow hover:opacity-90"
              >
                Chat
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-3 px-4 pt-3 space-y-5 pb-5 text-center">
      {/* Header */}
      <div className="flex justify-between items-center px-1">
        <div className="flex items-center gap-2">
          <h2 className="font-display text-lg text-[#7C5CBF] dark:text-[#FFE066] font-bold">My Profile</h2>
        </div>
        <button
          onClick={() => alert("Edit Profile screen - coming soon!")}
          className="rounded-full bg-[#FFE066] text-[#1A0F35] font-bold text-xs px-4 py-1.5 shadow hover:opacity-90 cursor-pointer"
        >
          Edit
        </button>
      </div>

      {/* Avatar block */}
      <div className="space-y-3">
        <div className="h-24 w-24 rounded-full bg-[#FFE066]/10 mx-auto flex items-center justify-center text-4xl border-4 border-[#FFE066]">
          👵
        </div>
        <div>
          <h3 className="font-display text-2xl font-bold">{profileName}</h3>
          <p className="text-xs text-slate-500 dark:text-white/50 mt-0.5">72 · Delhi · Retired Teacher</p>
        </div>

        <button
          onClick={() => setShowFriendsList(true)}
          className="mx-auto rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 px-4 py-1.5 text-xs font-bold text-[#7C5CBF] dark:text-[#FFE066] flex items-center gap-1.5 hover:bg-slate-250 dark:hover:bg-white/10 cursor-pointer"
        >
          👥 14 Friends
        </button>

        {/* Interests */}
        <div className="flex justify-center flex-wrap gap-2 pt-1">
          {["Cricket", "Bhajans", "Chess", "Books"].map((x) => (
            <span key={x} className="rounded-full bg-slate-100 dark:bg-[#2A1F45] px-3 py-1 text-xs font-bold text-slate-700 dark:text-white/80">
              {x}
            </span>
          ))}
        </div>
      </div>

      {/* Bio Quote box */}
      <div className="bg-slate-50 dark:bg-[#2A1F45] p-4 rounded-3xl border border-slate-200 dark:border-white/5 italic text-sm text-slate-800 dark:text-white/80 leading-relaxed max-w-sm mx-auto">
        "{profileBio}"
      </div>

      {/* Photos Grid */}
      <section className="space-y-3 text-left">
        <div className="flex justify-between items-center px-1 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">
          <span>My Photos</span>
          <button
            onClick={() => alert("Upload photo - family approval requested!")}
            className="text-[#7C5CBF] dark:text-[#FFE066] font-bold cursor-pointer hover:underline"
          >
            + Upload
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {["🌅", "🏏", "☕", "🌿", "🕌"].map((emoji, i) => (
            <div key={i} className="aspect-square rounded-2xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-4xl cursor-pointer hover:bg-slate-100 dark:hover:bg-white/10 shadow-xs">
              {emoji}
            </div>
          ))}
          <div className="aspect-square rounded-2xl border-2 border-dashed border-slate-300 dark:border-white/20 bg-slate-50 dark:bg-white/5 flex items-center justify-center text-2xl text-slate-400 dark:text-white/40 cursor-pointer hover:border-slate-400 dark:hover:border-white/40">
            +
          </div>
        </div>
      </section>

      {/* 🪪 My Health Card */}
      <section className="space-y-3 text-left pt-3 border-t border-slate-200 dark:border-white/10">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60 px-1">
          🪪 My Health Card
        </h3>
        
        {/* Navy Gradient Card */}
        <div className="rounded-3xl p-5 text-white shadow-xl space-y-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-white/20 relative overflow-hidden">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9px] uppercase font-bold tracking-widest text-indigo-300">
                INDIA / भारत · KARTAVYA HEALTH PROFILE
              </span>
              <h2 className="font-display text-xl font-bold mt-1 text-white">{profileName}</h2>
              <p className="text-[11px] text-white/80 mt-0.5 font-semibold">Male · 72 yrs · B Positive · Delhi</p>
            </div>
            <span className="text-2xl">💳</span>
          </div>

          <div className="flex items-center justify-between font-mono text-lg font-bold tracking-[0.12em] text-[#FFE066] bg-white/5 rounded-xl px-3 py-2 border border-white/5">
            <span>XXXX XXXX 7823</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText("KTV-DL-2024-00847");
                triggerToast("Universal Health ID copied!");
              }}
              className="text-xs font-bold text-[#FFE066] bg-[#FFE066]/10 px-2 py-1 rounded-lg hover:bg-[#FFE066]/20 transition flex items-center gap-1 active:scale-95 cursor-pointer"
            >
              <Copy className="h-3 w-3" /> Copy
            </button>
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
              <span className="text-white/60 font-medium text-[10px]">Conditions</span>
              <div className="font-semibold text-white mt-0.5">BP · Diabetes · Arthritis</div>
            </div>
            <div>
              <span className="text-white/60 font-medium text-[10px]">Universal ID</span>
              <div className="font-semibold text-white mt-0.5 font-mono">KTV-DL-2024-00847</div>
            </div>
          </div>
        </div>

        {/* Share buttons row */}
        <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-bold">
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Ramesh Kumar's Health Profile Card (KTV-DL-2024-00847). View-only record link: https://kartavya.care/records/summary/ramesh_kumar. Note: Link expires in 48 hours.`);
              triggerToast("Shared on WhatsApp!");
            }}
            className="flex flex-col items-center gap-1.5 bg-emerald-55 dark:bg-emerald-600/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-400 rounded-2xl py-3.5 hover:bg-emerald-100 dark:hover:bg-emerald-600/20 transition cursor-pointer shadow-2xs"
          >
            <span className="text-xl">💬</span>
            WhatsApp
          </button>
          <button
            onClick={() => {
              window.location.href = `mailto:?subject=Ramesh%20Kumar%20-%20Health%20Profile%20Record%20(KTV-DL-2024-00847)&body=Hi,%20Please%20find%20attached%2520Ramesh%2520Kumar's%2520Kartavya%2520Health%2520Record.%2520Universal%2520ID:%2520KTV-DL-2024-00847.%252520This%252520record%252520will%252520expire%252520in%25252048%252520hours.`;
              triggerToast("Email client opened!");
            }}
            className="flex flex-col items-center gap-1.5 bg-blue-55 dark:bg-blue-600/10 border border-blue-200 dark:border-blue-500/20 text-blue-700 dark:text-blue-400 rounded-2xl py-3.5 hover:bg-blue-100 dark:hover:bg-blue-600/20 transition cursor-pointer shadow-2xs"
          >
            <span className="text-xl">📧</span>
            Email
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText("https://kartavya.care/records/summary/ramesh_kumar");
              triggerToast("Health record link copied!");
            }}
            className="flex flex-col items-center gap-1.5 bg-purple-55 dark:bg-[#FFE066]/10 border border-purple-200 dark:border-[#FFE066]/20 text-[#7C5CBF] dark:text-[#FFE066] rounded-2xl py-3.5 hover:bg-purple-100 dark:hover:bg-[#FFE066]/20 transition cursor-pointer shadow-2xs"
          >
            <span className="text-xl">🔗</span>
            Copy Link
          </button>
          <button
            onClick={() => {
              triggerToast("Send to Printer... Print successful!");
            }}
            className="flex flex-col items-center gap-1.5 bg-purple-55 dark:bg-purple-600/10 border border-purple-200 dark:border-purple-500/20 text-purple-700 dark:text-purple-400 rounded-2xl py-3.5 hover:bg-purple-100 dark:hover:bg-purple-600/20 transition cursor-pointer shadow-2xs"
          >
            <span className="text-xl">🖨️</span>
            Print Card
          </button>
        </div>

        <div className="text-[10px] text-slate-400 dark:text-white/40 text-center font-bold pt-1">
          ⚠️ Share links expire in 48 hours for security.
        </div>
      </section>

      {/* 📅 Health Calendar */}
      <section className="space-y-3 text-left pt-4 border-t border-slate-200 dark:border-white/10">
        <div className="flex justify-between items-center px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-white/60">
            📅 Health Calendar
          </h3>
          <button
            onClick={handleGoogleSync}
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold shadow transition flex items-center gap-1 cursor-pointer ${
              isCalendarSynced 
                ? "bg-emerald-600 text-white" 
                : "bg-[#FFE066] text-[#1A0F35] hover:opacity-90 animate-pulse"
            }`}
          >
            {isCalendarSynced ? "✓ Synced with Google" : "Sync with Google Calendar"}
          </button>
        </div>

        <div className="bg-slate-50 dark:bg-[#2A1F45] border border-slate-200 dark:border-white/10 rounded-3xl p-4 space-y-4 shadow-2xs">
          {/* Calendar Header with Month Nav */}
          <div className="flex justify-between items-center border-b border-slate-200 dark:border-white/15 pb-3">
            <button
              onClick={() => {
                if (calMonth === 5) setCalMonth(4);
                else if (calMonth === 6) setCalMonth(5);
                else setCalMonth(5);
              }}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/10 transition text-xs font-bold cursor-pointer"
            >
              ◀ Prev
            </button>
            <h4 className="font-display font-bold text-sm text-[#7C5CBF] dark:text-[#FFE066]">
              {calMonth === 4 ? "May 2026" : calMonth === 5 ? "June 2026" : "July 2026"}
            </h4>
            <button
              onClick={() => {
                if (calMonth === 4) setCalMonth(5);
                else if (calMonth === 5) setCalMonth(6);
                else setCalMonth(5);
              }}
              className="p-1.5 rounded-lg bg-slate-200 dark:bg-white/5 text-slate-800 dark:text-white hover:bg-slate-300 dark:hover:bg-white/10 transition text-xs font-bold cursor-pointer"
            >
              Next ▶
            </button>
          </div>

          {/* Weekday names */}
          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 dark:text-white/40 uppercase">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5">
            {generateCalendarDays()}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-2.5 justify-center pt-2 border-t border-slate-200 dark:border-white/5 text-[9px] text-slate-500 dark:text-white/60 font-semibold">
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-purple-500" />
              <span>Doctor</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-red-500" />
              <span>Blood Test</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span>Companion</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              <span>Trip</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              <span>Session</span>
            </div>
          </div>
        </div>

        {/* Selected day events display */}
        {selectedDayEvents.length > 0 ? (
          <div className="bg-purple-50 dark:bg-[#FFE066]/10 border border-purple-200 dark:border-[#FFE066]/30 p-4 rounded-3xl space-y-3 text-slate-900 dark:text-white shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#7C5CBF] dark:text-[#FFE066]">
              Events for {selectedDayLabel}
            </h4>
            <div className="space-y-2">
              {selectedDayEvents.map((evt, idx) => (
                <div key={idx} className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-3 rounded-2xl flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${
                      evt.type === 'doctor' ? 'bg-purple-500' :
                      evt.type === 'blood' ? 'bg-red-500' :
                      evt.type === 'volunteer' ? 'bg-emerald-500' :
                      evt.type === 'leisure' ? 'bg-amber-400' : 'bg-blue-500'
                    }`} />
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-white">{evt.title}</div>
                      <p className="text-[10px] text-slate-500 dark:text-white/60 mt-0.5">{evt.time} · {evt.name}</p>
                    </div>
                  </div>
                  {evt.type === 'doctor' && (
                    <button
                      onClick={showAppointmentDetails}
                      className="rounded-lg bg-[#FFE066] text-[#1A0F35] font-bold text-[10px] px-2.5 py-1.5 active:scale-95 transition cursor-pointer shadow-xs font-semibold"
                    >
                      View Details
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-4 rounded-3xl text-center text-xs text-slate-500 dark:text-white/50 font-semibold">
            No events scheduled for {selectedDayLabel || "selected day"}.
          </div>
        )}
      </section>
    </div>
  );
}

/* ============================================================================== */
/* 5. ELDER COMPANIONS VIEW                                                       */
/* ============================================================================== */

interface Companion {
  id: string;
  emoji: string;
  name: string;
  rating: number;
  sessions: number;
  languages: string[];
  about: string;
  skills: string[];
}

const COMPANIONS_LIST: Companion[] = [
  { id: "c1", emoji: "👩‍🦰", name: "Meena Verma", rating: 4.9, sessions: 87, languages: ["Hindi", "English"], about: "Trained elderly companion with 6 years experience. Specializes in conversation, reading books aloud, and slow walking guidance.", skills: ["Storytelling", "Light Stretching", "Patience"] },
  { id: "c2", emoji: "👩", name: "Ananya Singh", rating: 4.7, sessions: 42, languages: ["Hindi"], about: "Friendly, compassionate companion who loves sharing religious chants, harmonium singing, and listening to old stories.", skills: ["Bhajan Singing", "Cooking help", "Listening"] }
];

function ElderCompanionsView({ triggerToast }: { triggerToast: (msg: string) => void }) {
  const [activeCompanionProfile, setActiveCompanionProfile] = useState<Companion | null>(null);

  // Video call simulation state
  const [activeVideoCall, setActiveVideoCall] = useState<string | null>(null);
  const [videoCallTimer, setVideoCallTimer] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startVideoCall = (member: string) => {
    setActiveVideoCall(member);
    setVideoCallTimer(0);
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => setVideoCallTimer((t) => t + 1), 1000);
  };

  const endVideoCall = () => {
    setActiveVideoCall(null);
    if (intervalRef.current) clearInterval(intervalRef.current);
    triggerToast("Video Call ended successfully.");
  };

  if (activeCompanionProfile) {
    const comp = activeCompanionProfile;
    return (
      <div className="px-5 pt-5 space-y-5">
        <div className="flex items-center gap-3">
          <button onClick={() => setActiveCompanionProfile(null)} className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display text-lg font-bold">Companion Profile</h2>
        </div>

        <div className="rounded-3xl bg-[#2A1F45] border border-white/10 p-5 space-y-4 text-center">
          <div className="h-24 w-24 rounded-full bg-[#FFE066]/10 mx-auto flex items-center justify-center text-4xl border-4 border-[#FFE066]">
            {comp.emoji}
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white flex items-center justify-center gap-1">
              {comp.name}
              <span className="text-xs text-[#FFE066]">✓</span>
            </h3>
            <p className="text-xs text-white/50 mt-0.5">Verified Companion</p>
            <p className="text-xs text-[#FFE066] font-bold mt-1">★ {comp.rating} Rating</p>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="font-bold text-[#FFE066]">{comp.sessions}</div>
              <div className="text-[9px] text-white/50 mt-0.5">Sessions</div>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="font-bold text-[#FFE066]">100%</div>
              <div className="text-[9px] text-white/50 mt-0.5">On-Time</div>
            </div>
            <div className="bg-white/5 p-2.5 rounded-xl border border-white/10">
              <div className="font-bold text-[#FFE066]">6 yrs</div>
              <div className="text-[9px] text-white/50 mt-0.5">Experience</div>
            </div>
          </div>

          <div className="text-left space-y-2">
            <h4 className="text-xs uppercase font-bold text-white/50">About:</h4>
            <p className="text-xs text-white/80 leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
              {comp.about}
            </p>
          </div>

          <div className="text-left space-y-2">
            <h4 className="text-xs uppercase font-bold text-white/50">Skills & Activities:</h4>
            <div className="flex flex-wrap gap-1.5">
              {comp.skills.map((s) => (
                <span key={s} className="rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold text-[#FFE066]">
                  {s}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2 pt-4">
            <button
              onClick={() => {
                setActiveCompanionProfile(null);
                triggerToast(`Requested call with ${comp.name}! Priya will approve.`);
              }}
              className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-4 shadow"
            >
              Request Call with {comp.name.split(" ")[0]} 📞
            </button>
            <button
              onClick={() => {
                setActiveCompanionProfile(null);
                triggerToast(`Requested home visit from ${comp.name}! Priya will approve.`);
              }}
              className="w-full rounded-2xl bg-white/5 border border-white/20 text-[#FFE066] font-bold text-xs py-3.5 hover:bg-white/10"
            >
              Schedule Home Visit 🏠
            </button>
            <span className="text-[10px] text-white/40">⏳ Your family will approve this request before booking.</span>
          </div>
        </div>
      </div>
    );
  }

  if (activeVideoCall) {
    return (
      <div className="fixed inset-0 z-50 bg-[#1A0F35] flex flex-col justify-between p-6 text-center text-white font-sans">
        <div className="pt-8">
          <span className="rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-white/70">
            Family Video Call
          </span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center space-y-5">
          <div className="h-32 w-32 rounded-full bg-[#FFE066]/10 border-4 border-[#FFE066] flex items-center justify-center text-5xl shadow-2xl animate-pulse">
            👵
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold">{activeVideoCall}</h3>
            <p className="text-sm text-[#FFE066] font-bold mt-1.5">
              {videoCallTimer < 3 ? "Connecting..." : `Connected · ${Math.floor(videoCallTimer / 60)}:${(videoCallTimer % 60).toString().padStart(2, "0")}`}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="space-y-4 pb-10">
          <div className="flex justify-center gap-6">
            <button className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl hover:bg-white/20">
              🎙️
            </button>
            <button
              onClick={endVideoCall}
              className="h-16 w-16 rounded-full bg-red-600 border-2 border-red-500 flex items-center justify-center text-white shadow-lg active:scale-95 transition"
            >
              <X className="h-7 w-7" />
            </button>
            <button className="h-14 w-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xl hover:bg-white/20">
              🔄
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="-mt-3 px-4 pt-3 space-y-6 pb-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <span className="text-xl">💛</span>
        <h2 className="font-display text-lg text-[#FFE066] font-bold">Companions</h2>
      </div>

      {/* Intro banner */}
      <section className="rounded-3xl border-2 border-[#FFE066]/30 bg-white/5 p-4 text-left">
        <h3 className="text-sm font-bold text-[#FFE066]">Your Support Options</h3>
        <p className="text-xs text-white/70 mt-1 leading-relaxed">
          Talk, meet, or video call — choose what feels right today.
        </p>
      </section>

      {/* ============================================================================== */}
      {/* OPTION 1: Talk to a Companion                                                  */}
      {/* ============================================================================== */}
      <section className="rounded-3xl bg-[#2A1F45] border border-white/5 p-4 space-y-3">
        <div className="flex items-start gap-3 border-b border-white/10 pb-3">
          <div className="h-10 w-10 rounded-full bg-[#FFE066]/10 flex items-center justify-center text-lg text-[#FFE066] border border-[#FFE066]/30 shrink-0">
            📞
          </div>
          <div>
            <h3 className="font-bold text-sm">Talk to a Companion</h3>
            <p className="text-[10px] text-white/50 mt-0.5">Schedule a phone call · Needs family approval</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-white/80">
          Our trained companions are here to listen, chat, and brighten your day. Your daughter Priya will confirm the time.
        </p>

        <div className="space-y-2 pt-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-white/50">Choose a Companion:</span>
          {COMPANIONS_LIST.map((comp) => (
            <div
              key={comp.id}
              className="rounded-2xl bg-white/5 border border-white/10 p-3 flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{comp.emoji}</span>
                <div>
                  <h4 className="font-bold text-white flex items-center gap-1">
                    {comp.name} <span className="text-[#FFE066] font-bold">✓</span>
                  </h4>
                  <p className="text-[10px] text-white/50 mt-0.5">Hindi · ★ {comp.rating} rating</p>
                </div>
              </div>
              <button
                onClick={() => setActiveCompanionProfile(comp)}
                className="text-[#FFE066] font-bold text-xs hover:underline"
              >
                View →
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => triggerToast("Request for Phone Call Companion sent! Priya will coordinate.")}
          className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-xs py-3.5 shadow-md flex items-center justify-center gap-1.5 hover:opacity-90"
        >
          Request a Call 📞
        </button>
        <div className="text-[10px] text-white/40 text-center">⏳ Priya ji will approve this request</div>
      </section>

      {/* ============================================================================== */}
      {/* OPTION 2: Home Visit                                                           */}
      {/* ============================================================================== */}
      <section className="rounded-3xl bg-emerald-500/5 border-2 border-emerald-500/20 p-4 space-y-3">
        <div className="flex items-start gap-3 border-b border-white/10 pb-3">
          <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-lg text-emerald-400 border border-emerald-500/20 shrink-0">
            🏠
          </div>
          <div>
            <h3 className="font-bold text-sm">Home Visit</h3>
            <p className="text-[10px] text-white/50 mt-0.5">Companion comes to you · Needs family approval</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-white/80">
          A companion visits your home for a chat, light activity, or just company. All volunteers are background-verified.
        </p>

        <div className="rounded-2xl bg-white/5 border border-white/10 p-3 flex justify-between items-center text-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">👴</span>
            <div>
              <h4 className="font-bold text-white flex items-center gap-1">
                Suresh Nair <span className="text-[#FFE066] font-bold">✓</span>
              </h4>
              <p className="text-[10px] text-white/50 mt-0.5">Chess · Walks · Hindi · ★ 4.8</p>
            </div>
          </div>
          <button
            onClick={() => setActiveCompanionProfile({ id: "c3", emoji: "👴", name: "Suresh Nair", rating: 4.8, sessions: 54, languages: ["Hindi"], about: "Background verified home companion. Loves playing chess and accompanying seniors on local walks.", skills: ["Chess", "Walks", "Conversation"] })}
            className="text-emerald-400 font-bold text-xs hover:underline"
          >
            View →
          </button>
        </div>

        <button
          onClick={() => triggerToast("Request for Home Visit sent! Priya will coordinate.")}
          className="w-full rounded-2xl bg-emerald-500 text-white font-bold text-xs py-3.5 shadow-md flex items-center justify-center gap-1.5 hover:bg-emerald-600"
        >
          Schedule Home Visit 🏠
        </button>
        <div className="text-[10px] text-white/40 text-center">⏳ Priya ji will approve this request</div>
      </section>

      {/* ============================================================================== */}
      {/* OPTION 3: Video Call Family                                                    */}
      {/* ============================================================================== */}
      <section className="rounded-3xl bg-[#2A1F45] border border-white/5 p-4 space-y-3">
        <div className="flex items-start gap-3 border-b border-white/10 pb-3">
          <div className="h-10 w-10 rounded-full bg-white/10 flex items-center justify-center text-lg text-[#FFE066] shrink-0">
            📹
          </div>
          <div>
            <h3 className="font-bold text-sm">Video Call Family</h3>
            <p className="text-[10px] text-white/50 mt-0.5">Instant · No mobile number needed</p>
          </div>
        </div>

        <p className="text-xs leading-relaxed text-white/80">
          Connect instantly with your family. No numbers needed — just tap and ring!
        </p>

        <div className="space-y-2">
          {[
            { name: "Priya (Daughter)", online: true },
            { name: "Arun (Son)", online: false }
          ].map((member) => (
            <div
              key={member.name}
              className="rounded-2xl bg-white/5 border border-white/10 p-3 flex justify-between items-center text-xs"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-2xl">{member.online ? "👩" : "👦"}</span>
                <div>
                  <h4 className="font-bold text-white">{member.name}</h4>
                  <p className={`text-[10px] font-semibold ${member.online ? 'text-emerald-400' : 'text-white/40'}`}>
                    {member.online ? "● Online" : "● Offline"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => member.online && startVideoCall(member.name)}
                disabled={!member.online}
                className={`rounded-xl px-4 py-2 font-bold text-xs transition flex items-center gap-1 ${
                  member.online
                    ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow"
                    : "bg-white/5 text-white/30 cursor-not-allowed border border-white/10"
                }`}
              >
                📹 Call
              </button>
            </div>
          ))}
        </div>
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
