import { useState } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Settings as SettingsIcon, User, Bell, Shield, Palette, Trash2, ChevronRight, Check } from "lucide-react";
import { getSession, clearSession } from "@/pages/Auth";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

// ─── Data ─────────────────────────────────────────────────────────────────────

const alertOptions = [
  { id: "expiry_7", label: "7 days before expiry",   defaultOn: true  },
  { id: "expiry_3", label: "3 days before expiry",   defaultOn: true  },
  { id: "expiry_1", label: "1 day before expiry",    defaultOn: true  },
  { id: "warranty", label: "Warranty reminders",     defaultOn: true  },
  { id: "weekly",   label: "Weekly summary report",  defaultOn: false },
];

const themeOptions = [
  { id: "system", label: "System default" },
  { id: "light",  label: "Light"          },
  { id: "dark",   label: "Dark"           },
];

// ─── Toggle component ─────────────────────────────────────────────────────────

const Toggle = ({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) => (
  <div
    onClick={() => onChange(!on)}
    style={{
      width: 44, height: 24, borderRadius: 99,
      background: on ? "#1a5e6b" : "rgba(15,26,28,0.15)",
      position: "relative", cursor: "pointer",
      transition: "background 0.2s", flexShrink: 0,
    }}
  >
    <div style={{
      position: "absolute", top: 3, left: on ? 23 : 3,
      width: 18, height: 18, borderRadius: "50%", background: "white",
      transition: "left 0.2s",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    }} />
  </div>
);

// ─── Section wrapper ──────────────────────────────────────────────────────────

const Section = ({ title, icon: Icon, children }: {
  title: string; icon: React.ElementType; children: React.ReactNode;
}) => (
  <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, overflow: "hidden" }}>
    <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(15,26,28,0.06)", display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ width: 30, height: 30, borderRadius: 9, background: "#d0e8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Icon size={14} color="#1a5e6b" />
      </div>
      <h2 style={{ fontFamily: "serif", fontSize: "1rem", fontWeight: 600 }}>{title}</h2>
    </div>
    <div style={{ padding: "6px 0" }}>{children}</div>
  </div>
);

const Row = ({ label, sub, right, danger = false }: {
  label: string; sub?: string; right: React.ReactNode; danger?: boolean;
}) => (
  <div style={{
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "13px 22px",
    borderBottom: "1px solid rgba(15,26,28,0.04)",
  }}>
    <div>
      <p style={{ fontSize: "0.875rem", fontWeight: 500, color: danger ? "#b91c1c" : "#0f1a1c" }}>{label}</p>
      {sub && <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>{sub}</p>}
    </div>
    {right}
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const Settings = () => {
  const session = getSession();
  const navigate = useNavigate();
  const userName  = session?.user?.name  ?? "User";
  const userEmail = session?.user?.email ?? "user@email.com";
  const initials  = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);

  const [alerts, setAlerts] = useState<Record<string, boolean>>(
    Object.fromEntries(alertOptions.map(a => [a.id, a.defaultOn]))
  );
  const [theme, setTheme] = useState("system");
  const [name,  setName]  = useState(userName);
  const [saved, setSaved] = useState(false);

  const toggleAlert = (id: string) =>
    setAlerts(prev => ({ ...prev, [id]: !prev[id] }));

  const handleSaveProfile = () => {
    setSaved(true);
    toast({ title: "Profile updated" });
    setTimeout(() => setSaved(false), 2000);
  };

  const handleDeleteData = () => {
    if (confirm("This will delete all your inventory data. Are you sure?")) {
      localStorage.clear();
      toast({ title: "All data cleared" });
    }
  };

  const handleLogout = () => {
    clearSession();
    navigate("/auth");
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 14 }}>

        {/* ── Header ────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d0e8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <SettingsIcon size={17} color="#1a5e6b" />
          </div>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>Settings</h1>
            <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>Manage your account and preferences</p>
          </div>
        </div>

        {/* ── Profile card ──────────────────────────────────────────── */}
        <div style={{ background: "linear-gradient(135deg, #0f3840, #1a5e6b)", borderRadius: 18, padding: "22px 24px", display: "flex", alignItems: "center", gap: 16, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "20px 20px", pointerEvents: "none" }} />
          <div style={{ width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #2a7a62, #7ecdd8)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: "1.1rem", fontWeight: 700, color: "white", zIndex: 1 }}>
            {initials}
          </div>
          <div style={{ zIndex: 1 }}>
            <p style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 700, color: "white", lineHeight: 1 }}>{userName}</p>
            <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.5)", marginTop: 4 }}>{userEmail}</p>
          </div>
          <div style={{ marginLeft: "auto", zIndex: 1 }}>
            <div style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 99, padding: "4px 12px" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "rgba(255,255,255,0.7)" }}>Free plan</span>
            </div>
          </div>
        </div>

        {/* ── Profile settings ──────────────────────────────────────── */}
        <Section title="Profile" icon={User}>
          <div style={{ padding: "14px 22px 6px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", display: "block", marginBottom: 5 }}>Display Name</label>
                <input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{ width: "100%", height: 38, borderRadius: 9, border: "1.5px solid rgba(15,26,28,0.12)", padding: "0 11px", fontSize: "0.875rem", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                  onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                />
              </div>
              <div>
                <label style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", display: "block", marginBottom: 5 }}>Email</label>
                <input
                  value={userEmail}
                  disabled
                  style={{ width: "100%", height: 38, borderRadius: 9, border: "1.5px solid rgba(15,26,28,0.07)", padding: "0 11px", fontSize: "0.875rem", background: "rgba(15,26,28,0.03)", color: "rgba(15,26,28,0.35)", boxSizing: "border-box" }}
                />
              </div>
            </div>
            <button
              onClick={handleSaveProfile}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "8px 16px", borderRadius: 9,
                background: saved ? "#dcfce7" : "#1a5e6b",
                color: saved ? "#166534" : "white",
                border: "none", cursor: "pointer", fontSize: "0.8rem", fontWeight: 600,
                transition: "all 0.2s", marginBottom: 8,
              }}
            >
              {saved ? <><Check size={13} /> Saved!</> : "Save changes"}
            </button>
          </div>
        </Section>

        {/* ── Notifications ─────────────────────────────────────────── */}
        <Section title="Notifications" icon={Bell}>
          {alertOptions.map(a => (
            <Row
              key={a.id}
              label={a.label}
              right={<Toggle on={alerts[a.id]} onChange={() => toggleAlert(a.id)} />}
            />
          ))}
        </Section>

        {/* ── Appearance ────────────────────────────────────────────── */}
        <Section title="Appearance" icon={Palette}>
          <div style={{ padding: "12px 22px" }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", marginBottom: 10 }}>Theme</p>
            <div style={{ display: "flex", gap: 8 }}>
              {themeOptions.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  style={{
                    flex: 1, padding: "9px 12px", borderRadius: 10, cursor: "pointer",
                    border: `1.5px solid ${theme === t.id ? "#1a5e6b" : "rgba(15,26,28,0.1)"}`,
                    background: theme === t.id ? "#d0e8ec" : "transparent",
                    fontSize: "0.8rem", fontWeight: 600,
                    color: theme === t.id ? "#1a5e6b" : "rgba(15,26,28,0.5)",
                    transition: "all 0.15s",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* ── Privacy & Data ────────────────────────────────────────── */}
        <Section title="Privacy & Data" icon={Shield}>
          <Row
            label="Export my data"
            sub="Download all your inventory as CSV"
            right={
              <button
                onClick={() => toast({ title: "Export started — check your downloads" })}
                style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.78rem", fontWeight: 600, color: "#1a5e6b", background: "none", border: "none", cursor: "pointer" }}
              >
                Export <ChevronRight size={13} />
              </button>
            }
          />
          <Row
            label="Clear all inventory data"
            sub="Permanently removes all items — cannot be undone"
            danger
            right={
              <button
                onClick={handleDeleteData}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "#fee2e2", border: "none", cursor: "pointer", fontSize: "0.75rem", fontWeight: 600, color: "#b91c1c" }}
              >
                <Trash2 size={12} /> Clear
              </button>
            }
          />
        </Section>

        {/* ── Sign out ──────────────────────────────────────────────── */}
        <button
          onClick={handleLogout}
          style={{
            width: "100%", padding: "13px", borderRadius: 14,
            border: "1.5px solid rgba(185,28,28,0.2)",
            background: "#fff5f5", color: "#b91c1c",
            fontSize: "0.875rem", fontWeight: 600, cursor: "pointer",
            transition: "background 0.15s",
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "#fee2e2")}
          onMouseLeave={e => (e.currentTarget.style.background = "#fff5f5")}
        >
          Sign out
        </button>

      </div>
    </AppLayout>
  );
};

export default Settings;