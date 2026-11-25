"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import "../admin.css";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("gabbifx@gmail.com");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
  const setupMissing = params?.get("setup") === "1";
  const denied = params?.get("denied") === "1";
  const authError = params?.get("auth_error") === "1";

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const { error: authError } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: { emailRedirectTo: `${window.location.origin}/auth/callback?next=/admin`, shouldCreateUser: false },
      });
      if (authError) throw authError;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send the sign-in link.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="admin-shell">
    <div className="admin-login-card">
      <Link className="admin-brand" href="/">MIXBEE<span>.</span></Link>
      <div className="admin-kicker">STUDIO CONTROL ROOM</div>
      <h1>Admin<br /><span>sign in.</span></h1>
      <p className="admin-muted">A secure sign-in link will be sent to your studio admin email.</p>
      {setupMissing && <div className="admin-alert">Supabase environment variables still need to be added in Vercel.</div>}
      {denied && <div className="admin-alert">This account does not have Mixbee admin access.</div>}
      {authError && <div className="admin-alert">The sign-in link expired or could not be verified. Request a fresh one.</div>}
      {sent ? <div className="admin-success"><strong>Check your inbox.</strong><br />Your sign-in link is on its way to {email}. Open it on this device to enter the dashboard.</div> : <form onSubmit={handleSubmit} className="admin-form">
        <label htmlFor="admin-email">Admin email</label>
        <input id="admin-email" type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} />
        <button disabled={loading}>{loading ? "Sending link…" : "Send secure sign-in link"}</button>
        {error && <p className="admin-error">{error}</p>}
      </form>}
      <Link className="admin-back" href="/">← Back to Mixbee</Link>
    </div>
  </main>;
}
