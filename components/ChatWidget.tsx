"use client";

import { FormEvent, useEffect, useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type ChatMessage = { id: string; sender_type: string; message: string; created_at: string };
type SavedChat = { id: string; token: string; name: string };

const STORAGE_KEY = "mixbee-studio-chat-v1";

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [chat, setChat] = useState<SavedChat | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [name, setName] = useState("");
  const [draft, setDraft] = useState("");
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setChat(JSON.parse(saved) as SavedChat);
    } catch { localStorage.removeItem(STORAGE_KEY); }
  }, []);

  useEffect(() => {
    if (!chat) return;
    let alive = true;
    const load = async () => {
      const { data, error: loadError } = await getSupabaseBrowserClient().rpc("get_studio_chat_messages", {
        p_conversation_id: chat.id, p_access_token: chat.token,
      });
      if (!alive) return;
      if (loadError) { setError("This chat session is no longer available. Start a new conversation."); return; }
      setMessages((data ?? []) as ChatMessage[]);
    };
    void load();
    const timer = window.setInterval(() => void load(), 4000);
    return () => { alive = false; window.clearInterval(timer); };
  }, [chat]);

  async function startChat(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setStarting(true); setError("");
    try {
      const { data, error: startError } = await getSupabaseBrowserClient().rpc("start_studio_chat", { p_visitor_name: name.trim() });
      if (startError) throw startError;
      const first = Array.isArray(data) ? data[0] : data;
      const saved = { id: first.conversation_id, token: first.access_token, name: name.trim() };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      setChat(saved);
    } catch (err) { setError(err instanceof Error ? err.message : "Could not start chat."); }
    finally { setStarting(false); }
  }

  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!chat || !draft.trim()) return;
    const message = draft.trim(); setDraft(""); setError("");
    const { error: sendError } = await getSupabaseBrowserClient().rpc("send_studio_chat_message", {
      p_conversation_id: chat.id, p_access_token: chat.token, p_message: message,
    });
    if (sendError) { setError(sendError.message); setDraft(message); }
    else {
      const { data } = await getSupabaseBrowserClient().rpc("get_studio_chat_messages", { p_conversation_id: chat.id, p_access_token: chat.token });
      setMessages((data ?? []) as ChatMessage[]);
    }
  }

  function newChat() {
    localStorage.removeItem(STORAGE_KEY); setChat(null); setMessages([]); setError("");
  }

  return <div className="mixbee-chat">
    {open && <section className="mixbee-chat-panel" aria-label="Mixbee live chat">
      <header><div><strong>Talk to Mixbee</strong><small>Send us a message</small></div><button onClick={() => setOpen(false)} aria-label="Close chat"><X size={18}/></button></header>
      {!chat ? <form className="mixbee-chat-start" onSubmit={startChat}><p>Start a conversation with the studio. Leave your name so we know who we're speaking with.</p><label>Your name<input value={name} onChange={e => setName(e.target.value)} required minLength={2} maxLength={100} placeholder="Your name"/></label><button disabled={starting}>{starting ? "Starting…" : "Start chat"}</button></form> : <>
        <div className="mixbee-chat-messages">{messages.length === 0 && <p className="mixbee-chat-empty">You're connected. Send the first message whenever you're ready.</p>}{messages.map(message => <div key={message.id} className={`mixbee-chat-bubble ${message.sender_type === "visitor" ? "mine" : "theirs"}`}><p>{message.message}</p><small>{new Date(message.created_at).toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}</small></div>)}</div>
        <form className="mixbee-chat-compose" onSubmit={sendMessage}><input value={draft} onChange={e => setDraft(e.target.value)} maxLength={2000} placeholder="Write a message…" aria-label="Write a message"/><button disabled={!draft.trim()} aria-label="Send message"><Send size={17}/></button></form>
        <button className="mixbee-chat-new" onClick={newChat}>Start a new conversation</button>
      </>}
      {error && <p className="mixbee-chat-error">{error}</p>}
    </section>}
    <button className="mixbee-chat-launcher" onClick={() => setOpen(value => !value)} aria-label={open ? "Close chat" : "Chat with Mixbee"}>{open ? <X/> : <><MessageCircle/><span>Chat with us</span></>}</button>
  </div>;
}
