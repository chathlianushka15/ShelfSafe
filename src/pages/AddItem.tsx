import { useState, useEffect } from "react";
import { AppLayout } from "@/components/AppLayout";
import { toast } from "@/hooks/use-toast";
import { addItem, getItems, removeItem, type InventoryItem } from "@/lib/inventory-store";
import {
  Trash2, Carrot, Apple, Milk, Wheat, Flame,
  HeartPulse, Cpu, Refrigerator, Sparkles, Plus,
  MapPin, Calendar, Tag, Hash, AlignLeft, Package,
} from "lucide-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const categoryOptions = [
  { name: "Vegetables",     icon: Carrot,      emoji: "🥦" },
  { name: "Fruits",         icon: Apple,       emoji: "🍎" },
  { name: "Dairy",          icon: Milk,        emoji: "🥛" },
  { name: "Pulses & Grains",icon: Wheat,       emoji: "🌾" },
  { name: "Spices",         icon: Flame,       emoji: "🌶️" },
  { name: "Medicine",       icon: HeartPulse,  emoji: "💊" },
  { name: "Electronics",    icon: Cpu,         emoji: "🔌" },
  { name: "Appliances",     icon: Refrigerator,emoji: "🏠" },
  { name: "Personal Care",  icon: Sparkles,    emoji: "✨" },
];

const quantityOptions = [
  { label: "Full",           pct: 100 },
  { label: "¾ Full",         pct: 75  },
  { label: "Half",           pct: 50  },
  { label: "¼ Left",         pct: 25  },
  { label: "Almost Empty",   pct: 10  },
];

const locationOptions = ["Refrigerator", "Freezer", "Pantry", "Cabinet", "Medicine Box", "Drawer", "Other"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

const today = new Date().toISOString().split("T")[0];

const expiryStatus = (dateStr: string) => {
  if (!dateStr) return null;
  const days = Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  if (days < 0)  return { color: "#b91c1c", bg: "#fee2e2", label: "Expired"         };
  if (days <= 3) return { color: "#b91c1c", bg: "#fee2e2", label: `${days}d left`   };
  if (days <= 7) return { color: "#d97706", bg: "#fef3c7", label: `${days}d left`   };
  return               { color: "#166534", bg: "#dcfce7", label: `${days}d left`   };
};

// ─── Field component ──────────────────────────────────────────────────────────

const Field = ({
  label, icon: Icon, children, span = false,
}: {
  label: string; icon: React.ElementType; children: React.ReactNode; span?: boolean;
}) => (
  <div style={{ gridColumn: span ? "1 / -1" : undefined }}>
    <label style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "rgba(15,26,28,0.45)", marginBottom: 6 }}>
      <Icon size={11} />
      {label}
    </label>
    {children}
  </div>
);

const inputStyle: React.CSSProperties = {
  width: "100%",
  height: 40,
  borderRadius: 10,
  border: "1.5px solid rgba(15,26,28,0.12)",
  padding: "0 12px",
  fontSize: "0.875rem",
  background: "white",
  color: "#0f1a1c",
  outline: "none",
  transition: "border-color 0.15s",
  boxSizing: "border-box",
};

// ─── Component ────────────────────────────────────────────────────────────────

const AddItem = () => {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedQuantity, setSelectedQuantity] = useState(quantityOptions[0]);
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [form, setForm] = useState({
    name: "", brand: "", quantity: "1", unit: "",
    location: "", purchaseDate: today, expiryDate: "", notes: "",
  });

  // Load items from backend on mount
  useEffect(() => {
    getItems().then(setItems);
  }, []);

  const update = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) {
      toast({ title: "Item name is required", variant: "destructive" }); return;
    }
    if (!selectedCategory) {
      toast({ title: "Please select a category", variant: "destructive" }); return;
    }
    await addItem({
      category: selectedCategory,
      name: form.name.trim(),
      brand: form.brand,
      quantity: Number(form.quantity) || 1,
      unit: form.unit,
      location: form.location,
      purchaseDate: form.purchaseDate,
      expiryDate: form.expiryDate,
      notes: form.notes,
      quantityRemaining: selectedQuantity.label,
    });
    const updatedItems = await getItems();
    setItems(updatedItems);
    const saved = form.name;
    setForm({ name: "", brand: "", quantity: "1", unit: "", location: "", purchaseDate: today, expiryDate: "", notes: "" });
    setSelectedCategory("");
    setSelectedQuantity(quantityOptions[0]);
    toast({ title: `${saved} added to inventory ✓` });
  };

  const handleDelete = async (id: string) => {
    await removeItem(id);
    const updatedItems = await getItems();
    setItems(updatedItems);
    toast({ title: "Item removed" });
  };

  const expStatus = expiryStatus(form.expiryDate);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "#d0e8ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Plus size={18} color="#1a5e6b" />
          </div>
          <div>
            <h1 style={{ fontFamily: "serif", fontSize: "1.6rem", fontWeight: 700, letterSpacing: "-0.025em", lineHeight: 1 }}>Add Item</h1>
            <p style={{ fontSize: "0.72rem", color: "rgba(15,26,28,0.4)", marginTop: 2 }}>{items.length} items in inventory</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 14, alignItems: "start" }}>

          {/* ── Left: Form ──────────────────────────────────────────── */}
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 12 }}>

            {/* Category picker */}
            <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", marginBottom: 12 }}>
                Category <span style={{ color: "#b91c1c" }}>*</span>
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {categoryOptions.map(cat => {
                  const active = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "12px 8px",
                        borderRadius: 12,
                        border: `1.5px solid ${active ? "#1a5e6b" : "rgba(15,26,28,0.1)"}`,
                        background: active ? "#d0e8ec" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <span style={{ fontSize: "1.3rem" }}>{cat.emoji}</span>
                      <span style={{ fontSize: "0.68rem", fontWeight: 600, color: active ? "#1a5e6b" : "rgba(15,26,28,0.5)", textAlign: "center", lineHeight: 1.3 }}>
                        {cat.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Item details */}
            <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", marginBottom: 14 }}>
                Item Details
              </p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                <Field label="Item Name *" icon={Tag} span>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Organic Spinach"
                    value={form.name}
                    onChange={e => update("name", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  />
                </Field>

                <Field label="Brand" icon={Sparkles}>
                  <input
                    style={inputStyle}
                    placeholder="e.g. Amul"
                    value={form.brand}
                    onChange={e => update("brand", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  />
                </Field>

                <Field label="Quantity" icon={Hash}>
                  <input
                    style={inputStyle}
                    type="number"
                    min="1"
                    placeholder="1"
                    value={form.quantity}
                    onChange={e => update("quantity", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  />
                </Field>

                <Field label="Unit" icon={Package}>
                  <select
                    style={{ ...inputStyle, appearance: "none" }}
                    value={form.unit}
                    onChange={e => update("unit", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  >
                    <option value="">Select unit</option>
                    <optgroup label="Weight">
                      <option value="g">g — grams</option>
                      <option value="kg">kg — kilograms</option>
                      <option value="mg">mg — milligrams</option>
                      <option value="oz">oz — ounces</option>
                      <option value="lb">lb — pounds</option>
                    </optgroup>
                    <optgroup label="Volume">
                      <option value="ml">ml — millilitres</option>
                      <option value="L">L — litres</option>
                      <option value="tsp">tsp — teaspoon</option>
                      <option value="tbsp">tbsp — tablespoon</option>
                      <option value="cup">cup</option>
                    </optgroup>
                    <optgroup label="Count">
                      <option value="pcs">pcs — pieces</option>
                      <option value="pack">pack</option>
                      <option value="box">box</option>
                      <option value="bottle">bottle</option>
                      <option value="can">can</option>
                      <option value="sachet">sachet</option>
                      <option value="dozen">dozen</option>
                      <option value="pair">pair</option>
                    </optgroup>
                    <optgroup label="Other">
                      <option value="strip">strip (medicine)</option>
                      <option value="tablet">tablet</option>
                      <option value="capsule">capsule</option>
                      <option value="unit">unit</option>
                    </optgroup>
                  </select>
                </Field>

                <Field label="Location" icon={MapPin}>
                  <select
                    style={{ ...inputStyle, appearance: "none" }}
                    value={form.location}
                    onChange={e => update("location", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  >
                    <option value="">Select location</option>
                    {locationOptions.map(l => <option key={l} value={l}>{l}</option>)}
                  </select>
                </Field>

                <Field label="Purchase Date" icon={Calendar}>
                  <input
                    style={inputStyle}
                    type="date"
                    value={form.purchaseDate}
                    onChange={e => update("purchaseDate", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  />
                </Field>

                <Field label="Expiry Date" icon={Calendar} span>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <input
                      style={{ ...inputStyle, flex: 1 }}
                      type="date"
                      value={form.expiryDate}
                      onChange={e => update("expiryDate", e.target.value)}
                      onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                      onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                    />
                    {expStatus && (
                      <div style={{ background: expStatus.bg, borderRadius: 99, padding: "4px 10px", flexShrink: 0 }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: expStatus.color }}>{expStatus.label}</span>
                      </div>
                    )}
                  </div>
                </Field>

                <Field label="Notes" icon={AlignLeft} span>
                  <textarea
                    style={{ ...inputStyle, height: 72, padding: "10px 12px", resize: "none", lineHeight: 1.5 }}
                    placeholder="Storage tips, reminders, recipe ideas…"
                    value={form.notes}
                    onChange={e => update("notes", e.target.value)}
                    onFocus={e => (e.target.style.borderColor = "#1a5e6b")}
                    onBlur={e => (e.target.style.borderColor = "rgba(15,26,28,0.12)")}
                  />
                </Field>
              </div>
            </div>

            {/* Quantity remaining */}
            <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, padding: "18px 20px" }}>
              <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "rgba(15,26,28,0.4)", marginBottom: 12 }}>
                Amount Remaining
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                {quantityOptions.map(q => {
                  const active = selectedQuantity.label === q.label;
                  return (
                    <button
                      key={q.label}
                      type="button"
                      onClick={() => setSelectedQuantity(q)}
                      style={{
                        flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
                        padding: "10px 6px",
                        borderRadius: 12,
                        border: `1.5px solid ${active ? "#1a5e6b" : "rgba(15,26,28,0.1)"}`,
                        background: active ? "#d0e8ec" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div style={{ width: 20, height: 28, borderRadius: 4, background: "rgba(15,26,28,0.07)", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                        <div style={{ width: "100%", height: `${q.pct}%`, background: active ? "#1a5e6b" : "rgba(15,26,28,0.2)", borderRadius: "2px 2px 0 0", transition: "background 0.15s" }} />
                      </div>
                      <span style={{ fontSize: "0.62rem", fontWeight: 600, color: active ? "#1a5e6b" : "rgba(15,26,28,0.45)", textAlign: "center", lineHeight: 1.3 }}>
                        {q.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              style={{
                width: "100%", height: 48, borderRadius: 14,
                background: "linear-gradient(135deg, #0f3840, #1a5e6b)",
                color: "white", border: "none", cursor: "pointer",
                fontFamily: "serif", fontSize: "1rem", fontWeight: 700,
                letterSpacing: "-0.01em",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "opacity 0.15s",
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
            >
              <Plus size={16} /> Save to Inventory
            </button>
          </form>

          {/* ── Right: Inventory list ────────────────────────────────── */}
          <div style={{ background: "white", border: "1px solid rgba(15,26,28,0.08)", borderRadius: 18, overflow: "hidden", position: "sticky", top: 16 }}>
            <div style={{ padding: "16px 18px", borderBottom: "1px solid rgba(15,26,28,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h2 style={{ fontFamily: "serif", fontSize: "1rem", fontWeight: 600 }}>Inventory</h2>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, background: "#d0e8ec", color: "#1a5e6b", borderRadius: 99, padding: "3px 9px" }}>
                {items.length} items
              </span>
            </div>

            {items.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center" }}>
                <div style={{ fontSize: "2rem", marginBottom: 10 }}>📦</div>
                <p style={{ fontFamily: "serif", fontSize: "0.95rem", fontWeight: 600, marginBottom: 4 }}>Empty shelf</p>
                <p style={{ fontSize: "0.75rem", color: "rgba(15,26,28,0.4)" }}>Add your first item using the form.</p>
              </div>
            ) : (
              <div style={{ maxHeight: "62vh", overflowY: "auto", padding: "8px 0" }}>
                {items.slice().reverse().map(item => {
                  const exp = expiryStatus(item.expiryDate);
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex", alignItems: "center", gap: 10,
                        padding: "10px 18px",
                        borderBottom: "1px solid rgba(15,26,28,0.04)",
                        transition: "background 0.1s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = "rgba(15,26,28,0.02)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
                    >
                      <span style={{ fontSize: "1.1rem", flexShrink: 0, width: 24, textAlign: "center" }}>
                        {categoryOptions.find(c => c.name === item.category)?.emoji ?? "📦"}
                      </span>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 600, fontSize: "0.82rem", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {item.name}
                        </p>
                        <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
                          <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.4)" }}>{item.category}</span>
                          {item.quantity > 0 && (
                            <>
                              <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.2)" }}>·</span>
                              <span style={{ fontSize: "0.65rem", color: "rgba(15,26,28,0.4)" }}>{item.quantity}{item.unit ? ` ${item.unit}` : ""}</span>
                            </>
                          )}
                        </div>
                        {exp && (
                          <div style={{ marginTop: 3, display: "inline-flex", alignItems: "center", background: exp.bg, borderRadius: 99, padding: "1px 6px" }}>
                            <span style={{ fontSize: "0.6rem", fontWeight: 700, color: exp.color }}>{exp.label}</span>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        style={{ width: 26, height: 26, borderRadius: 7, background: "#fee2e2", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "opacity 0.15s" }}
                        onMouseEnter={e => (e.currentTarget.style.opacity = "0.7")}
                        onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                      >
                        <Trash2 size={12} color="#b91c1c" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default AddItem;