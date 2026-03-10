import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, LogIn, Package, Clock, TrendingDown, Plus, BarChart3, Bell } from "lucide-react";
import ShelfSafeLogo from "@/components/ShelfSafeLogo";
import heroFood1 from "@/assets/hero-food-1.jpg";
import heroFood2 from "@/assets/hero-food-2.jpg";
import heroFood3 from "@/assets/hero-food-3.jpg";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: Package,
    title: "Smart Inventory",
    description: "One place for every item in your home. Know exactly what you have, where it is, and when you bought it.",
    img: heroFood1,
    stat: "128 items",
    statLabel: "tracked on average",
  },
  {
    icon: Clock,
    title: "Expiry Awareness",
    description: "Colour-coded freshness at a glance. Get alerts 7, 3, and 1 day before anything expires.",
    img: heroFood2,
    stat: "Zero",
    statLabel: "surprise expirations",
  },
  {
    icon: TrendingDown,
    title: "Waste Reduction",
    description: "See exactly where your household waste comes from and cut it month over month.",
    img: heroFood3,
    stat: "42%",
    statLabel: "less waste reported",
  },
];

const steps = [
  { num: "01", icon: Plus,      title: "Add Items",       description: "Log any item in seconds — food, medicine, electronics. Set location and expiry date." },
  { num: "02", icon: BarChart3, title: "Track Freshness", description: "A live dashboard shows everything colour-coded. Your home's health score, always visible." },
  { num: "03", icon: Bell,      title: "Get Reminders",   description: "Push, email, and in-app alerts before items expire. Never be caught off guard." },
];

const stats = [
  { value: "50k+",   label: "Homes organized" },
  { value: "₹2,400", label: "Avg. monthly savings" },
  { value: "42%",    label: "Less food waste" },
  { value: "3 hrs",  label: "Saved per week" },
];

// ─── Component ────────────────────────────────────────────────────────────────

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">

      {/* ── Navbar ──────────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4"
        style={{
          background: "rgba(15,56,64,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <ShelfSafeLogo size={34} variant="dark" />

        <div className="flex items-center gap-3">
          <Button
            variant="hero-outline"
            size="sm"
            onClick={() => navigate("/auth")}
            className="gap-2"
          >
            <LogIn className="w-4 h-4" /> Sign In
          </Button>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ background: "linear-gradient(160deg, #0f3840 0%, #1a5e6b 45%, #2a7a62 100%)" }}
      >
        {/* Dot grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.055) 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        {/* Soft glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] pointer-events-none" style={{
          background: "radial-gradient(ellipse at center, rgba(94,200,160,0.12) 0%, transparent 70%)",
        }} />

        {/* Food images — symmetric 2x2 grid flanking the hero text */}

        {/* Left-top */}
        <div className="absolute hidden lg:block" style={{
          top: "72px", left: "2%",
          width: 230, height: 165,
          borderRadius: 16, overflow: "hidden",
          transform: "rotate(-2deg)",
          boxShadow: "0 8px 24px rgba(15,56,64,0.35)",
          border: "2px solid rgba(255,255,255,0.18)",
        }}>
          <img src={heroFood1} alt="Fresh vegetables" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(26,94,107,0.12)" }} />
        </div>

        {/* Left-bottom */}
        <div className="absolute hidden lg:block" style={{
          bottom: "12%", left: "2%",
          width: 230, height: 165,
          borderRadius: 16, overflow: "hidden",
          transform: "rotate(2deg)",
          boxShadow: "0 8px 24px rgba(15,56,64,0.35)",
          border: "2px solid rgba(255,255,255,0.18)",
        }}>
          <img
            src="https://static.vecteezy.com/system/resources/previews/038/972/450/large_2x/ai-generated-indian-platter-thali-indian-food-set-photo.jpg"
            alt="Indian thali"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(15,56,64,0.12)" }} />
        </div>

        {/* Right-top */}
        <div className="absolute hidden lg:block" style={{
          top: "72px", right: "2%",
          width: 230, height: 165,
          borderRadius: 16, overflow: "hidden",
          transform: "rotate(2deg)",
          boxShadow: "0 8px 24px rgba(15,56,64,0.35)",
          border: "2px solid rgba(255,255,255,0.18)",
        }}>
          <img src={heroFood2} alt="Organized pantry" className="w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "rgba(26,94,107,0.12)" }} />
        </div>

        {/* Right-bottom */}
        <div className="absolute hidden lg:block" style={{
          bottom: "12%", right: "2%",
          width: 230, height: 165,
          borderRadius: 16, overflow: "hidden",
          transform: "rotate(-2deg)",
          boxShadow: "0 8px 24px rgba(15,56,64,0.35)",
          border: "2px solid rgba(255,255,255,0.18)",
        }}>
          <img
            src="https://img.freepik.com/premium-photo/wide-shot-traditional-indian-kitchen_167857-54682.jpg"
            alt="Indian kitchen"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "rgba(15,56,64,0.12)" }} />
        </div>

        {/* Hero text */}
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto" style={{ paddingTop: "80px" }}>
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 mb-7" style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 9999,
            padding: "6px 16px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}>
            <span style={{ color: "#7ecdd8" }}>✦</span> Home inventory, reinvented
          </div>

          <h1
            className="font-display font-bold mb-6"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "white",
            }}
          >
            Your Home,<br />
            <em style={{ fontStyle: "italic", color: "#7ecdd8" }}>Intelligently</em>{" "}
            Organized
          </h1>

          <p
            className="font-body mb-10"
            style={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "rgba(255,255,255,0.6)",
              maxWidth: 480,
              margin: "0 auto 2.5rem",
            }}
          >
            Track everything in your home — from pantry items to appliances — without the chaos.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Start Organizing <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="hero-outline"
              size="xl"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              See How It Works
            </Button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-3 mt-10 mb-16">
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              borderRadius: 9999,
              padding: "8px 18px 8px 10px",
              backdropFilter: "blur(8px)",
            }}>
              <div className="flex">
                {["RK","PS","AM","JD"].map((initials, i) => (
                  <div key={initials} style={{
                    width: 28, height: 28,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a5e6b, #2a7a62)",
                    border: "2px solid rgba(15,56,64,0.8)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 8, fontWeight: 700, color: "white",
                    marginLeft: i === 0 ? 0 : -7,
                    zIndex: 4 - i,
                    position: "relative",
                  }}>{initials}</div>
                ))}
              </div>
              <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.85)", whiteSpace: "nowrap" }}>
                <strong style={{ color: "white" }}>4,200+ families</strong> organized this month
              </p>
            </div>
          </div>
        </div>

        {/* Wave bottom edge */}
        <div className="absolute bottom-0 left-0 right-0" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 80" preserveAspectRatio="none" style={{ width: "100%", height: 80, display: "block" }}>
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="#f4f0e8" />
          </svg>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────────────── */}
      <section className="py-14 px-6" style={{ background: "var(--background, #f4f0e8)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s) => (
            <div key={s.label}>
              <div
                className="font-display font-bold mb-1"
                style={{ fontSize: "2rem", color: "#1a5e6b", letterSpacing: "-0.03em" }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: "0.8rem", color: "rgba(15,26,28,0.5)", fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section className="py-14 px-6" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div style={{
              display: "inline-block",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#1a5e6b",
              background: "#d0e8ec", borderRadius: 9999,
              padding: "4px 14px", marginBottom: 16,
            }}>Features</div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", lineHeight: 1.15 }}
            >
              Built around how your<br />home actually works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl overflow-hidden border transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "white",
                  borderColor: "rgba(15,26,28,0.08)",
                  boxShadow: "0 2px 8px rgba(15,26,28,0.06)",
                }}
                onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 12px 32px rgba(15,26,28,0.12)")}
                onMouseLeave={e => (e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,26,28,0.06)")}
              >
                {/* Image — full width, fixed height, no icon overlap */}
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={f.img}
                    alt={f.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Teal tint on hover */}
                  <div
                    className="absolute inset-0 transition-opacity duration-300"
                    style={{ background: "rgba(26,94,107,0.15)", opacity: 0 }}
                    onMouseEnter={e => (e.currentTarget.style.opacity = "1")}
                  />
                  {/* Stat badge on top of image */}
                  <div className="absolute bottom-3 right-3" style={{
                    background: "rgba(15,56,64,0.85)",
                    backdropFilter: "blur(8px)",
                    borderRadius: 10,
                    padding: "6px 12px",
                    color: "white",
                  }}>
                    <span style={{ fontSize: "0.9rem", fontWeight: 700, fontFamily: "serif" }}>{f.stat}</span>
                    <span style={{ fontSize: "0.65rem", opacity: 0.6, marginLeft: 5 }}>{f.statLabel}</span>
                  </div>
                </div>

                {/* Text — icon is gone, text does the work */}
                <div className="p-6">
                  <div className="flex items-center gap-2.5 mb-3">
                    <div style={{
                      width: 34, height: 34, borderRadius: 8,
                      background: "#d0e8ec",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      <f.icon className="w-4 h-4" style={{ color: "#1a5e6b" }} />
                    </div>
                    <h3 className="font-display font-semibold" style={{ fontSize: "1.1rem" }}>{f.title}</h3>
                  </div>
                  <p className="font-body" style={{ fontSize: "0.875rem", color: "rgba(15,26,28,0.55)", lineHeight: 1.7 }}>
                    {f.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        className="py-14 px-6"
        style={{ background: "linear-gradient(160deg, #0f3840 0%, #1a5e6b 60%, #2a7a62 100%)" }}
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div style={{
              display: "inline-block",
              fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#7ecdd8",
              background: "rgba(126,205,216,0.12)", borderRadius: 9999,
              padding: "4px 14px", marginBottom: 16,
            }}>How it works</div>
            <h2
              className="font-display font-bold"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.5rem)", letterSpacing: "-0.025em", color: "white", lineHeight: 1.15 }}
            >
              Three steps to a<br />
              <em style={{ fontStyle: "italic", color: "#7ecdd8" }}>stress-free home.</em>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Connector line on desktop */}
            <div className="hidden md:block absolute top-10 left-[20%] right-[20%] h-px" style={{
              background: "repeating-linear-gradient(90deg, rgba(255,255,255,0.15) 0, rgba(255,255,255,0.15) 6px, transparent 6px, transparent 14px)"
            }} />

            {steps.map((s) => (
              <div key={s.num} className="text-center relative">
                {/* Number circle */}
                <div
                  className="mx-auto mb-5 flex items-center justify-center font-display font-bold"
                  style={{
                    width: 52, height: 52, borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.2)",
                    color: "white",
                    fontSize: "1.25rem",
                    background: "rgba(255,255,255,0.05)",
                  }}
                >
                  {s.num}
                </div>
                {/* Icon */}
                <div className="mx-auto mb-4 flex items-center justify-center" style={{
                  width: 44, height: 44, borderRadius: 12,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.12)",
                }}>
                  <s.icon className="w-5 h-5" style={{ color: "#7ecdd8" }} />
                </div>
                <h3 className="font-display font-semibold mb-3" style={{ fontSize: "1.2rem", color: "white" }}>
                  {s.title}
                </h3>
                <p className="font-body" style={{ fontSize: "0.875rem", color: "rgba(255,255,255,0.5)", lineHeight: 1.7 }}>
                  {s.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "white" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div style={{
              display: "inline-block", fontSize: "0.72rem", fontWeight: 700,
              letterSpacing: "0.1em", textTransform: "uppercase", color: "#1a5e6b",
              background: "#d0e8ec", borderRadius: 9999, padding: "4px 14px", marginBottom: 14,
            }}>Loved by families</div>
            <h2 className="font-display font-bold" style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", letterSpacing: "-0.025em" }}>
              Real homes. Real results.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: "Priya S.", city: "Bangalore", initials: "PS", text: "ShelfSafe saved us ₹3,000 last month just by reminding us what was expiring. I stopped throwing out vegetables every week.", stars: 5 },
              { name: "Rahul M.", city: "Mumbai",    initials: "RM", text: "The freshness score is genius. My family actually competes to keep it above 80%. We waste almost nothing now.", stars: 5 },
              { name: "Anita K.", city: "Delhi",     initials: "AK", text: "Adding items takes 10 seconds. The expiry alerts mean I never open the fridge to find something already gone bad.", stars: 5 },
            ].map(t => (
              <div key={t.name} style={{
                background: "#f9fafb",
                border: "1px solid rgba(15,26,28,0.07)",
                borderRadius: 18,
                padding: "22px 24px",
              }}>
                {/* Stars */}
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>
                  {[...Array(t.stars)].map((_, i) => (
                    <span key={i} style={{ color: "#f59e0b", fontSize: "0.85rem" }}>★</span>
                  ))}
                </div>
                <p style={{ fontSize: "0.875rem", color: "rgba(15,26,28,0.65)", lineHeight: 1.7, marginBottom: 16, fontStyle: "italic" }}>
                  "{t.text}"
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: "linear-gradient(135deg, #1a5e6b, #2a7a62)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.7rem", fontWeight: 700, color: "white",
                  }}>{t.initials}</div>
                  <div>
                    <p style={{ fontSize: "0.82rem", fontWeight: 700 }}>{t.name}</p>
                    <p style={{ fontSize: "0.7rem", color: "rgba(15,26,28,0.4)" }}>{t.city}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ background: "var(--background, #f4f0e8)" }}>
        <div
          className="max-w-3xl mx-auto text-center rounded-3xl p-12 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #0f3840, #1a5e6b)",
            boxShadow: "0 32px 64px rgba(15,56,64,0.25)",
          }}
        >
          {/* Dot texture inside the card */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }} />

          <div className="relative z-10">
            <h2
              className="font-display font-bold mb-4"
              style={{ fontSize: "clamp(1.75rem, 4vw, 2.75rem)", color: "white", letterSpacing: "-0.025em", lineHeight: 1.1 }}
            >
              Ready for an organized home?
            </h2>
            <p className="font-body mb-8" style={{ color: "rgba(255,255,255,0.55)", fontSize: "1rem", lineHeight: 1.7 }}>
              Join 50,000+ households that trust Shelf Safe to keep their homes running smoothly.
            </p>
            <Button variant="hero" size="xl" onClick={() => navigate("/auth")}>
              Get Started — Free <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <p style={{ marginTop: 14, fontSize: "0.78rem", color: "rgba(255,255,255,0.3)" }}>
              No credit card · 30-day free trial · Cancel anytime
            </p>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Landing;