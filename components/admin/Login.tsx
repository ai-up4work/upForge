"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import Logo from "@/components/Logo";

export default function Login() {
  const router = useRouter();
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pw) return setError("Enter the admin password.");
    setBusy(true);
    setError("");
    try {
      const r = await (await fetch("/api/authenticate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password: pw }) })).json();
      if (!r.success) throw new Error(r.error || "Sign-in failed");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  };

  return (
    <div className="a-login">
      <div className="a-login-aura" aria-hidden="true" />
      <motion.form onSubmit={submit} className="a-login-card" initial={{ opacity: 0, y: 20, scale: 0.98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
        <Logo className="a-login-logo" />
        <h1>Studio admin</h1>
        <p>Sign in to manage projects, journal posts and the gallery.</p>
        <div className="a-field">
          <label htmlFor="pw">Password</label>
          <input id="pw" type="password" autoComplete="current-password" autoFocus value={pw} onChange={(e) => setPw(e.target.value)} />
          {error && <span className="a-error" role="alert">{error}</span>}
        </div>
        <button className="a-btn primary block" disabled={busy}>
          {busy && <Loader2 className="spin" size={15} />} Sign in
        </button>
        <a href="/" className="a-login-back">← Back to site</a>
      </motion.form>
    </div>
  );
}
