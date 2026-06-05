import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/child/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Kartavya" },
      { name: "description", content: "Sign in to Kartavya with your mobile number and OTP." },
    ],
  }),
  component: ChildAuth,
});

type Screen = "welcome" | "mobile" | "otp" | "register-prompt";

function ChildAuth() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("welcome");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>([]);
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const profile = localStorage.getItem("kartavya_child_profile");
    const session = localStorage.getItem("kartavya_session");
    // If logged in, go to dashboard
    if (session === "child") {
      navigate({ to: "/child/dashboard" });
      return;
    }
    // If profile exists but no session, show login options
    if (profile) {
      setScreen("welcome");
    }
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    setOtp(Array(len).fill(""));
  }, [navigate]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (screen === "otp" && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [screen, timer]);

  const cleanMobile = (v: string) => mobile.replace(/\D/g, "").slice(-10);

  const sendOtp = () => {
    setError(null);
    const cleaned = cleanMobile(mobile);
    if (!/^\d{10}$/.test(cleaned)) {
      setError("Enter a valid 10-digit mobile number");
      return;
    }
    setOtpSent(true);
    setTimer(30);
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    setOtp(Array(len).fill(""));
    setScreen("otp");
    // Auto-focus first OTP field after transition
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const verifyOtp = () => {
    setError(null);
    const code = otp.join("");
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    if (code.length < len) {
      setError(`Enter the ${len}-digit OTP`);
      return;
    }
    localStorage.removeItem("kartavya_logged_out");
    localStorage.setItem("kartavya_session", "child");
    navigate({ to: "/child/dashboard" });
  };

  const handleOtpChange = (idx: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[idx] = digit;
    setOtp(next);
    setError(null);
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    if (digit && idx < len - 1) {
      otpRefs.current[idx + 1]?.focus();
    }
    // Auto-verify when all digits entered
    if (idx === len - 1 && digit) {
      const code = [...next.slice(0, len - 1), digit].join("");
      if (code.length === len) {
        setTimeout(() => {
          localStorage.removeItem("kartavya_logged_out");
          localStorage.setItem("kartavya_session", "child");
          navigate({ to: "/child/dashboard" });
        }, 200);
      }
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  const resendOtp = () => {
    if (timer > 0) return;
    setTimer(30);
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    setOtp(Array(len).fill(""));
    setError(null);
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const header = (
    <div className="flex items-center justify-between px-5 py-4 text-white"
      style={{ background: "linear-gradient(135deg, var(--lav-dd), var(--lav-d))" }}>
      <button
        onClick={() => {
          if (screen === "mobile") setScreen("welcome");
          else if (screen === "otp") setScreen("mobile");
          else navigate({ to: "/" });
        }}
        className="rounded-full bg-white/20 px-3 py-1 text-xs transition hover:bg-white/30"
      >
        ← Back
      </button>
      <span className="font-display text-base tracking-wide">Son / Daughter</span>
      <span className="w-12" />
    </div>
  );

  return (
    <div className="flex min-h-screen flex-col"
      style={{ background: "linear-gradient(160deg, var(--lav-l), #fff)" }}>
      {header}

      <div className="flex flex-1 flex-col items-center justify-center gap-5 px-6 py-10">
        {/* WELCOME SCREEN */}
        {screen === "welcome" && (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-[0_2px_16px_rgba(74,48,128,0.12)]">
                🙏
              </div>
              <h2 className="font-display text-3xl text-lav-dd">Welcome Back</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                How would you like to continue?
              </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-3 pt-2">
              <button
                onClick={() => { setScreen("mobile"); setError(null); }}
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(74,48,128,0.08)] transition hover:shadow-[0_4px_20px_rgba(74,48,128,0.12)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lav-l text-lg">📱</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-ink">Sign in with OTP</div>
                  <div className="text-[11px] text-muted-foreground">Quick & secure — no password needed</div>
                </div>
                <span className="ml-auto text-lg text-lav-d">→</span>
              </button>

              <Link
                to="/child/register"
                className="flex w-full items-center gap-3 rounded-2xl bg-white p-4 shadow-[0_2px_16px_rgba(74,48,128,0.08)] transition hover:shadow-[0_4px_20px_rgba(74,48,128,0.12)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-yel-l text-lg">✨</span>
                <div className="text-left">
                  <div className="text-sm font-semibold text-ink">Create Account</div>
                  <div className="text-[11px] text-muted-foreground">New here? Set up in 2 minutes</div>
                </div>
                <span className="ml-auto text-lg text-lav-d">→</span>
              </Link>
            </div>
          </>
        )}

        {/* MOBILE NUMBER SCREEN */}
        {screen === "mobile" && (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-[0_2px_16px_rgba(74,48,128,0.12)]">
                📱
              </div>
              <h2 className="font-display text-3xl text-lav-dd">Enter Mobile Number</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                We'll send a 6-digit one-time password to verify it's you.
              </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-lav-d">+91</span>
                <input
                  className="w-full rounded-2xl border-[1.5px] border-lav-l bg-white py-4 pl-12 pr-4 text-lg font-medium tracking-widest text-ink outline-none transition focus:border-lav-d"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  autoFocus
                />
              </div>
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                onClick={sendOtp}
                className="w-full rounded-2xl bg-lav-d py-4 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                Send OTP →
              </button>
            </div>
          </>
        )}

        {/* OTP SCREEN */}
        {screen === "otp" && (
          <>
            <div className="flex flex-col items-center gap-2 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-[0_2px_16px_rgba(74,48,128,0.12)]">
                🔐
              </div>
              <h2 className="font-display text-3xl text-lav-dd">Verify OTP</h2>
              <p className="max-w-xs text-sm text-muted-foreground">
                Enter the {otp.length}-digit code sent to <span className="font-semibold text-ink">+91 {mobile}</span>
              </p>
            </div>

            <div className="flex w-full max-w-sm flex-col gap-4">
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="h-14 w-12 rounded-2xl border-[1.5px] border-lav-l bg-white text-center text-2xl font-bold text-ink outline-none transition focus:border-lav-d focus:shadow-[0_0_0_3px_rgba(107,70,193,0.15)]"
                  />
                ))}
              </div>
              {error && <p className="text-center text-xs text-red-600">{error}</p>}

              <button
                onClick={verifyOtp}
                className="w-full rounded-2xl bg-lav-d py-4 text-sm font-semibold text-white shadow-md transition hover:opacity-95"
              >
                Verify & Login →
              </button>

              <div className="flex flex-col items-center gap-1 pt-1">
                {timer > 0 ? (
                  <span className="text-[11px] text-muted-foreground">
                    Resend OTP in <span className="font-semibold text-lav-d">00:{timer.toString().padStart(2, "0")}</span>
                  </span>
                ) : (
                  <button
                    onClick={resendOtp}
                    className="text-xs font-semibold text-lav-d underline-offset-2 hover:underline"
                  >
                    Resend OTP
                  </button>
                )}
                <button
                  onClick={() => {
                    setScreen("mobile");
                    setOtpSent(false);
                    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
                    const len = isLoggedOut ? 4 : 6;
                    setOtp(Array(len).fill(""));
                    setError(null);
                  }}
                  className="text-[11px] text-muted-foreground underline-offset-2 hover:underline"
                >
                  Change mobile number
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

