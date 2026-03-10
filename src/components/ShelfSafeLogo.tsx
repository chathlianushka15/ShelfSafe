// ShelfSafeLogo.tsx
// Reusable logo — use wherever the brand mark appears.
// Props:
//   size    — controls the icon box size (default 34)
//   variant — "dark" (white text, for dark backgrounds) | "light" (dark text, for light backgrounds)

import logoIcon from "@/assets/logo-icon.png";

interface ShelfSafeLogoProps {
  size?: number;
  variant?: "dark" | "light";
  className?: string;
  showText?: boolean;
}

const ShelfSafeLogo = ({ size = 34, variant = "dark", className = "", showText = true }: ShelfSafeLogoProps) => {
  const isDark  = variant === "dark";
  const textColor = isDark ? "white" : "#0f1a1c";

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Icon — clipped in a rounded box so white background is hidden */}
      <div style={{
        width: size,
        height: size,
        borderRadius: Math.round(size * 0.22),
        overflow: "hidden",
        flexShrink: 0,
        background: isDark ? "rgba(255,255,255,0.92)" : "#d0e8ec",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: size * 0.06,
      }}>
        <img
          src={logoIcon}
          alt="ShelfSafe"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* Wordmark — hidden when showText=false */}
      {showText && (
        <span style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: size * 0.75,
          fontWeight: 700,
          color: textColor,
          letterSpacing: "-0.025em",
          lineHeight: 1,
          userSelect: "none",
        }}>
          ShelfSafe
        </span>
      )}
    </div>
  );
};

export default ShelfSafeLogo;