import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { useNavigate } from "react-router-dom";
import { ArrowRight, AlertTriangle, TrendingDown, Package, Clock } from "lucide-react";
import { getItems, type InventoryItem } from "@/lib/inventory-store";
import vegetablesImg from "@/assets/vegetables.jpg";
import fruitsImg from "@/assets/fruits.jpg";
import dairyImg from "@/assets/dairy.jpg";
import medicineImg from "@/assets/medicine.jpg";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysUntil = (dateStr: string) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
};

const urgencyStyle = (days: number) =>
  days <= 1
    ? { bg: "#fee2e2", text: "#b91c1c", bar: "#b91c1c" }
    : days <= 3
    ? { bg: "#fef3c7", text: "#d97706", bar: "#d97706" }
    : { bg: "#dcfce7", text: "#166534", bar: "#1a5e6b" };

const categoryImgMap: Record<string, string> = {
  "Vegetables": vegetablesImg,
  "Fruits": fruitsImg,
  "Dairy": dairyImg,
  "Medicine": medicineImg,
};

// ─── Component ────────────────────────────────────────────────────────────────

const Dashboard = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  // ── Real stats ──────────────────────────────────────────────────────────────
  const totalItems = items.length;
  const expiringSoon = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d !== null && d >= 0 && d <= 7;
  }).length;

  // Items added in last 7 days
  const recentlyAdded = items.filter(i => {
    const created = new Date(i.createdAt).getTime();
    return Date.now() - created < 7 * 86400000;
  }).length;

  const stats = [
    { label: "Total Items",   value: totalItems,      icon: Package,       color: "#1a5e6b", bg: "#d0e8ec" },
    { label: "Expiring Soon", value: expiringSoon,    icon: AlertTriangle, color: "#b91c1c", bg: "#fee2e2" },
    { label: "Added This Week",value: recentlyAdded,  icon: Clock,         color: "#d97706", bg: "#fef3c7" },
    { label: "Est. Savings",  value: "₹2,450",        icon: TrendingDown,  color: "#166534", bg: "#dcfce7" },
  ];

  // ── Needs attention: items expiring in ≤7 days ──────────────────────────────
  const attentionItems = items
    .filter(i => {
      const d = daysUntil(i.expiryDate);
      return d !== null && d >= 0 && d <= 7;
    })
    .sort((a, b) => (daysUntil(a.expiryDate) ?? 99) - (daysUntil(b.expiryDate) ?? 99))
    .slice(0, 4)
    .map(i => ({
      name: i.name,
      category: i.category,
      daysLeft: daysUntil(i.expiryDate) ?? 0,
      pct: Math.round(((daysUntil(i.expiryDate) ?? 0) / 7) * 100),
    }));

  // ── Category preview ────────────────────────────────────────────────────────
  const allCategories = ["Vegetables", "Fruits", "Dairy", "Medicine"];
  const categoryPreview = allCategories.map(name => {
    const catItems = items.filter(i => i.category === name);
    const freshCount = catItems.filter(i => {
      const d = daysUntil(i.expiryDate);
      return d === null || d > 7;
    }).length;
    const fresh = catItems.length > 0 ? Math.round((freshCount / catItems.length) * 100) : 100;
    return { name, count: catItems.length, img: categoryImgMap[name], fresh };
  });

  // ── Freshness score ─────────────────────────────────────────────────────────
  const freshItems = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d === null || d > 7;
  }).length;
  const freshnessScore = items.length > 0 ? Math.round((freshItems / items.length) * 100) : 100;
  const circumference = 2 * Math.PI * 42;

  const foodItems = items.filter(i => ["Vegetables","Fruits","Dairy","Pulses & Grains","Spices"].includes(i.category));
  const medItems  = items.filter(i => i.category === "Medicine");
  const otherItems = items.filter(i => !["Vegetables","Fruits","Dairy","Pulses & Grains","Spices","Medicine"].includes(i.category));

  const freshPct = (arr: InventoryItem[]) => {
    if (!arr.length) return 100;
    const f = arr.filter(i => { const d = daysUntil(i.expiryDate); return d === null || d > 7; }).length;
    return Math.round((f / arr.length) * 100);
  };

  const freshnessMessage = freshnessScore >= 80
    ? "Your home is in great shape!"
    : freshnessScore >= 60
    ? "A few items need attention."
    : "Several items expiring soon!";

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 20 }}>

        {/* ── Top row ───────────────────────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 220px", gap: 16 }}>

          {/* Welcome banner */}
          <div style={{
            borderRadius: 20,
            background: "linear-gradient(135deg, #0f3840 0%, #1a5e6b 60%, #2a7a62 100%)",
            padding: "28px 32px",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: 6 }}>
                Good morning
              </p>
              <h1 style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, color: "white", lineHeight: 1.2, marginBottom: 20, letterSpacing: "-0.02em" }}>
                Welcome back to your<br />organized home
              </h1>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</span>
                      <div style={{ width: 24, height: 24, borderRadius: 6, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <s.icon size={12} color={s.color} />
                      </div>
                    </div>
                    <p style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, color: "white", lineHeight: 1 }}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Freshness score */}
          <div style={{ borderRadius: 20, background: "white", border: "1px solid rgba(15,26,28,0.08)", padding: "20px 16px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,26,28,0.45)" }}>Freshness Score</p>
            <div style={{ position: "relative", width: 110, height: 110 }}>
              <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(15,26,28,0.07)" strokeWidth="9" />
                <circle cx="50" cy="50" r="42" fill="none" stroke="#1a5e6b" strokeWidth="9" strokeLinecap="round" strokeDasharray={`${(freshnessScore / 100) * circumference} ${circumference}`} />
              </svg>
              <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, color: "#1a5e6b", lineHeight: 1 }}>{freshnessScore}%</span>
                <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>fresh</span>
              </div>
            </div>
            <p style={{ fontSize: "0.75rem", color: "rgba(15,26,28,0.5)", textAlign: "center", lineHeight: 1.5 }}>{freshnessMessage}</p>
            {[["Food", freshPct(foodItems)], ["Medicine", freshPct(medItems)], ["Other", freshPct(otherItems)]].map(([label, val]) => (
              <div key={label} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.4)", width: 48, flexShrink: 0 }}>{label}</span>
                <div style={{ flex: 1, height: 4, background: "rgba(15,26,28,0.07)", borderRadius: 99, overflow: "hidden" }}>
                  <div style={{ width: `${val}%`, height: "100%", background: "#1a5e6b", borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.4)", width: 24, textAlign: "right" }}>{val}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* ── Needs Attention ───────────────────────────────────────────── */}
        <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 20, overflow: "hidden" }}>
          <div style={{ padding: "18px 24px", borderBottom: "1px solid rgba(15,26,28,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <AlertTriangle size={14} color="#b91c1c" />
              </div>
              <h2 style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 600 }}>Needs Attention</h2>
            </div>
            <button onClick={() => navigate("/alerts")} style={{ fontSize: "0.8rem", color: "#1a5e6b", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={13} />
            </button>
          </div>

          {attentionItems.length === 0 ? (
            <div style={{ padding: "32px 24px", textAlign: "center" }}>
              <div style={{ fontSize: "2rem", marginBottom: 8 }}>✅</div>
              <p style={{ fontFamily: "serif", fontSize: "0.95rem", fontWeight: 600 }}>All clear! No items expiring soon.</p>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: `repeat(${attentionItems.length}, 1fr)` }}>
              {attentionItems.map((item, i) => {
                const s = urgencyStyle(item.daysLeft);
                return (
                  <div
                    key={item.name + i}
                    style={{ padding: "16px 20px", borderRight: i < attentionItems.length - 1 ? "1px solid rgba(15,26,28,0.06)" : "none", cursor: "pointer", transition: "background 0.15s" }}
                    onMouseEnter={e => (e.currentTarget.style.background = "rgba(15,26,28,0.02)")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                      <div>
                        <p style={{ fontWeight: 600, fontSize: "0.9rem", marginBottom: 2 }}>{item.name}</p>
                        <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.45)" }}>{item.category}</p>
                      </div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 700, background: s.bg, color: s.text, borderRadius: 99, padding: "3px 8px", flexShrink: 0 }}>
                        {item.daysLeft}d
                      </span>
                    </div>
                    <div style={{ height: 6, background: "rgba(15,26,28,0.07)", borderRadius: 99, overflow: "hidden" }}>
                      <div style={{ width: `${item.pct}%`, height: "100%", background: s.bar, borderRadius: 99, transition: "width 0.6s ease" }} />
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.35)", marginTop: 5 }}>{item.pct}% of week left</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Categories ────────────────────────────────────────────────── */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
            <h2 style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 600 }}>Categories</h2>
            <button onClick={() => navigate("/categories")} style={{ fontSize: "0.8rem", color: "#1a5e6b", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}>
              View all <ArrowRight size={13} />
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
            {categoryPreview.map((cat) => (
              <div
                key={cat.name}
                onClick={() => navigate("/categories")}
                style={{ borderRadius: 16, overflow: "hidden", aspectRatio: "1", cursor: "pointer", position: "relative", boxShadow: "0 2px 8px rgba(15,26,28,0.08)", transition: "transform 0.2s, box-shadow 0.2s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 12px 28px rgba(15,26,28,0.14)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,26,28,0.08)"; }}
              >
                <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(15,56,64,0.3) 0%, transparent 50%)" }} />
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,35,32,0.85) 0%, transparent 55%)" }} />
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 14px" }}>
                  <p style={{ fontFamily: "serif", fontWeight: 700, color: "white", fontSize: "1rem", marginBottom: 2 }}>{cat.name}</p>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.72rem" }}>{cat.count} items</p>
                    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: cat.fresh >= 80 ? "#86efac" : cat.fresh >= 60 ? "#fcd34d" : "#fca5a5" }} />
                      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.5)" }}>{cat.fresh}%</span>
                    </div>
                  </div>
                  <div style={{ height: 3, background: "rgba(255,255,255,0.15)", borderRadius: 99, marginTop: 6, overflow: "hidden" }}>
                    <div style={{ width: `${cat.fresh}%`, height: "100%", borderRadius: 99, background: cat.fresh >= 80 ? "#86efac" : cat.fresh >= 60 ? "#fcd34d" : "#fca5a5" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};

export default Dashboard;