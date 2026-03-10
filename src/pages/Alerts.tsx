import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { Bell, AlertTriangle, Clock, Shield, CheckCircle, Trash2, ArrowRight } from "lucide-react";
import { getItems, removeItem, type InventoryItem } from "@/lib/inventory-store";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysUntil = (dateStr: string) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
};

const categoryEmoji: Record<string, string> = {
  "Vegetables":      "🥦",
  "Fruits":          "🍎",
  "Dairy":           "🥛",
  "Pulses & Grains": "🌾",
  "Spices":          "🌶️",
  "Medicine":        "💊",
  "Electronics":     "🔌",
  "Appliances":      "🏠",
  "Personal Care":   "✨",
};

const urgency = (a: { type: string; daysLeft: number }) => {
  if (a.type === "expired")  return { color: "#b91c1c", bg: "#fee2e2", border: "rgba(185,28,28,0.15)", label: `${Math.abs(a.daysLeft)}d ago`, dot: "#b91c1c" };
  if (a.daysLeft <= 2)       return { color: "#b91c1c", bg: "#fee2e2", border: "rgba(185,28,28,0.15)", label: `${a.daysLeft}d left`,          dot: "#b91c1c" };
  return                            { color: "#d97706", bg: "#fef3c7", border: "rgba(217,119,6,0.15)",  label: `${a.daysLeft}d left`,          dot: "#d97706" };
};

const getReason = (daysLeft: number) => {
  if (daysLeft < 0)   return `Expired ${Math.abs(daysLeft)} day${Math.abs(daysLeft) !== 1 ? "s" : ""} ago`;
  if (daysLeft === 0) return "Expires today!";
  if (daysLeft === 1) return "Expires tomorrow";
  return `Expires in ${daysLeft} days`;
};

const TypeIcon = ({ type }: { type: string }) => {
  if (type === "expired") return <AlertTriangle size={13} color="#b91c1c" />;
  return <Clock size={13} color="#d97706" />;
};

// ─── Component ────────────────────────────────────────────────────────────────

const Alerts = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  const allAlerts = items
    .filter(i => i.expiryDate)
    .map(i => {
      const daysLeft = daysUntil(i.expiryDate) ?? 0;
      return {
        id: i.id,
        name: i.name,
        category: i.category,
        daysLeft,
        type: daysLeft < 0 ? "expired" : "expiring",
        icon: categoryEmoji[i.category] ?? "📦",
        reason: getReason(daysLeft),
      };
    })
    .filter(a => a.daysLeft <= 7)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const tabs = [
    { label: "All",                value: "all",      count: allAlerts.length },
    { label: "Expired",            value: "expired",  count: allAlerts.filter(a => a.type === "expired").length },
    { label: "Expiring This Week", value: "expiring", count: allAlerts.filter(a => a.type === "expiring").length },
  ];

  const filtered = (activeTab === "all" ? allAlerts : allAlerts.filter(a => a.type === activeTab))
    .filter(a => !dismissed.includes(a.id));

  const expiredCount  = filtered.filter(a => a.type === "expired").length;
  const expiringCount = filtered.filter(a => a.type === "expiring").length;

  const handleDelete = async (id: string) => {
    await removeItem(id);
    const updated = await getItems();
    setItems(updated);
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bell size={16} color="#b91c1c" />
            </div>
            <div>
              <h1 style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>Alerts</h1>
              <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>{filtered.length} items need attention</p>
            </div>
          </div>
          {dismissed.length > 0 && (
            <button onClick={() => setDismissed([])} style={{ fontSize: "0.75rem", color: "#1a5e6b", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}>
              Restore all ({dismissed.length})
            </button>
          )}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
          {[
            { label: "Expired",        count: expiredCount,  color: "#b91c1c", bg: "#fee2e2", icon: AlertTriangle },
            { label: "Expiring soon",  count: expiringCount, color: "#d97706", bg: "#fef3c7", icon: Clock         },
            { label: "Warranty alerts",count: 0,             color: "#1a5e6b", bg: "#d0e8ec", icon: Shield        },
          ].map(s => (
            <div key={s.label} style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <s.icon size={15} color={s.color} />
              </div>
              <div>
                <p style={{ fontFamily: "serif", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, color: s.color }}>{s.count}</p>
                <p style={{ fontSize: "0.68rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {tabs.map(tab => {
            const active = activeTab === tab.value;
            return (
              <button
                key={tab.value}
                onClick={() => setActiveTab(tab.value)}
                style={{
                  padding: "7px 14px", borderRadius: 99, fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                  border: active ? "1.5px solid #1a5e6b" : "1.5px solid rgba(15,26,28,0.1)",
                  background: active ? "#1a5e6b" : "white",
                  color: active ? "white" : "rgba(15,26,28,0.5)",
                  display: "flex", alignItems: "center", gap: 6, transition: "all 0.15s",
                }}
              >
                {tab.label}
                <span style={{ fontSize: "0.65rem", fontWeight: 700, background: active ? "rgba(255,255,255,0.2)" : "rgba(15,26,28,0.08)", color: active ? "white" : "rgba(15,26,28,0.4)", borderRadius: 99, padding: "1px 6px" }}>
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, padding: "48px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>✅</div>
            <p style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: 6 }}>All clear!</p>
            <p style={{ fontSize: "0.8rem", color: "rgba(15,26,28,0.4)" }}>No alerts in this category.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {filtered.map((alert) => {
              const u = urgency(alert);
              return (
                <div
                  key={alert.id}
                  style={{
                    background: "white", border: `1.5px solid ${u.border}`, borderRadius: 16,
                    padding: "14px 18px", display: "flex", alignItems: "center", gap: 14,
                    cursor: "pointer", transition: "box-shadow 0.15s, transform 0.15s",
                    position: "relative", overflow: "hidden",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,26,28,0.08)"; e.currentTarget.style.transform = "translateX(3px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
                >
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: u.dot, borderRadius: "16px 0 0 16px" }} />
                  <span style={{ fontSize: "1.6rem", lineHeight: 1, marginLeft: 4 }}>{alert.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                      <p style={{ fontWeight: 600, fontSize: "0.9rem" }}>{alert.name}</p>
                      <span style={{ fontSize: "0.65rem", fontWeight: 600, background: "rgba(15,26,28,0.06)", color: "rgba(15,26,28,0.4)", borderRadius: 99, padding: "2px 7px" }}>
                        {alert.category}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "rgba(15,26,28,0.45)" }}>{alert.reason}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, background: u.bg, borderRadius: 99, padding: "4px 10px" }}>
                      <TypeIcon type={alert.type} />
                      <span style={{ fontSize: "0.75rem", fontWeight: 700, color: u.color }}>{u.label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 4 }}>
                      <button
                        title="Dismiss"
                        onClick={e => { e.stopPropagation(); setDismissed(prev => [...prev, alert.id]); }}
                        style={{ width: 28, height: 28, borderRadius: 8, background: "#dcfce7", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "opacity 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        <CheckCircle size={13} color="#166534" />
                      </button>
                      <button
                        title="Delete item"
                        onClick={e => { e.stopPropagation(); handleDelete(alert.id); }}
                        style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "opacity 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        <Trash2 size={13} color="#b91c1c" />
                      </button>
                      <button
                        title="View item"
                        style={{ width: 28, height: 28, borderRadius: 8, background: "#d0e8ec", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", transition: "opacity 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        <ArrowRight size={13} color="#1a5e6b" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Alerts;