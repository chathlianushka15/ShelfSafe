import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { getItems, removeItem, type InventoryItem } from "@/lib/inventory-store";
import {
  Carrot, Apple, Milk, Wheat, Flame, HeartPulse,
  Cpu, Refrigerator, Sparkles, ArrowLeft, MapPin,
  Calendar, Package, Tag, Clock, Trash2, Plus, Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import vegetablesImg from "@/assets/vegetables.jpg";
import fruitsImg from "@/assets/fruits.jpg";
import dairyImg from "@/assets/dairy.jpg";
import pulsesImg from "@/assets/pulses.jpg";
import spicesImg from "@/assets/spices.jpg";
import medicineImg from "@/assets/medicine.jpg";
import electronicsImg from "@/assets/electronics.jpg";
import appliancesImg from "@/assets/appliances.jpg";
import personalCareImg from "@/assets/personal-care.jpg";

// ─── Data ─────────────────────────────────────────────────────────────────────

const categories = [
  { name: "Vegetables",      img: vegetablesImg,   icon: Carrot       },
  { name: "Fruits",          img: fruitsImg,        icon: Apple        },
  { name: "Dairy",           img: dairyImg,         icon: Milk         },
  { name: "Pulses & Grains", img: pulsesImg,        icon: Wheat        },
  { name: "Spices",          img: spicesImg,        icon: Flame        },
  { name: "Medicine",        img: medicineImg,      icon: HeartPulse   },
  { name: "Electronics",     img: electronicsImg,   icon: Cpu          },
  { name: "Appliances",      img: appliancesImg,    icon: Refrigerator },
  { name: "Personal Care",   img: personalCareImg,  icon: Sparkles     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const daysUntil = (dateStr: string) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
};

const expiryBadge = (dateStr: string) => {
  if (!dateStr) return null;
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0)   return { label: `Expired ${Math.abs(days)}d ago`, color: "#b91c1c", bg: "#fee2e2" };
  if (days === 0) return { label: "Expires today",                   color: "#b91c1c", bg: "#fee2e2" };
  if (days <= 3)  return { label: `${days}d left`,                   color: "#b91c1c", bg: "#fee2e2" };
  if (days <= 7)  return { label: `${days}d left`,                   color: "#d97706", bg: "#fef3c7" };
  return               { label: `${days}d left`,                   color: "#166534", bg: "#dcfce7" };
};

const fmt = (dateStr: string) => {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
};

// ─── Item Card ────────────────────────────────────────────────────────────────

const ItemCard = ({ item, onDelete }: { item: InventoryItem; onDelete: () => void }) => {
  const exp = expiryBadge(item.expiryDate);
  const isUrgent = exp?.color === "#b91c1c";

  return (
    <div
      style={{
        background: "white",
        border: `1.5px solid ${isUrgent ? "rgba(185,28,28,0.15)" : "rgba(15,26,28,0.08)"}`,
        borderRadius: 16,
        padding: "16px 18px",
        display: "flex", flexDirection: "column", gap: 12,
        transition: "box-shadow 0.15s",
        position: "relative",
      }}
      onMouseEnter={e => (e.currentTarget.style.boxShadow = "0 6px 20px rgba(15,26,28,0.08)")}
      onMouseLeave={e => (e.currentTarget.style.boxShadow = "none")}
    >
      {isUrgent && <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 3, background: "#b91c1c", borderRadius: "16px 0 0 16px" }} />}

      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: 3 }}>{item.name}</p>
          {item.brand && (
            <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", display: "flex", alignItems: "center", gap: 4 }}>
              <Tag size={10} /> {item.brand}
            </p>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
          {exp && (
            <span style={{ fontSize: "0.68rem", fontWeight: 700, background: exp.bg, color: exp.color, borderRadius: 99, padding: "3px 8px", whiteSpace: "nowrap" }}>
              {exp.label}
            </span>
          )}
          <button
            onClick={onDelete}
            style={{ width: 26, height: 26, borderRadius: 7, background: "#fee2e2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
            onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
            onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
          >
            <Trash2 size={12} color="#b91c1c" />
          </button>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(15,26,28,0.06)" }} />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {[
          { icon: Package,  bg: "#d0e8ec", color: "#1a5e6b", label: "Qty",      value: `${item.quantity}${item.unit ? ` ${item.unit}` : ""}` },
          { icon: MapPin,   bg: "#fef3c7", color: "#d97706", label: "Location", value: item.location || "—" },
          { icon: Calendar, bg: "#dcfce7", color: "#166534", label: "Bought",   value: fmt(item.purchaseDate) },
          { icon: Clock,    bg: exp?.bg ?? "rgba(15,26,28,0.05)", color: exp?.color ?? "rgba(15,26,28,0.3)", label: "Expires", value: fmt(item.expiryDate) },
        ].map(({ icon: Icon, bg, color, label, value }) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon size={12} color={color} />
            </div>
            <div>
              <p style={{ fontSize: "0.6rem", color: "rgba(15,26,28,0.38)", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>{label}</p>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: label === "Expires" && exp ? exp.color : "inherit" }}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {item.notes && (
        <p style={{ fontSize: "0.75rem", color: "rgba(15,26,28,0.45)", background: "rgba(15,26,28,0.03)", borderRadius: 8, padding: "7px 10px", lineHeight: 1.5 }}>
          📝 {item.notes}
        </p>
      )}
    </div>
  );
};

// ─── Main ─────────────────────────────────────────────────────────────────────

const Categories = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<string | null>(null);
  const [items, setItems]       = useState<InventoryItem[]>([]);
  const [search, setSearch]     = useState("");

  // Load items from backend on mount
  useEffect(() => {
    getItems().then(setItems);
  }, []);

  const selectedCat = categories.find(c => c.name === selected);
  const catItems    = items.filter(i => i.category === selected);
  const filtered    = catItems.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    (i.brand ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await removeItem(id);
    const updatedItems = await getItems();
    setItems(updatedItems);
  };

  const urgentCount = (name: string) =>
    items.filter(i => i.category === name && i.expiryDate && (daysUntil(i.expiryDate) ?? 999) <= 3).length;

  // ── Grid view ───────────────────────────────────────────────────────────────
  if (!selected) {
    return (
      <AppLayout>
        <div className="max-w-6xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: "1.8rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>Categories</h1>
            <p style={{ fontSize: "0.75rem", color: "rgba(15,26,28,0.4)", marginTop: 4 }}>
              {items.length} items across {categories.length} categories — tap any to explore
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {categories.map(cat => {
              const count  = items.filter(i => i.category === cat.name).length;
              const urgent = urgentCount(cat.name);
              return (
                <div
                  key={cat.name}
                  onClick={() => { setSelected(cat.name); setSearch(""); }}
                  style={{
                    position: "relative", borderRadius: 20, overflow: "hidden",
                    aspectRatio: "4/3", cursor: "pointer",
                    boxShadow: "0 2px 8px rgba(15,26,28,0.08)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = "0 14px 32px rgba(15,26,28,0.16)"; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(15,26,28,0.08)"; }}
                >
                  <img src={cat.img} alt={cat.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(160deg, rgba(15,56,64,0.25) 0%, transparent 45%)" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(10,35,32,0.88) 0%, transparent 55%)" }} />

                  {urgent > 0 && (
                    <div style={{ position: "absolute", top: 12, right: 12, background: "#b91c1c", color: "white", borderRadius: 99, padding: "3px 9px", fontSize: "0.65rem", fontWeight: 700 }}>
                      {urgent} expiring
                    </div>
                  )}

                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "14px 16px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 5 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 9, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(8px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <cat.icon size={15} color="white" />
                      </div>
                      <p style={{ fontFamily: "serif", fontWeight: 700, color: "white", fontSize: "1.05rem" }}>{cat.name}</p>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "0.75rem" }}>{count} items</p>
                      <span style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.4)" }}>tap to view →</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </AppLayout>
    );
  }

  // ── Detail view ─────────────────────────────────────────────────────────────
  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button
              onClick={() => setSelected(null)}
              style={{ width: 36, height: 36, borderRadius: 10, background: "white", border: "1.5px solid rgba(15,26,28,0.1)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              onMouseEnter={e => (e.currentTarget.style.background = "#d0e8ec")}
              onMouseLeave={e => (e.currentTarget.style.background = "white")}
            >
              <ArrowLeft size={16} color="#1a5e6b" />
            </button>

            {selectedCat && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
                  <img src={selectedCat.img} alt={selected} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h1 style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>{selected}</h1>
                  <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>{catItems.length} items stored</p>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => navigate("/add-item")}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "linear-gradient(135deg, #0f3840, #1a5e6b)", color: "white", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}
          >
            <Plus size={14} /> Add Item
          </button>
        </div>

        <div style={{ position: "relative" }}>
          <Search size={14} color="rgba(15,26,28,0.35)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            placeholder={`Search in ${selected}…`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: "100%", height: 40, borderRadius: 10, border: "1.5px solid rgba(15,26,28,0.1)", paddingLeft: 34, paddingRight: 12, fontSize: "0.875rem", outline: "none", background: "white", boxSizing: "border-box" }}
            onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
            onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.1)")}
          />
        </div>

        {filtered.length === 0 ? (
          <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, padding: "56px 24px", textAlign: "center" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{search ? "🔍" : "📦"}</div>
            <p style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 600, marginBottom: 6 }}>
              {search ? "No matches found" : `No ${selected} items yet`}
            </p>
            <p style={{ fontSize: "0.8rem", color: "rgba(15,26,28,0.4)", marginBottom: 20 }}>
              {search ? "Try a different search term" : "Add your first item to this category"}
            </p>
            {!search && (
              <button
                onClick={() => navigate("/add-item")}
                style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, background: "#1a5e6b", color: "white", border: "none", cursor: "pointer", fontSize: "0.82rem", fontWeight: 600 }}
              >
                <Plus size={14} /> Add Item
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 12 }}>
            {filtered.map(item => (
              <ItemCard key={item.id} item={item} onDelete={() => handleDelete(item.id)} />
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Categories;