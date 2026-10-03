"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { hasSupabase, supabase } from "@/lib/supabase";

type Memory = { id: number; emoji: string; title: string; date: string; text: string };
type Content = { coupleName: string; statusTitle: string; statusText: string; specialDate: string; favoriteThing: string; memories: Memory[] };
const DEFAULTS: Content = { coupleName: "YOU + ME ♡", statusTitle: "GOOD DAY TOGETHER! ♡", statusText: "MEMORIES LOADING...", specialDate: "05 / 23", favoriteThing: "GOING HOME TOGETHER", memories: [] };
const EMOJIS = ["💗", "🌷", "🍓", "🌙", "🐱", "🧋", "🍜", "📸", "🎬", "🏠", "✨", "🎂"];

export default function EditPage() {
  const [data, setData] = useState<Content>(DEFAULTS);
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState(""), [password, setPassword] = useState("");
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const [error, setError] = useState(""), [saved, setSaved] = useState(false), [saving, setSaving] = useState(false), [dirty, setDirty] = useState(false), [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasSupabase) { setLoading(false); return; }
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => subscription.unsubscribe();
  }, []);

  const load = useCallback(async () => {
    const { data: c } = await supabase.from("site_content").select("*").eq("id", 1).maybeSingle();
    const { data: m } = await supabase.from("memories").select("*").order("sort_order", { ascending: true }).order("id", { ascending: true });
    setData({
      ...(c ? { coupleName: c.couple_name, statusTitle: c.status_title, statusText: c.status_text, specialDate: c.special_date, favoriteThing: c.favorite_thing } : DEFAULTS),
      memories: (m || []).map((x: any) => ({ id: x.id, emoji: x.emoji, title: x.title, date: x.memory_date, text: x.story })),
    });
    setDirty(false);
  }, []);
  useEffect(() => { if (session) load(); }, [session, load]);

  // warn before leaving with unsaved changes
  useEffect(() => {
    if (!dirty) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h); return () => window.removeEventListener("beforeunload", h);
  }, [dirty]);

  const auth = async () => {
    setError("");
    const r = authMode === "login" ? await supabase.auth.signInWithPassword({ email, password }) : await supabase.auth.signUp({ email, password });
    if (r.error) setError(r.error.message);
    else if (authMode === "signup") setError("Account created. If email confirmation is enabled, check your email, then log in.");
  };

  const save = async () => {
    setError(""); setSaving(true);
    try {
      const { error: e } = await supabase.from("site_content").upsert({ id: 1, couple_name: data.coupleName, status_title: data.statusTitle, status_text: data.statusText, special_date: data.specialDate, favorite_thing: data.favoriteThing, updated_at: new Date().toISOString() });
      if (e) throw e;
      const old = await supabase.from("memories").select("id");
      if (old.error) throw old.error;
      const keep = new Set(data.memories.map(m => m.id));
      for (const row of old.data || []) if (!keep.has(row.id)) { const { error: de } = await supabase.from("memories").delete().eq("id", row.id); if (de) throw de; }
      const next: Memory[] = [];
      for (let i = 0; i < data.memories.length; i++) {
        const m = data.memories[i];
        const payload = { emoji: m.emoji || "💗", title: m.title || "Untitled", memory_date: m.date, story: m.text, sort_order: i + 1 };
        if (m.id < 0) {
          const { data: row, error: ie } = await supabase.from("memories").insert(payload).select().single();
          if (ie) throw ie; next.push({ ...m, id: row.id });
        } else {
          const { error: ue } = await supabase.from("memories").update(payload).eq("id", m.id);
          if (ue) throw ue; next.push(m);
        }
      }
      setData(d => ({ ...d, memories: next })); setDirty(false); setSaved(true); setTimeout(() => setSaved(false), 2000);
    } catch (err: any) { setError(err?.message || "Failed to save."); }
    setSaving(false);
  };

  const edit = (fn: (d: Content) => Content) => { setData(fn); setDirty(true); };
  const change = (k: keyof Content, v: string) => edit(d => ({ ...d, [k]: v }));
  const cm = (i: number, k: keyof Memory, v: string) => edit(d => ({ ...d, memories: d.memories.map((m, j) => (i === j ? { ...m, [k]: v } : m)) }));
  const add = () => edit(d => ({ ...d, memories: [...d.memories, { id: -Date.now(), emoji: "💗", title: "New memory", date: new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" }), text: "Write your story here..." }] }));
  const remove = (i: number) => { if (confirm(`Hapus "${data.memories[i].title}"?`)) edit(d => ({ ...d, memories: d.memories.filter((_, j) => j !== i) })); };
  const move = (i: number, dir: -1 | 1) => edit(d => { const a = [...d.memories], j = i + dir; if (j < 0 || j >= a.length) return d; [a[i], a[j]] = [a[j], a[i]]; return { ...d, memories: a }; });

  const shell = (children: React.ReactNode) => <main className="editor-page"><div className="editor-shell">{children}</div></main>;
  if (loading) return shell(<section className="editor-card">LOADING...</section>);
  if (!hasSupabase) return shell(<section className="editor-card"><h2>SUPABASE NOT CONNECTED</h2><p>Add the Supabase environment variables to run the editor.</p></section>);
  if (!session) return shell(<>
    <header className="editor-header"><div><span className="editor-kicker">PIXEL MEMORY</span><h1>♡ PRIVATE EDITOR</h1><p>Login untuk mengubah website couple.</p></div><Link href="/">← WEBSITE</Link></header>
    <section className="editor-card auth-card">
      <h2>{authMode === "login" ? "LOGIN" : "CREATE ACCOUNT"}</h2>
      <label>Email<input type="email" value={email} onChange={e => setEmail(e.target.value)} /></label>
      <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === "Enter" && auth()} /></label>
      {error && <div className="error-box">{error}</div>}
      <button className="save-btn" onClick={auth}>{authMode === "login" ? "LOGIN ♡" : "CREATE ACCOUNT"}</button>
      <button className="text-btn" onClick={() => { setAuthMode(v => (v === "login" ? "signup" : "login")); setError(""); }}>{authMode === "login" ? "Belum punya akun? Create account" : "Sudah punya akun? Login"}</button>
    </section>
  </>);

  return shell(<>
    <header className="editor-header">
      <div><span className="editor-kicker">PIXEL MEMORY</span><h1>✎ EDIT WEBSITE</h1><p>Perubahan disimpan ke database dan terlihat untuk semua pengunjung.</p></div>
      <div className="editor-head-actions"><button onClick={() => supabase.auth.signOut()}>LOGOUT</button><Link href="/">← WEBSITE</Link></div>
    </header>
    <section className="editor-card">
      <h2>♡ MAIN TEXT</h2>
      <label>Nama / pasangan<input value={data.coupleName} onChange={e => change("coupleName", e.target.value)} /></label>
      <label>Judul status<input value={data.statusTitle} onChange={e => change("statusTitle", e.target.value)} /></label>
      <label>Teks status<input value={data.statusText} onChange={e => change("statusText", e.target.value)} /></label>
      <label>Tanggal spesial (contoh: 05/23 atau 2024-05-23 → ada hitungan hari bersama)<input value={data.specialDate} onChange={e => change("specialDate", e.target.value)} /></label>
      <label>Hal favorit<input value={data.favoriteThing} onChange={e => change("favoriteThing", e.target.value)} /></label>
    </section>
    <section className="editor-card">
      <div className="section-title"><div><h2>♡ MEMORY BOOK</h2><p>Tambah, ubah, urutkan, atau hapus cerita.</p></div><button className="add-btn" onClick={add}>+ ADD MEMORY</button></div>
      <div className="editor-memories">
        {data.memories.map((m, i) => (
          <article className="editor-memory" key={m.id}>
            <div className="memory-number">#{String(i + 1).padStart(2, "0")}<div className="move-btns"><button onClick={() => move(i, -1)} disabled={i === 0} aria-label="up">▲</button><button onClick={() => move(i, 1)} disabled={i === data.memories.length - 1} aria-label="down">▼</button></div></div>
            <div className="memory-fields">
              <div className="two-fields"><label>Emoji<input value={m.emoji} onChange={e => cm(i, "emoji", e.target.value)} /></label><label>Tanggal<input value={m.date} onChange={e => cm(i, "date", e.target.value)} /></label></div>
              <div className="emoji-row">{EMOJIS.map(e => <button key={e} type="button" onClick={() => cm(i, "emoji", e)}>{e}</button>)}</div>
              <label>Judul<input value={m.title} onChange={e => cm(i, "title", e.target.value)} /></label>
              <label>Cerita<textarea rows={3} value={m.text} onChange={e => cm(i, "text", e.target.value)} /></label>
            </div>
            <button className="delete-btn" onClick={() => remove(i)}>DELETE</button>
          </article>
        ))}
        {!data.memories.length && <p className="empty-note">Belum ada memori. Klik + ADD MEMORY ♡</p>}
      </div>
    </section>
    {error && <div className="error-box">{error}</div>}
    <div className="editor-actions">
      {dirty && <span className="dirty">● BELUM DISIMPAN</span>}
      <button className="save-btn" onClick={save} disabled={saving}>{saving ? "SAVING..." : saved ? "✓ SAVED TO DATABASE!" : "SAVE TO DATABASE ♡"}</button>
      <Link href="/">VIEW WEBSITE →</Link>
    </div>
  </>);
}
