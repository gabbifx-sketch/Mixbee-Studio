"use client";

import { FormEvent, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ContactForm() {
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const { error: insertError } = await getSupabaseBrowserClient().from("contact_messages").insert({
        name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim() || null,
        subject: String(form.get("subject") ?? "").trim(),
        message: String(form.get("message") ?? "").trim(),
      });
      if (insertError) throw insertError;
      setDone(true); event.currentTarget.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Message could not be sent."); }
    finally { setLoading(false); }
  }

  if (done) return <div className="public-form-success"><strong>Message sent.</strong><p>Thanks for reaching out. The studio will get back to you.</p></div>;

  return <form className="public-form" onSubmit={submit}>
    <div className="public-form-grid">
      <label>Your name<input name="name" required minLength={2} maxLength={120} placeholder="Full name"/></label>
      <label>Email address<input name="email" type="email" required maxLength={254} placeholder="you@example.com"/></label>
      <label>Phone (optional)<input name="phone" maxLength={40} placeholder="+233…"/></label>
      <label>Subject<input name="subject" required minLength={2} maxLength={160} placeholder="What is this about?"/></label>
    </div>
    <label>Your message<textarea name="message" required minLength={5} maxLength={5000} rows={5} placeholder="Write your message…"/></label>
    {error && <p className="public-form-error">{error}</p>}
    <button disabled={loading}>{loading ? "Sending…" : "Send message ↗"}</button>
  </form>;
}
