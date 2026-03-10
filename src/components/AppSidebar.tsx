import { useState, useEffect } from "react";
import {
  LayoutDashboard, Grid3X3, PlusCircle,
  Bell, BarChart3, LogOut, Settings, ChevronRight,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation, useNavigate } from "react-router-dom";
import { clearSession, getSession } from "@/pages/Auth";
import ShelfSafeLogo from "@/components/ShelfSafeLogo";
import { getItems, type InventoryItem } from "@/lib/inventory-store";
import {
  Sidebar, SidebarContent, SidebarHeader,
  SidebarFooter, useSidebar,
} from "@/components/ui/sidebar";

const daysUntil = (dateStr: string) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
};

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const navigate = useNavigate();
  const session = getSession();
  const userName = session?.user?.name ?? "User";
  const userEmail = session?.user?.email ?? "";
  const initials = userName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
  const [items, setItems] = useState<InventoryItem[]>([]);

  useEffect(() => {
    getItems().then(setItems);
  }, [location.pathname]);

  const totalItems = items.length;
  const expiringCount = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d !== null && d >= 0 && d <= 7;
  }).length;
  const freshItems = items.filter(i => {
    const d = daysUntil(i.expiryDate);
    return d === null || d > 7;
  }).length;
  const freshnessScore = totalItems > 0 ? Math.round((freshItems / totalItems) * 100) : 100;

  const quickStats = [
    { label: "Items",    value: String(totalItems)    },
    { label: "Expiring", value: String(expiringCount) },
    { label: "Score",    value: `${freshnessScore}%`  },
  ];

  const navItems = [
    { title: "Dashboard",  url: "/dashboard",  icon: LayoutDashboard },
    { title: "Categories", url: "/categories", icon: Grid3X3         },
    { title: "Add Item",   url: "/add-item",   icon: PlusCircle      },
    { title: "Alerts",     url: "/alerts",     icon: Bell,            badge: expiringCount },
    { title: "Insights",   url: "/insights",   icon: BarChart3       },
  ];

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    clearSession();
    navigate("/auth");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader style={{ padding: 0, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <NavLink
          to="/"
          style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: collapsed ? "14px 10px" : "16px 18px",
            justifyContent: collapsed ? "center" : "flex-start",
            textDecoration: "none",
          }}
        >
          <ShelfSafeLogo size={32} variant="dark" showText={!collapsed} />
        </NavLink>
      </SidebarHeader>

      <SidebarContent style={{ display: "flex", flexDirection: "column", gap: 0, overflowX: "hidden" }}>

        {!collapsed && (
          <div style={{ padding: "10px 14px 14px" }}>
            <div style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "10px 12px", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 6 }}>
              {quickStats.map(s => (
                <div key={s.label} style={{ textAlign: "center" }}>
                  <p style={{ fontFamily: "serif", fontSize: "1.1rem", fontWeight: 700, color: "white", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: "0.6rem", color: "rgba(255,255,255,0.35)", marginTop: 2, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {!collapsed && (
          <p style={{ padding: "0 18px 8px", fontSize: "0.62rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.25)" }}>
            Navigation
          </p>
        )}

        <nav style={{ display: "flex", flexDirection: "column", gap: 2, padding: collapsed ? "0 8px" : "0 10px" }}>
          {navItems.map(item => {
            const active = isActive(item.url);
            return (
              <NavLink
                key={item.title}
                to={item.url}
                title={collapsed ? item.title : undefined}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: collapsed ? "10px" : "9px 12px",
                  borderRadius: 10, textDecoration: "none",
                  justifyContent: collapsed ? "center" : "flex-start",
                  position: "relative",
                  background: active ? "rgba(255,255,255,0.12)" : "transparent",
                  border: active ? "1px solid rgba(255,255,255,0.12)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {active && <div style={{ position: "absolute", left: 0, top: "20%", bottom: "20%", width: 3, borderRadius: 99, background: "#7ecdd8" }} />}
                <div style={{ width: 28, height: 28, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: active ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.05)" }}>
                  <item.icon size={14} color={active ? "white" : "rgba(255,255,255,0.5)"} />
                </div>
                {!collapsed && (
                  <>
                    <span style={{ fontSize: "0.85rem", fontWeight: active ? 600 : 400, color: active ? "white" : "rgba(255,255,255,0.55)", flex: 1 }}>
                      {item.title}
                    </span>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      {item.badge && item.badge > 0 && (
                        <span style={{ fontSize: "0.6rem", fontWeight: 700, background: "#b91c1c", color: "white", borderRadius: 99, padding: "1px 6px", minWidth: 16, textAlign: "center" }}>
                          {item.badge}
                        </span>
                      )}
                      {active && <ChevronRight size={12} color="rgba(255,255,255,0.3)" />}
                    </div>
                  </>
                )}
                {collapsed && item.badge && item.badge > 0 && (
                  <div style={{ position: "absolute", top: 6, right: 6, width: 7, height: 7, borderRadius: "50%", background: "#b91c1c" }} />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div style={{ height: 1, background: "rgba(255,255,255,0.07)", margin: "12px 14px" }} />

        <nav style={{ padding: collapsed ? "0 8px" : "0 10px" }}>
          <NavLink
            to="/settings"
            title={collapsed ? "Settings" : undefined}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: collapsed ? "10px" : "9px 12px", borderRadius: 10, textDecoration: "none", justifyContent: collapsed ? "center" : "flex-start", background: isActive("/settings") ? "rgba(255,255,255,0.10)" : "transparent", border: "1px solid transparent", transition: "background 0.15s" }}
            onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!isActive("/settings")) e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}
            onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => { if (!isActive("/settings")) e.currentTarget.style.background = "transparent"; }}
          >
            <div style={{ width: 28, height: 28, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", flexShrink: 0 }}>
              <Settings size={14} color="rgba(255,255,255,0.45)" />
            </div>
            {!collapsed && <span style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)" }}>Settings</span>}
          </NavLink>
        </nav>

        {!collapsed && (
          <div style={{ margin: "12px 14px 0", padding: "12px 14px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12 }}>
            <p style={{ fontSize: "0.65rem", fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 5 }}>💡 Today's tip</p>
            <p style={{ fontSize: "0.73rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.5 }}>Store leafy greens with a paper towel to absorb moisture and extend freshness.</p>
          </div>
        )}

      </SidebarContent>

      <SidebarFooter style={{ borderTop: "1px solid rgba(255,255,255,0.07)", padding: collapsed ? "12px 8px" : "12px 14px" }}>
        {collapsed ? (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "white" }}>{initials}</span>
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, #2a7a62, #1a5e6b)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "white" }}>{initials}</span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "0.8rem", fontWeight: 600, color: "white", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", lineHeight: 1 }}>{userName}</p>
              <p style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginTop: 2 }}>{userEmail}</p>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.07)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0, transition: "background 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(185,28,28,0.3)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
            >
              <LogOut size={13} color="rgba(255,255,255,0.5)" />
            </button>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}