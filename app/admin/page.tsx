"use client";

import { useCallback, useEffect, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { CalendarDays, Mail, RefreshCw, LogOut, Check, Clock3 } from "lucide-react";
import "./admin.css";

type Booking = {
  id: string; customer_name: string; email: string; phone: string;
  requested_date: string; requested_time: string; status: string; notes: string;
  services?: { name: string } | null;
};
type Message = { id: string; name: string; email: string; subject: string; message: string; status: string; created_at: string };

export default function AdminDashboard() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [tab, setTab] = useState<"bookings" | "messages">("bookings");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const supabase = getSupabaseBrowserClient();
      const [{ data: bookingRows, error: bookingError }, { data: messageRows, error: messageError }] = await Promise.all([
        supabase.from("bookings").select("id,customer_name,email,phone,requested_date,requested_time,status,notes,services(name)").order("created_at", { ascending: false }).limit(100),
        supabase.from("contact_messages").select("id,name,email,subject,message,status,created_at").order("created_at", { ascending: false }).limit(100),
      ]);
      if (bookingError) throw bookingError;
      if (messageError) throw messageError;
      setBookings((bookingRows ?? []) as unknown as Booking[]);
      setMessages((messageRows ?? []) as Message[]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load the dashboard.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void loadData(); }, [loadData]);

  async function updateBooking(id: string, status: string) {
    const { error: updateError } = await getSupabaseBrowserClient().from("bookings").update({ status }).eq("id", id);
    if (updateError) setError(updateError.message); else void loadData();
  }

  async function updateMessage(id: string, status: string) {
    const { error: updateError } = await getSupabaseBrowserClient().from("contact_messages").update({ status }).eq("id", id);
    if (updateError) setError(updateError.message); else void loadData();
  }

  async function signOut() {
    await getSupabaseBrowserClient().auth.signOut();
    window.location.href = "/admin/login";
  }

  const pending = bookings.filter(b => b.status === "pending").length;
  const unread = messages.filter(m => m.status === "unread").length;

  return <main className="admin-dashboard">
    <header className="admin-topbar">
      <a className="admin-brand" href="/">MIXBEE<span>.</span></a>
      <div className="admin-top-actions"><span>STUDIO ADMIN</span><a className="admin-quiet-button" href="/admin/chat">Live chat</a><button className="admin-quiet-button" onClick={signOut}><LogOut size={16}/> Sign out</button></div>
    </header>
    <section className="admin-content">
      <div className="admin-heading-row"><div><div className="admin-kicker">YOUR STUDIO, AT A GLANCE</div><h1>Good to have<br/><span>you back.</span></h1></div><button className="admin-refresh" onClick={() => void loadData()}><RefreshCw size={16}/> Refresh</button></div>
      <div className="admin-stats">
        <div className="admin-stat"><CalendarDays/><span>BOOKINGS</span><strong>{bookings.length}</strong><small>{pending} awaiting response</small></div>
        <div className="admin-stat"><Mail/><span>CONTACT MESSAGES</span><strong>{messages.length}</strong><small>{unread} unread messages</small></div>
        <div className="admin-stat"><Clock3/><span>NEEDS ATTENTION</span><strong>{pending + unread}</strong><small>Items to review</small></div>
      </div>
      <div className="admin-tabs">
        <button className={tab === "bookings" ? "active" : ""} onClick={() => setTab("bookings")}>Bookings <b>{pending}</b></button>
        <button className={tab === "messages" ? "active" : ""} onClick={() => setTab("messages")}>Messages <b>{unread}</b></button>
      </div>
      {error && <div className="admin-alert">{error}</div>}
      {loading ? <div className="admin-empty">Loading studio activity…</div> : tab === "bookings" ? <div className="admin-records">
        {bookings.length === 0 ? <div className="admin-empty">No bookings yet. New session requests will appear here.</div> : bookings.map(booking => <article className="admin-record" key={booking.id}>
          <div className="admin-record-main"><div className="admin-record-meta">{booking.requested_date} · {booking.requested_time} <span className={`status status-${booking.status}`}>{booking.status}</span></div><h2>{booking.customer_name}</h2><p>{booking.services?.name ?? "Studio session"} · {booking.email} · {booking.phone}</p>{booking.notes && <p className="record-notes">{booking.notes}</p>}</div>
          <div className="admin-record-actions">{booking.status === "pending" && <button onClick={() => void updateBooking(booking.id, "confirmed")}><Check size={15}/> Confirm</button>}{booking.status !== "completed" && booking.status !== "cancelled" && <button className="secondary" onClick={() => void updateBooking(booking.id, "completed")}>Complete</button>}{booking.status !== "cancelled" && <button className="text-action" onClick={() => void updateBooking(booking.id, "cancelled")}>Cancel</button>}</div>
        </article>)}
      </div> : <div className="admin-records">
        {messages.length === 0 ? <div className="admin-empty">No messages yet. Contact form enquiries will appear here.</div> : messages.map(message => <article className="admin-record" key={message.id}>
          <div className="admin-record-main"><div className="admin-record-meta">{new Date(message.created_at).toLocaleString()} <span className={`status status-${message.status}`}>{message.status}</span></div><h2>{message.subject}</h2><p>{message.name} · {message.email}</p><p className="record-notes">{message.message}</p></div>
          <div className="admin-record-actions">{message.status !== "read" && <button onClick={() => void updateMessage(message.id, "read")}><Check size={15}/> Mark read</button>}<a className="admin-reply" href={`mailto:${encodeURIComponent(message.email)}?subject=${encodeURIComponent("Re: " + message.subject)}`}>Reply by email ↗</a></div>
        </article>)}
      </div>}
    </section>
  </main>;
}
