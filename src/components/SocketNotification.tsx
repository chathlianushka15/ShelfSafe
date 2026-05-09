import { useEffect, useState } from "react";
import { socket } from "@/lib/socket";

const SocketNotification = () => {
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    // Listen for inventory updates
    socket.on('inventory-updated', (data) => {
      setNotification(data.message);
      setTimeout(() => setNotification(null), 4000);
    });

    // Listen for expiry alerts
    socket.on('expiry-alert', (data) => {
      setNotification(`⚠️ ${data.message}`);
      setTimeout(() => setNotification(null), 4000);
    });

    return () => {
      socket.off('inventory-updated');
      socket.off('expiry-alert');
    };
  }, []);

  if (!notification) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 24,
      right: 24,
      background: "#0f3840",
      color: "white",
      padding: "14px 20px",
      borderRadius: 14,
      fontSize: "0.85rem",
      fontWeight: 600,
      boxShadow: "0 8px 24px rgba(15,26,28,0.2)",
      zIndex: 9999,
      maxWidth: 320,
      animation: "slideIn 0.3s ease",
    }}>
      🔔 {notification}
    </div>
  );
};

export default SocketNotification;