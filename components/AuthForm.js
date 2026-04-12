"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Loader2, Eye, EyeOff } from "lucide-react";
import styles from "./AuthForm.module.css";

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState("login"); // "login" | "register"
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Registration failed.");
        // Auto login after register
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) throw new Error("Invalid email or password.");
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${mode === "login" ? styles.tabActive : ""}`}
          onClick={() => { setMode("login"); setError(""); }}
        >
          Sign In
        </button>
        <button
          className={`${styles.tab} ${mode === "register" ? styles.tabActive : ""}`}
          onClick={() => { setMode("register"); setError(""); }}
        >
          Create Account
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {mode === "register" && (
          <div className={styles.field}>
            <label className={styles.label}>Full Name</label>
            <input
              className="glass-input"
              placeholder="John Doe"
              value={form.name}
              onChange={(e) => update("name", e.target.value)}
              required
            />
          </div>
        )}

        <div className={styles.field}>
          <label className={styles.label}>Email</label>
          <input
            className="glass-input"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Password</label>
          <div className={styles.passwordWrap}>
            <input
              className="glass-input"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              required
              minLength={6}
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowPass((v) => !v)}>
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button type="submit" className={`btn-primary ${styles.submitBtn}`} disabled={loading}>
          {loading
            ? <Loader2 size={18} className={styles.spin} />
            : mode === "login" ? "Sign In" : "Create Account"
          }
        </button>
      </form>
    </div>
  );
}
