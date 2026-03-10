import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Eye, EyeOff, ArrowLeft, Loader2 } from "lucide-react";
import heroFood1 from "@/assets/hero-food-1.jpg";
import ShelfSafeLogo from "@/components/ShelfSafeLogo";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormState {
  name: string;
  email: string;
  password: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

// ─── Validation ───────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState, isSignUp: boolean): FormErrors {
  const errors: FormErrors = {};

  if (isSignUp && !form.name.trim()) {
    errors.name = "Name is required.";
  }

  if (!form.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_RE.test(form.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!form.password) {
    errors.password = "Password is required.";
  } else if (form.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  } else if (!/[A-Z]/.test(form.password) && isSignUp) {
    errors.password = "Include at least one uppercase letter.";
  }

  return errors;
}

// ─── Password strength ────────────────────────────────────────────────────────

function getPasswordStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pw.length >= 8) score++;
  if (pw.length >= 12) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;

  if (score <= 1) return { score, label: "Weak", color: "bg-red-500" };
  if (score <= 3) return { score, label: "Fair", color: "bg-amber-500" };
  return { score, label: "Strong", color: "bg-green-600" };
}

// ─── Real API calls ───────────────────────────────────────────────────────────

async function apiSignIn(email: string, password: string) {
  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Sign in failed");
  }
  return res.json();
}

async function apiSignUp(name: string, email: string, password: string) {
  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message ?? "Sign up failed");
  }
  return res.json();
}

// ─── Session helpers ──────────────────────────────────────────────────────────

function saveSession(token: string, user: { id: string; name: string; email: string }) {
  localStorage.setItem("shelfsafe-token", token);
  localStorage.setItem("shelfsafe-user", JSON.stringify(user));
}

export function getSession() {
  const token = localStorage.getItem("shelfsafe-token");
  const raw = localStorage.getItem("shelfsafe-user");
  if (!token || !raw) return null;
  try {
    return { token, user: JSON.parse(raw) };
  } catch {
    return null;
  }
}

export function clearSession() {
  localStorage.removeItem("shelfsafe-token");
  localStorage.removeItem("shelfsafe-user");
}

// ─── Component ────────────────────────────────────────────────────────────────

const Auth = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<FormState>({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  const strength = isSignUp ? getPasswordStrength(form.password) : null;

  const setField = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(form, isSignUp);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const result = isSignUp
        ? await apiSignUp(form.name.trim(), form.email.trim(), form.password)
        : await apiSignIn(form.email.trim(), form.password);

      saveSession(result.token, result.user);
      toast({ title: isSignUp ? `Welcome, ${result.user.name}!` : "Welcome back!" });
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsSignUp((v) => !v);
    setErrors({});
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left — styled food photo panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">

        <img
          src={heroFood1}
          alt="Fresh food"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "saturate(1.15) brightness(0.75)" }}
        />

        <div className="absolute inset-0" style={{
          background: "linear-gradient(160deg, rgba(15,56,64,0.55) 0%, rgba(26,94,107,0.45) 50%, rgba(45,138,110,0.35) 100%)"
        }} />

        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(10,30,30,0.65) 100%)"
        }} />

        <div className="absolute bottom-0 left-0 right-0 h-2/3" style={{
          background: "linear-gradient(to top, rgba(10,35,32,0.92) 0%, rgba(10,35,32,0.5) 50%, transparent 100%)"
        }} />

        {/* Floating stat cards */}
        <div className="absolute top-10 right-8"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "16px",
            padding: "14px 20px",
            color: "white",
          }}>
          <div style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1 }}>128</div>
          <div style={{ fontSize: "0.72rem", opacity: 0.6, marginTop: 3, letterSpacing: "0.04em", textTransform: "uppercase" }}>Items tracked</div>
        </div>

        <div className="absolute top-36 left-8"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "16px",
            padding: "14px 20px",
            color: "white",
          }}>
          <div style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1, color: "#86efac" }}>82%</div>
          <div style={{ fontSize: "0.72rem", opacity: 0.6, marginTop: 3, letterSpacing: "0.04em", textTransform: "uppercase" }}>Freshness score</div>
        </div>

        <div className="absolute top-60 right-12"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255,255,255,0.18)",
            borderRadius: "16px",
            padding: "14px 20px",
            color: "white",
          }}>
          <div style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, lineHeight: 1, color: "#fcd34d" }}>₹2,450</div>
          <div style={{ fontSize: "0.72rem", opacity: 0.6, marginTop: 3, letterSpacing: "0.04em", textTransform: "uppercase" }}>Saved this month</div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="flex items-center gap-3 mb-7">
            <ShelfSafeLogo size={36} variant="dark" />
            <h2 style={{
              fontFamily: "serif",
              fontSize: "2.1rem",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              marginBottom: "0.75rem",
              letterSpacing: "-0.02em",
            }}>
              Your Home,<br />Intelligently Organized
            </h2>
          </div>
          <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "0.95rem", lineHeight: 1.7 }}>
            Track everything — from pantry items<br />to appliances — without the chaos.
          </p>
          <div style={{
            marginTop: "1.75rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid rgba(255,255,255,0.12)",
          }}>
            <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.85rem", fontStyle: "italic", lineHeight: 1.65 }}>
              "Shelf Safe saved us ₹3,000 last month just by reminding us what was expiring."
            </p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.75rem", marginTop: "0.5rem" }}>
              — Priya S., Bangalore
            </p>
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          <button
            type="button"
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground font-body text-sm mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>

          <h1 className="text-3xl font-display font-bold mb-2">
            {isSignUp ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-muted-foreground font-body mb-8">
            {isSignUp ? "Start organizing your home today" : "Sign in to your ShelfSafe account"}
          </p>

          <form onSubmit={handleSubmit} noValidate className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label className="font-body">Full Name</Label>
                <Input
                  placeholder="Your name"
                  className={`rounded-xl h-12 ${errors.name ? "border-destructive" : ""}`}
                  value={form.name}
                  onChange={setField("name")}
                  autoComplete="name"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label className="font-body">Email</Label>
              <Input
                type="email"
                placeholder="you@example.com"
                className={`rounded-xl h-12 ${errors.email ? "border-destructive" : ""}`}
                value={form.email}
                onChange={setField("email")}
                autoComplete="email"
                disabled={loading}
              />
              {errors.email && (
                <p className="text-destructive text-xs mt-1">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label className="font-body">Password</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className={`rounded-xl h-12 pr-12 ${errors.password ? "border-destructive" : ""}`}
                  value={form.password}
                  onChange={setField("password")}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {isSignUp && form.password.length > 0 && strength && (
                <div className="space-y-1 pt-1">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                          i <= strength.score ? strength.color : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${
                    strength.score <= 1 ? "text-red-500"
                    : strength.score <= 3 ? "text-amber-500"
                    : "text-green-600"
                  }`}>
                    {strength.label}
                  </p>
                </div>
              )}

              {errors.password && (
                <p className="text-destructive text-xs mt-1">{errors.password}</p>
              )}
            </div>

            <Button
              type="submit"
              variant="accent"
              size="xl"
              className="w-full rounded-xl"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isSignUp ? "Creating account…" : "Signing in…"}
                </>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground font-body mt-6">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              onClick={switchMode}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Sign In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;