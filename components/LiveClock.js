"use client";
import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export default function LiveClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }));
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) return null;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem',
      padding: '0.9rem 1.5rem', background: 'linear-gradient(145deg, rgba(59, 130, 246, 0.1), rgba(20, 30, 50, 0.4))',
      borderRadius: '50px', border: '1px solid rgba(59, 130, 246, 0.3)', width: 'max-content',
      margin: '0 auto 1.5rem auto', fontSize: '1.5rem', fontWeight: 700, color: '#f9fafb',
      boxShadow: '0 4px 24px rgba(59, 130, 246, 0.15)'
    }}>
      <Clock size={22} style={{ color: '#ef4444' }} />
      <span style={{ fontVariantNumeric: 'tabular-nums', letterSpacing: '0.05em' }}>{time}</span>
    </div>
  );
}
