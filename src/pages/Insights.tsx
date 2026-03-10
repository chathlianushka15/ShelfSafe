import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import {
  TrendingDown, Package, CheckCircle, AlertTriangle,
  Shield, Flame, Leaf, Droplets, ArrowUp, ArrowDown,
} from "lucide-react";
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

const freshnessColor = (v: number) =>
  v >= 80 ? "#166534" : v >= 60 ? "#d97706" : "#b91c1c";

const freshnessBg = (v: number) =>
  v >= 80 ? "#dcfce7" : v >= 60 ? "#fef3c7" : "#fee2e2";

const freshnessBar = (v: number) =>
  v >= 80 ? "#1a5e6b" : v >= 60 ? "#d97706" : "#b91c1c";

const categoryImgMap: Record<string, string | null> = {
  "Vegetables": vegetablesImg,
  "Fruits":     fruitsImg,
  "Dairy":      dairyImg,
  "Spices":     null,
  "Medicine":   medicineImg,
};

const categoryEmojiMap: Record<string, string> = {
  "Spices": "🌶️",
};

// Eco impact stats (static — decorative)
const ecoStats = [
  { icon: Leaf,     label: "Food saved",  value: "3.2 kg", sub: "from landfill"    },
  { icon: Droplets, label: "Water saved", value: "480 L",  sub: "equivalent"       },
  { icon: Flame,    label: "CO₂ avoided", value: "1.4 kg", sub: "carbon footprint" },
];

// Savings history (static — decorative)
const savingsHistory = [
  { month: "Oct", amount: 1200 },
  { month: "Nov", amount: 1800 },
  { month: "Dec", amount: 1500 },
  { month: "Jan", amount: 2100 },
  { month: "Feb", amount: 1950 },
  { month: "Mar", amount: 2450 },
];
const maxSavings = Math.max(...savingsHistory.map(s => s.amount));

// ─── Component ────────────────────────────────────────────────────────────────

const Insights = () => {
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getItems().then(setItems);
  }, []);

  // ── Real summary stats ──────────────────────────────────────────────────────
  const totalItems  = items.length;
  const usedOnTime  = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d === null || d > 0;
  }).length;
  const wasted = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d !== null && d < 0;
  }).length;

  const summaryStats = [
    { label: "Items Tracked",  value: totalItems, icon: Package,       color: "#1a5e6b", bg: "#d0e8ec" },
    { label: "Used On Time",   value: usedOnTime, icon: CheckCircle,   color: "#166534", bg: "#dcfce7" },
    { label: "Items Expired",  value: wasted,     icon: AlertTriangle, color: "#b91c1c", bg: "#fee2e2" },
    { label: "Warranty Items", value: 0,          icon: Shield,        color: "#d97706", bg: "#fef3c7" },
  ];

  // ── Freshness by category ───────────────────────────────────────────────────
  const trackedCategories = ["Vegetables", "Fruits", "Dairy", "Spices", "Medicine"];
  const categoryFreshness = trackedCategories.map(name => {
    const catItems = items.filter(i => i.category === name);
    const freshCount = catItems.filter(i => {
      const d = daysUntil(i.expiryDate);
      return d === null || d > 7;
    }).length;
    const value = catItems.length > 0 ? Math.round((freshCount / catItems.length) * 100) : 100;
    return {
      name,
      value,
      img: categoryImgMap[name] ?? null,
      emoji: categoryEmojiMap[name] ?? null,
      items: catItems.length,
      trend: 0, // trend requires historical data
    };
  });

  // ── Most expired items ──────────────────────────────────────────────────────
  const expiredItems = items
    .filter(i => i.expiryDate && (daysUntil(i.expiryDate) ?? 0) < 0)
    .slice(0, 4)
    .map((i, idx) => ({
      name: i.name,
      category: i.category,
      times: 4 - idx,
      emoji: "📦",
    }));

  const currentMonth = new Date().toLocaleString("default", { month: "long", year: "numeric" });

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Page header ───────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(15,26,28,0.35)", marginBottom: 4 }}>
              {currentMonth}
            </p>
            <h1 style={{ fontFamily: "serif", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>Insights</h1>
          </div>
          <div style={{ fontSize: "0.75rem", color: "rgba(15,26,28,0.4)", background: "white", border: "1px solid rgba(15,26,28,0.1)", borderRadius: 99, padding: "6px 14px" }}>
            Last 30 days
          </div>
        </div>

        {/* ── Row 1: Waste overview + Savings chart ─────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>

          {/* Waste overview */}
          <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, overflow: "hidden" }}>
            <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(15,26,28,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: "#fee2e2", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <TrendingDown size={14} color="#b91c1c" />
              </div>
              <h2 style={{ fontFamily: "serif", fontSize: "1rem", fontWeight: 600 }}>Waste Overview</h2>
            </div>
            <div style={{ padding: "18px 22px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 12, marginBottom: 14 }}>
                <span style={{ fontFamily: "serif", fontSize: "3.5rem", fontWeight: 700, color: "#b91c1c", lineHeight: 1 }}>{wasted}</span>
                <div style={{ paddingBottom: 6 }}>
                  <p style={{ fontSize: "0.8rem", color: "rgba(15,26,28,0.5)", lineHeight: 1.4 }}>items expired<br />in your inventory</p>
                </div>
              </div>
              <div style={{ height: 7, background: "rgba(15,26,28,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                <div style={{ width: totalItems > 0 ? `${Math.round((usedOnTime / totalItems) * 100)}%` : "0%", height: "100%", background: "linear-gradient(90deg, #1a5e6b, #2a7a62)", borderRadius: 99 }} />
              </div>
              <p style={{ fontSize: "0.7rem", color: "rgba(15,26,28,0.4)" }}>
                {totalItems > 0 ? Math.round((usedOnTime / totalItems) * 100) : 0}% of items used on time
              </p>

              {/* Expired items list */}
              <div style={{ marginTop: 16 }}>
                <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,26,28,0.35)", marginBottom: 10 }}>
                  {expiredItems.length > 0 ? "Expired items" : "No expired items 🎉"}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                  {expiredItems.map((item, i) => (
                    <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: "1.1rem", width: 24, textAlign: "center" }}>{item.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                          <span style={{ fontSize: "0.8rem", fontWeight: 500 }}>{item.name}</span>
                          <span style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)" }}>{item.category}</span>
                        </div>
                        <div style={{ height: 3, background: "rgba(15,26,28,0.07)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ width: `${((4 - i) / 4) * 100}%`, height: "100%", background: i === 0 ? "#b91c1c" : i === 1 ? "#d97706" : "#1a5e6b", borderRadius: 99 }} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Savings chart */}
          <div style={{ background: "linear-gradient(135deg, #0f3840 0%, #1a5e6b 60%, #2a7a62 100%)", borderRadius: 18, padding: "18px 22px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "22px 22px", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1 }}>
              <p style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", marginBottom: 4 }}>Savings index</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 10, marginBottom: 4 }}>
                <span style={{ fontFamily: "serif", fontSize: "2.8rem", fontWeight: 700, color: "white", lineHeight: 1 }}>₹2,450</span>
                <div style={{ paddingBottom: 6 }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: "rgba(134,239,172,0.2)", borderRadius: 99, padding: "3px 8px" }}>
                    <ArrowUp size={10} color="#86efac" />
                    <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#86efac" }}>18%</span>
                  </div>
                </div>
              </div>
              <p style={{ fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", marginBottom: 20 }}>saved this month by reducing waste</p>
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 80 }}>
                {savingsHistory.map((s, i) => {
                  const isLast = i === savingsHistory.length - 1;
                  const pct = (s.amount / maxSavings) * 100;
                  return (
                    <div key={s.month} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%" }}>
                      <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
                        <div style={{ width: "100%", height: `${pct}%`, borderRadius: "5px 5px 3px 3px", background: isLast ? "white" : "rgba(255,255,255,0.2)", position: "relative" }}>
                          {isLast && (
                            <div style={{ position: "absolute", top: -22, left: "50%", transform: "translateX(-50%)", background: "white", color: "#0f3840", fontSize: "0.6rem", fontWeight: 700, borderRadius: 99, padding: "2px 6px", whiteSpace: "nowrap" }}>
                              ₹{s.amount.toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                      <span style={{ fontSize: "0.62rem", color: isLast ? "white" : "rgba(255,255,255,0.35)", fontWeight: isLast ? 700 : 400 }}>{s.month}</span>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid rgba(255,255,255,0.1)", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8 }}>
                {ecoStats.map((e) => (
                  <div key={e.label} style={{ textAlign: "center" }}>
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: 4 }}>
                      <e.icon size={13} color="rgba(255,255,255,0.5)" />
                    </div>
                    <p style={{ fontFamily: "serif", fontSize: "0.95rem", fontWeight: 700, color: "white", lineHeight: 1 }}>{e.value}</p>
                    <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", marginTop: 2 }}>{e.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Row 2: Freshness by category ──────────────────────────────── */}
        <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, overflow: "hidden" }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(15,26,28,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ fontFamily: "serif", fontSize: "1rem", fontWeight: 600 }}>Freshness by Category</h2>
            <span style={{ fontSize: "0.7rem", color: "rgba(15,26,28,0.35)" }}>This month</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)" }}>
            {categoryFreshness.map((cat, i) => (
              <div key={cat.name} style={{ padding: "16px 18px", borderRight: i < categoryFreshness.length - 1 ? "1px solid rgba(15,26,28,0.06)" : "none" }}>
                {cat.img ? (
                  <div style={{ width: "100%", height: 64, borderRadius: 10, overflow: "hidden", marginBottom: 10 }}>
                    <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 64, borderRadius: 10, background: "rgba(15,26,28,0.04)", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem" }}>
                    {cat.emoji ?? "📦"}
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: 600 }}>{cat.name}</span>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 3, background: freshnessBg(cat.value), borderRadius: 99, padding: "2px 7px" }}>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: freshnessColor(cat.value) }}>{cat.value}%</span>
                  </div>
                </div>
                <div style={{ height: 5, background: "rgba(15,26,28,0.07)", borderRadius: 99, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ width: `${cat.value}%`, height: "100%", background: freshnessBar(cat.value), borderRadius: 99 }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.35)" }}>{cat.items} items</span>
                  <span style={{ fontSize: 10, color: "rgba(15,26,28,0.3)" }}>—</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Row 3: Monthly summary stats ──────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
          {summaryStats.map((stat) => (
            <div key={stat.label} style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 16, padding: "18px 20px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 42, height: 42, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <stat.icon size={18} color={stat.color} />
              </div>
              <div>
                <p style={{ fontFamily: "serif", fontSize: "1.8rem", fontWeight: 700, color: "#0f1a1c", lineHeight: 1, marginBottom: 3 }}>{stat.value}</p>
                <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.45)", fontWeight: 500 }}>{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </AppLayout>
  );
};

export default Insights;