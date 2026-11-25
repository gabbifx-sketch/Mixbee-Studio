"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { ArrowLeft, Send, RefreshCw } from "lucide-react";
import "../admin.css";
import "./chat.css";

type Conversation = { id: string; visitor_name: string; status: string; created_at: string };
type ChatMessage = { id: string; sender_type: string; message: string; created_at: string };

export default function AdminChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadConversations = useCallback(async () => {
    const { data, error: queryError } = await getSupabaseBrowserClient().from("chat_conversations").select("id,visitor_name,status,created_at").order("created_at", { ascending: false }).limit(100);
    if (queryError) setError(queryError.message);
    else {
      const rows = (data ?? []) as Conversation[];
      setConversations(rows);
      if (!selected && rows.length) setSelected(rows[0].id);
    }
    setLoading(false);
  }, [selected]);

  const loadMessages = useCallback(async () => {
    if (!selected) { setMessages([]); return; }
    const { data, error: queryError } = await getSupabaseBrowserClient().from("chat_messages").select("id,sender_type,message,created_at").eq("conversation_id", selected).order("created_at", { ascending: true }).limit(200);
    if (queryError) setError(queryError.message); else setMessages((data ?? []) as ChatMessage[]);
  }, [selected]);

  useEffect(() => { void loadConversations(); const t=window.setInterval(() => void loadConversations(), 8000); return () => window.clearInterval(t); }, [loadConversations]);
  useEffect(() => { void loadMessages(); const t=window.setInterval(() => void loadMessages(), 3000); return () => window.clearInterval(t); }, [loadMessages]);

  async function reply(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!selected || !draft.trim()) return;
    const { data: { user } } = await getSupabaseBrowserClient().auth.getUser();
    if (!user) { setError("Please sign in again."); return; }
    const { error: insertError } = await getSupabaseBrowserClient().from("chat_messages").insert({ conversation_id:selected, sender_type:"admin", sender_user_id:user.id, message:draft.trim() });
    if (insertError) setError(insertError.message); else { setDraft(""); void loadMessages(); }
  }

  async function toggleStatus(conversation: Conversation) {
    const next = conversation.status === "open" ? "closed" : "open";
    const { error: updateError } = await getSupabaseBrowserClient().from("chat_conversations").update({status:next}).eq("id",conversation.id);
    if (updateError) setError(updateError.message); else void loadConversations();
  }

  const active = conversations.find(c => c.id === selected);

  return <main className="admin-dashboard">
    <header className="admin-topbar"><Link className="admin-brand" href="/admin">MIXBEE<span>.</span></Link><div className="admin-top-actions"><Link href="/admin" className="admin-quiet-button"><ArrowLeft size={16}/> Dashboard</Link></div></header>
    <section className="admin-content admin-chat-content">
      <div className="admin-heading-row"><div><div className="admin-kicker">CUSTOMER CONVERSATIONS</div><h1>Studio<br/><span>chat.</span></h1></div><button className="admin-refresh" onClick={() => {void loadConversations();void loadMessages();}}><RefreshCw size={16}/> Refresh</button></div>
      {error && <div className="admin-alert">{error}</div>}
      <div className="admin-chat-layout">
        <aside className="admin-chat-list">{loading ? <p>Loading chats…</p> : conversations.length===0 ? <p>No conversations yet.</p> : conversations.map(c=><button key={c.id} className={selected===c.id?"chosen":""} onClick={()=>setSelected(c.id)}><strong>{c.visitor_name}</strong><small>{new Date(c.created_at).toLocaleString()}</small><span>{c.status}</span></button>)}</aside>
        <section className="admin-chat-thread">
          {active ? <><div className="admin-chat-thread-head"><div><strong>{active.visitor_name}</strong><small>{active.status} conversation</small></div><button className="admin-quiet-button" onClick={()=>void toggleStatus(active)}>{active.status==="open"?"Close chat":"Reopen chat"}</button></div><div className="admin-chat-thread-messages">{messages.map(m=><div key={m.id} className={`admin-thread-bubble ${m.sender_type==="admin"?"sent":""}`}><p>{m.message}</p><small>{m.sender_type==="admin"?"You":"Visitor"} · {new Date(m.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>)}</div><form className="admin-chat-reply" onSubmit={reply}><input value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Write a reply…" maxLength={2000}/><button disabled={!draft.trim()}><Send size={17}/></button></form></> : <div className="admin-empty">Choose a conversation to read and reply.</div>}
        </section>
      </div>
    </section>
  </main>;
}
