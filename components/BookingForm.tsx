"use client";

import { FormEvent, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Service = { id: string; name: string };

export default function BookingForm() {
  const [services, setServices] = useState<Service[]>([]);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadServices() {
      const result: any = await getSupabaseBrowserClient().from("services").select("id,name").eq("active", true).order("sort_order");
      setServices((result.data ?? []) as Service[]);
    }
    void loadServices();
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setLoading(true);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const { error: insertError } = await getSupabaseBrowserClient().from("bookings").insert({
        customer_name: String(form.get("name") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        phone: String(form.get("phone") ?? "").trim(),
        service_id: String(form.get("service") ?? "") || null,
        requested_date: String(form.get("date") ?? ""),
        requested_time: String(form.get("time") ?? ""),
        notes: String(form.get("notes") ?? "").trim(),
      });
      if (insertError) throw insertError;
      setDone(true); formElement.reset();
    } catch (err) { setError(err instanceof Error ? err.message : "Your request could not be sent. Please try again."); }
    finally { setLoading(false); }
  }

  if (done) return <div className="public-form-success"><strong>Request received.</strong><p>Thanks. Mixbee will contact you to confirm the session time.</p></div>;

  return <form className="public-form" onSubmit={submit}>
    <div className="public-form-grid">
      <label>Your name<input name="name" required minLength={2} maxLength={120} placeholder="Full name"/></label>
      <label>Email address<input name="email" type="email" required maxLength={254} placeholder="you@example.com"/></label>
      <label>Phone / WhatsApp<input name="phone" required minLength={5} maxLength={40} placeholder="+233…"/></label>
      <label>Service<select name="service" defaultValue=""><option value="">Choose a service</option>{services.map(service => <option key={service.id} value={service.id}>{service.name}</option>)}</select></label>
      <label>Date<input name="date" type="date" required min={new Date().toISOString().slice(0,10)}/></label>
      <label>Preferred time<input name="time" required placeholder="e.g. 2:00 PM"/></label>
    </div>
    <label>Anything we should know?<textarea name="notes" rows={4} maxLength={3000} placeholder="Tell us a little about your session…"/></label>
    {error && <p className="public-form-error">{error}</p>}
    <button disabled={loading}>{loading ? "Sending request…" : "Request a session ↗"}</button>
    <small>This is a booking request, not a confirmed appointment. The studio will contact you to confirm.</small>
  </form>;
}
