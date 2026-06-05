import { createFileRoute } from "@tanstack/react-router";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kartavya — Care that connects generations" },
      { name: "description", content: "Kartavya helps families care for their elders — secured with OTP, ABHA linked." },
      { property: "og:title", content: "Kartavya" },
      { property: "og:description", content: "Care that connects generations." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  // Daily-usage shortcut: if the user is logged in as a child, go straight to dashboard.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const session = localStorage.getItem("kartavya_session");
    if (session === "child") {
      navigate({ to: "/child/dashboard" });
    }
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-12"
      style={{ background: "linear-gradient(160deg, var(--lav-l), #fff)" }}>
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <h1 className="font-display text-5xl text-lav-dd tracking-tight">
          Karta<em className="not-italic text-yel-d">vya</em>
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Care that connects generations.<br />Who are you today?
        </p>
        <div className="grid w-full grid-cols-2 gap-4 pt-2">
          <Link
            to="/child/auth"
            className="flex flex-col items-center gap-2 rounded-2xl p-5 text-white shadow-lg transition-transform hover:scale-[1.02]"
            style={{ background: "linear-gradient(145deg, var(--lav-dd), var(--lav-d))" }}
          >
            <span className="text-3xl">👨‍👧</span>
            <span className="text-sm font-semibold">Son / Daughter</span>
            <span className="text-[11px] opacity-80">Manage parents' health</span>
          </Link>
          <button
            type="button"
            disabled
            className="flex cursor-not-allowed flex-col items-center gap-2 rounded-2xl p-5 text-white shadow-lg opacity-90"
            style={{ background: "linear-gradient(145deg, #B8881A, var(--yel-d))" }}
            title="Coming soon"
          >
            <span className="text-3xl">🧓</span>
            <span className="text-sm font-semibold">I am the Elder</span>
            <span className="text-[11px] opacity-80">Large, simple experience</span>
          </button>
        </div>
        <p className="pt-2 text-[11px] text-muted-foreground">
          Secured with OTP · ABHA linked
        </p>
      </div>
    </div>
  );
}
