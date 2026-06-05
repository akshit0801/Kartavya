import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/elder/auth")({
  head: () => ({
    meta: [
      { title: "Elder Sign In — Kartavya" },
      { name: "description", content: "Elder sign in with OTP for Kartavya simple mode." },
    ],
  }),
  component: ElderAuth,
});

type Screen = "mobile" | "otp";

function ElderAuth() {
  const navigate = useNavigate();
  const [screen, setScreen] = useState<Screen>("mobile");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem("kartavya_session");
    if (session === "elder") {
      navigate({ to: "/elder/dashboard" });
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

  const sendOtp = () => {
    setError(null);
    if (mobile.length < 10) {
      setError("Please enter a valid 10-digit mobile number");
      return;
    }
    setTimer(30);
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    setOtp(Array(len).fill(""));
    setScreen("otp");
    setTimeout(() => otpRefs.current[0]?.focus(), 100);
  };

  const verifyOtp = () => {
    setError(null);
    const isLoggedOut = localStorage.getItem("kartavya_logged_out") === "true";
    const len = isLoggedOut ? 4 : 6;
    if (otp.join("").length < len) {
      setError(`Enter the ${len}-digit code`);
      return;
    }
    localStorage.removeItem("kartavya_logged_out");
    localStorage.setItem("kartavya_session", "elder");
    navigate({ to: "/elder/dashboard" });
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
    if (idx === len - 1 && digit) {
      const code = [...next.slice(0, len - 1), digit].join("");
      if (code.length === len) {
        setTimeout(() => {
          localStorage.removeItem("kartavya_logged_out");
          localStorage.setItem("kartavya_session", "elder");
          navigate({ to: "/elder/dashboard" });
        }, 200);
      }
    }
  };

  const handleOtpKeyDown = (idx: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      otpRefs.current[idx - 1]?.focus();
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col font-sans text-white pb-10"
      style={{ backgroundColor: "#1A0F35" }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
        <button
          onClick={() => {
            if (screen === "otp") setScreen("mobile");
            else navigate({ to: "/" });
          }}
          className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition flex items-center gap-1"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="text-sm font-semibold pr-1">Back</span>
        </button>
        <span className="font-display text-lg font-bold text-[#FFE066]">Ramesh Ji Login</span>
        <span className="w-12" />
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-10 max-w-md mx-auto w-full">
        {screen === "mobile" && (
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🙏</div>
              <h2 className="font-display text-3xl font-bold text-[#FFE066]">नमस्ते / Welcome</h2>
              <p className="text-sm text-white/70 max-w-xs mx-auto">
                Enter your mobile number to sign in. we will send a 6-digit code.
              </p>
            </div>

            <div className="space-y-4">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-[#FFE066]">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  placeholder="98765 43210"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ""))}
                  className="w-full rounded-2xl border-2 border-white/20 bg-white/5 py-4 pl-14 pr-4 text-xl font-bold tracking-widest text-[#FFE066] outline-none transition focus:border-[#FFE066]"
                  autoFocus
                />
              </div>

              {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

              <button
                onClick={sendOtp}
                className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-base py-4 shadow hover:opacity-90 transition active:scale-[0.99]"
              >
                Send Code / कोड भेजें →
              </button>
            </div>

            <div className="bg-white/5 border border-white/10 p-4 rounded-2xl space-y-1 text-xs text-white/70 text-center">
              <span className="font-bold text-[#FFE066]">Elder Friendly Mode:</span>
              <p className="mt-0.5">Big fonts, simple prompts, and easy access without passwords.</p>
            </div>
          </div>
        )}

        {screen === "otp" && (
          <div className="w-full space-y-6">
            <div className="text-center space-y-2">
              <div className="text-4xl">🔐</div>
              <h2 className="font-display text-3xl font-bold text-[#FFE066]">Verify Code</h2>
              <p className="text-sm text-white/70">
                Enter the 6 digits sent to <span className="font-bold text-[#FFE066]">+91 {mobile}</span>
              </p>
            </div>

            <div className="space-y-5">
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
                    className="h-14 w-12 rounded-2xl border-2 border-white/20 bg-white/5 text-center text-2xl font-bold text-[#FFE066] outline-none transition focus:border-[#FFE066]"
                  />
                ))}
              </div>

              {error && <p className="text-xs text-rose-400 font-semibold text-center">{error}</p>}

              <button
                onClick={verifyOtp}
                className="w-full rounded-2xl bg-[#FFE066] text-ink font-bold text-base py-4 shadow hover:opacity-90 transition active:scale-[0.99]"
              >
                Verify & Sign In / आगे बढ़ें →
              </button>

              <div className="flex flex-col items-center gap-2 pt-2 text-xs text-white/60">
                {timer > 0 ? (
                  <span>Resend available in <span className="font-bold text-[#FFE066]">00:{timer.toString().padStart(2, "0")}</span></span>
                ) : (
                  <button onClick={sendOtp} className="text-[#FFE066] underline font-bold">Resend Code</button>
                )}
                <button onClick={() => setScreen("mobile")} className="text-white/40 underline text-[11px]">
                  Change mobile number
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
