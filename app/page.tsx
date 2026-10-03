"use client";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { hasSupabase, supabase } from "@/lib/supabase";
import { Avatar, Cat, SceneArt } from "./components/Pixel";

type Tab = "status" | "feed" | "play" | "info";
type Memory = { id: number; emoji: string; title: string; date: string; text: string };
type Content = { coupleName: string; statusTitle: string; statusText: string; specialDate: string; favoriteThing: string; memories: Memory[] };
type Who = "girl" | "boy" | "cat";

const DEFAULTS: Content = {
  coupleName: "YOU + ME ♡", statusTitle: "GOOD DAY TOGETHER! ♡", statusText: "MEMORIES LOADING...", specialDate: "05 / 23", favoriteThing: "GOING HOME TOGETHER",
  memories: [
    { id: 1, emoji: "🌷", title: "First little walk", date: "05/23", text: "A tiny walk, a silly smile, and a pocket full of memories." },
    { id: 2, emoji: "🍓", title: "Sweet afternoon", date: "05/18", text: "Shared snacks taste better when we steal bites from each other." },
    { id: 3, emoji: "🌙", title: "Late-night talk", date: "05/11", text: "The night was quiet, but somehow we talked until it wasn't." },
  ],
};

const FOODS = [
  { id: "cookie", emoji: "🍪", name: "COOKIE", cost: 2, mood: 8, love: 2 },
  { id: "berry", emoji: "🍓", name: "STRAWBERRY", cost: 3, mood: 12, love: 3 },
  { id: "boba", emoji: "🧋", name: "BOBA", cost: 5, mood: 20, love: 5 },
  { id: "ramen", emoji: "🍜", name: "RAMEN", cost: 8, mood: 35, love: 8 },
];
const LINES: Record<Who, string[]> = {
  girl: ["HEHE, YOU'RE HERE! ♡", "HOLD MY HAND?", "SNACK TIME SOON?", "I LOVE THIS PLACE ✿", "MY GLASSES ARE FOGGY ☺", "LET'S TAKE A PHOTO!"],
  boy: ["...YOU'RE CUTE.", "WANNA GO HOME TOGETHER?", "I'LL CARRY YOUR BAG.", "STAY WITH ME ♡", "ONE MORE STEP, OK?", "*BLUSHES*"],
  cat: ["MEOW ♡", "PURRRR...", "MROW? (SNACK?)", "*HEADBUTT*"],
};
const FALLBACK_EMOJI = ["🌷", "🍓", "🌙", "🐱", "🧋", "💌", "🌸", "⭐"];
const SAVE_KEY = "pixel-memory-save-v2";
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)];
const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5);
const todayKey = () => new Date().toISOString().slice(0, 10);

/** Understands "05 / 23" (MM/DD), "23/05" , "2024-05-23", "23/05/2024". */
function parseSpecial(s: string) {
  const n = (s.match(/\d+/g) || []).map(Number);
  if (n.length < 2) return null;
  let y: number | undefined, m: number, d: number;
  if (n.length >= 3 && String(n[0]).length === 4) [y, m, d] = n;
  else if (n.length >= 3 && String(n[2]).length === 4) { y = n[2]; if (n[1] > 12) { m = n[0]; d = n[1]; } else { d = n[0]; m = n[1]; } }
  else if (n[0] > 12) { d = n[0]; m = n[1]; } else { m = n[0]; d = n[1]; }
  if (m < 1 || m > 12 || d < 1 || d > 31) return null;
  const now = new Date(); const t0 = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let next = new Date(now.getFullYear(), m - 1, d); if (next < t0) next = new Date(now.getFullYear() + 1, m - 1, d);
  const until = Math.round((next.getTime() - t0.getTime()) / 864e5);
  const together = y ? Math.floor((t0.getTime() - new Date(y, m - 1, d).getTime()) / 864e5) : null;
  return { until, together };
}

export default function Home() {
  const [tab, setTab] = useState<Tab>("status");
  const [content, setContent] = useState<Content>(DEFAULTS);
  const [night, setNight] = useState(false);
  const [love, setLove] = useState(128), [coins, setCoins] = useState(6), [mood, setMood] = useState(86);
  const [best, setBest] = useState(0), [streak, setStreak] = useState(0), [lastDaily, setLastDaily] = useState("");
  const [toast, setToast] = useState(""), [now, setNow] = useState(""), [memoryOpen, setMemoryOpen] = useState(false), [loading, setLoading] = useState(true);
  const [bubble, setBubble] = useState<{ who: Who; text: string } | null>(null);
  const [happy, setHappy] = useState(false), [hearts, setHearts] = useState<{ id: number; x: number; e: string }[]>([]);
  const [game, setGame] = useState<"hunt" | "match">("hunt");
  const [hunt, setHunt] = useState<{ heart: number; picked: number[]; done: boolean } | null>(null);
  const [cards, setCards] = useState<{ e: string }[]>([]), [flip, setFlip] = useState<number[]>([]), [matched, setMatched] = useState<number[]>([]), [moves, setMoves] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const uid = useRef(0), tBubble = useRef<ReturnType<typeof setTimeout>>(undefined), tToast = useRef<ReturnType<typeof setTimeout>>(undefined), tHappy = useRef<ReturnType<typeof setTimeout>>(undefined);

  const level = Math.floor(love / 30) + 1, xp = ((love % 30) / 30) * 100;
  const special = parseSpecial(content.specialDate);
  const dailyReady = lastDaily !== todayKey();

  const notify = useCallback((s: string) => { setToast(s); clearTimeout(tToast.current); tToast.current = setTimeout(() => setToast(""), 1900); }, []);
  const say = useCallback((who: Who, text: string) => { setBubble({ who, text }); clearTimeout(tBubble.current); tBubble.current = setTimeout(() => setBubble(null), 2600); }, []);
  const spawn = useCallback((n: number, e = "♥") => {
    const list = Array.from({ length: n }, () => ({ id: ++uid.current, x: 30 + Math.random() * 40, e }));
    setHearts(h => [...h, ...list]); setTimeout(() => setHearts(h => h.filter(x => !list.includes(x))), 1600);
  }, []);
  const cheer = useCallback(() => { setHappy(true); clearTimeout(tHappy.current); tHappy.current = setTimeout(() => setHappy(false), 1400); }, []);
  const gain = useCallback((n = 1, e = "♥") => {
    setLove(v => { const nv = v + n; if (Math.floor(nv / 30) > Math.floor(v / 30)) setTimeout(() => notify(`LEVEL UP! L.V. ${Math.floor(nv / 30) + 1} ★`), 300); return nv; });
    setMood(v => Math.min(100, v + 1)); spawn(Math.min(5, n + 1), e); cheer();
  }, [cheer, notify, spawn]);

  // ---- load saved game + Supabase content
  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (s) {
        setLove(s.love ?? 128); setCoins(s.coins ?? 6); setBest(s.best ?? 0); setLastDaily(s.lastDaily ?? "");
        const hours = (Date.now() - (s.seen ?? Date.now())) / 36e5;
        setMood(Math.max(25, Math.round((s.mood ?? 86) - Math.min(45, hours * 3))));
        if (hours > 6) setTimeout(() => notify("WELCOME BACK! WE MISSED YOU ♡"), 700);
      }
    } catch {}
    const h = new Date().getHours(); setNight(h >= 18 || h < 5); setLoaded(true);
    const load = async () => {
      if (!hasSupabase) { setLoading(false); return; }
      const { data: c } = await supabase.from("site_content").select("*").eq("id", 1).maybeSingle();
      const { data: m } = await supabase.from("memories").select("*").order("sort_order", { ascending: true }).order("id", { ascending: true });
      setContent(v => ({
        ...v,
        ...(c ? { coupleName: c.couple_name, statusTitle: c.status_title, statusText: c.status_text, specialDate: c.special_date, favoriteThing: c.favorite_thing } : {}),
        ...(m && m.length ? { memories: m.map((x: any) => ({ id: x.id, emoji: x.emoji, title: x.title, date: x.memory_date, text: x.story })) } : {}),
      }));
      setLoading(false);
    };
    load();
    const tick = () => setNow(new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })); tick();
    const clock = setInterval(tick, 30000), decay = setInterval(() => setMood(v => Math.max(10, v - 1)), 60000);
    return () => { clearInterval(clock); clearInterval(decay); };
  }, [notify]);
  useEffect(() => { if (loaded) try { localStorage.setItem(SAVE_KEY, JSON.stringify({ love, coins, mood, best, lastDaily, seen: Date.now() })); } catch {} }, [love, coins, mood, best, lastDaily, loaded]);

  // ---- actions
  const touch = (who: Who) => { say(who, pick(LINES[who])); gain(who === "cat" ? 1 : 2, who === "cat" ? "🐾" : "♥"); };
  const daily = () => { if (!dailyReady) return notify("COME BACK TOMORROW ♡"); setLastDaily(todayKey()); setCoins(v => v + 5); gain(10, "💋"); notify("DAILY KISS! +10 LOVE +5 ★"); say("boy", "GOOD MORNING, SWEETIE."); };
  const remember = () => { const m = pick<Memory>(content.memories); if (!m) return notify("NO MEMORIES YET"); say("girl", `${m.emoji} ${m.title.toUpperCase()}`); gain(2, m.emoji); };
  const eat = (f: (typeof FOODS)[number]) => {
    if (coins < f.cost) return notify("NOT ENOUGH ★ — PLAY A GAME!");
    setCoins(v => v - f.cost); setMood(v => Math.min(100, v + f.mood)); gain(f.love, f.emoji); say(pick(["girl", "boy"] as Who[]), `YUM! ${f.emoji}`); notify(`YUM! +${f.love} LOVE • +${f.mood} MOOD`);
  };
  const startHunt = () => { setHunt({ heart: Math.floor(Math.random() * 9), picked: [], done: false }); };
  const tapHunt = (i: number) => {
    if (!hunt || hunt.done || hunt.picked.includes(i)) return;
    if (i === hunt.heart) {
      const reward = 2 + Math.min(streak, 4), ns = streak + 1;
      setHunt({ ...hunt, picked: [...hunt.picked, i], done: true }); setStreak(ns); setBest(b => Math.max(b, ns)); setCoins(v => v + reward); gain(5, "💖"); notify(`FOUND IT! +${reward} ★ (STREAK ${ns})`);
    } else {
      const picked = [...hunt.picked, i], lost = picked.length >= 3;
      setHunt({ ...hunt, picked, done: lost }); if (lost) { setStreak(0); notify("OH NO! TRY AGAIN ♡"); } else notify(`NOT HERE... ${3 - picked.length} TRIES LEFT`);
    }
  };
  const startMatch = () => {
    const pool = Array.from(new Set([...content.memories.map(m => m.emoji), ...FALLBACK_EMOJI])).slice(0, 6);
    setCards(shuffle([...pool, ...pool].map(e => ({ e })))); setFlip([]); setMatched([]); setMoves(0);
  };
  const tapCard = (i: number) => {
    if (flip.length >= 2 || flip.includes(i) || matched.includes(i)) return;
    const nf = [...flip, i]; setFlip(nf);
    if (nf.length === 2) {
      setMoves(v => v + 1);
      const ok = cards[nf[0]].e === cards[nf[1]].e;
      setTimeout(() => {
        if (ok) {
          const nm = [...matched, ...nf]; setMatched(nm); gain(2, cards[nf[0]].e);
          if (nm.length === cards.length) { const r = moves + 1 <= 10 ? 6 : 4; setCoins(v => v + r); gain(8, "🎉"); notify(`ALL MATCHED! +${r} ★`); }
        }
        setFlip([]);
      }, ok ? 350 : 800);
    }
  };
  useEffect(() => { if (tab === "play") { if (game === "hunt" && !hunt) startHunt(); if (game === "match" && !cards.length) startMatch(); } }, [tab, game]); // eslint-disable-line react-hooks/exhaustive-deps

  const title = tab === "status" ? content.statusTitle : tab === "feed" ? "LITTLE TREATS ♡" : tab === "play" ? "LET'S PLAY! ♡" : "OUR LITTLE WORLD ♡";
  const sub = tab === "status" ? `${content.statusText} ${love} LOVE` : tab === "feed" ? `★ ${coins} COINS • MOOD ${mood}%` : tab === "play" ? `★ ${coins} • STREAK ${streak} • BEST ${best}` : "TWO PEOPLE • ONE PIXEL UNIVERSE";
  const batt = Math.max(1, Math.ceil(mood / 25));

  return (
    <main className={`page ${night ? "page-night" : ""}`}>
      <section className="device">
        <header className="topbar">
          <button className="top-heart" onClick={() => { gain(1); notify("MEMORY SAVED! ♡"); }} aria-label="love">♥</button>
          <strong>L.V. {String(level).padStart(2, "0")}</strong>
          <span>{new Date().toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" })}</span><span>{now || "06:30 PM"}</span>
          <div className="battery" title={`mood ${mood}%`}>{[0, 1, 2, 3].map(i => <i key={i} className={i < batt ? "on" : ""} />)}</div>
        </header>

        <section className="screen">
          <div className={`scene ${night ? "night" : ""} ${happy ? "is-happy" : ""}`}>
            <SceneArt />
            {Array.from({ length: 9 }, (_, i) => <i key={i} className="petal" style={{ left: `${(i * 37) % 100}%`, animationDelay: `${i * 0.9}s`, animationDuration: `${7 + (i % 4)}s` }}>{night ? "✦" : "✿"}</i>)}
            <span className="butterfly bf1">🦋</span><span className="butterfly bf2">🦋</span>
            <div className="cat-wrap"><Cat onClick={() => touch("cat")} /></div>
            <div className="pair">
              <Avatar kind="girl" happy={happy} onClick={() => touch("girl")} label="girl" />
              <span className="pair-heart">♥</span>
              <Avatar kind="boy" happy={happy} onClick={() => touch("boy")} label="boy" />
            </div>
            {bubble && <div className={`bubble bubble-${bubble.who}`}>{bubble.text}</div>}
            {hearts.map(h => <i key={h.id} className="fheart" style={{ left: `${h.x}%` }}>{h.e}</i>)}
            <button className="mode-btn" onClick={() => setNight(v => !v)}>{night ? "☼ DAY" : "☾ NIGHT"}</button>
          </div>

          <div className="message">
            <div><strong>{title}</strong><span>{sub}</span></div>
            <button onClick={remember} aria-label="remember">☺</button>
          </div>

          {tab === "status" && (
            <div className="panel status-panel">
              <div className="stat wide"><span>L.V. {level} • LOVE {love}</span><div className="bar"><i style={{ width: `${xp}%` }} /></div></div>
              <div className="stat"><span>MOOD</span><b>{mood}%</b><div className="bar mood"><i style={{ width: `${mood}%` }} /></div></div>
              <div className="stat"><span>COINS</span><b>★ {coins}</b></div>
              <div className="stat"><span>MEMORIES</span><b>{content.memories.length}</b></div>
              {special && <div className="stat wide days"><span>{special.until === 0 ? "TODAY IS OUR DAY!" : "NEXT SPECIAL DAY IN"}</span><b>{special.until === 0 ? "🎉 ♡ 🎉" : `${special.until} DAYS`}{special.together !== null && <small> • DAY {special.together + 1} TOGETHER</small>}</b></div>}
              <button className={`wide-btn ${dailyReady ? "glow" : ""}`} onClick={daily}>{dailyReady ? "💋 DAILY KISS (+10 ♥ +5 ★)" : "💤 DAILY KISS DONE"}</button>
              <button className="wide-btn" onClick={() => setMemoryOpen(true)}>♡ OPEN MEMORY BOOK</button>
            </div>
          )}

          {tab === "feed" && (
            <div className="panel feed-panel">
              {FOODS.map(f => (
                <div className="food-card" key={f.id}>
                  <span>{f.emoji}</span><div><b>{f.name}</b><small>+{f.love} LOVE • +{f.mood} MOOD</small></div>
                  <button className={coins < f.cost ? "off" : ""} onClick={() => eat(f)}>★ {f.cost}</button>
                </div>
              ))}
              <p className="hint">EARN ★ BY PLAYING GAMES & DAILY KISS</p>
            </div>
          )}

          {tab === "play" && (
            <div className="panel play-panel">
              <div className="seg"><button className={game === "hunt" ? "active" : ""} onClick={() => setGame("hunt")}>♥ HEART HUNT</button><button className={game === "match" ? "active" : ""} onClick={() => setGame("match")}>▣ MATCH</button></div>
              {game === "hunt" && hunt && (
                <>
                  <p>{hunt.done ? (hunt.picked.includes(hunt.heart) ? "YOU FOUND THE HEART! ♡" : "IT WAS HIDING HERE...") : `FIND THE HIDDEN HEART • ${3 - hunt.picked.length} TRIES`}</p>
                  <div className="hunt-grid">
                    {Array.from({ length: 9 }, (_, i) => {
                      const shown = hunt.picked.includes(i) || (hunt.done && i === hunt.heart);
                      return <button key={i} className={`tile ${shown ? "shown" : ""}`} onClick={() => tapHunt(i)}>{shown ? (i === hunt.heart ? "💖" : "✕") : "?"}</button>;
                    })}
                  </div>
                  <button className="wide-btn" onClick={startHunt}>{hunt.done ? "▶ PLAY AGAIN" : "↻ NEW ROUND"}</button>
                </>
              )}
              {game === "match" && (
                <>
                  <p>MATCH THE PAIRS • MOVES {moves}</p>
                  <div className="match-grid">
                    {cards.map((c, i) => {
                      const open = flip.includes(i) || matched.includes(i);
                      return <button key={i} className={`tile card ${open ? "shown" : ""} ${matched.includes(i) ? "done" : ""}`} onClick={() => tapCard(i)}>{open ? c.e : "♡"}</button>;
                    })}
                  </div>
                  <button className="wide-btn" onClick={startMatch}>{matched.length === cards.length && cards.length ? "▶ PLAY AGAIN" : "↻ SHUFFLE"}</button>
                </>
              )}
            </div>
          )}

          {tab === "info" && (
            <div className="panel info-panel">
              <div><span>COUPLE</span><b>{content.coupleName}</b></div>
              <div><span>SPECIAL DATE</span><b>{content.specialDate}</b></div>
              <div><span>FAVORITE THING</span><b>{content.favoriteThing}</b></div>
              <div><span>BEST STREAK</span><b>{best} ♥</b></div>
              <div><span>TIP</span><b>TAP US & THE CAT!</b></div>
            </div>
          )}
        </section>

        <nav className="bottom-nav">
          {(["status", "feed", "play", "info"] as Tab[]).map(t => (
            <button key={t} className={tab === t ? "active" : ""} onClick={() => setTab(t)}>
              <span className="nav-icon">{t === "status" ? "💗" : t === "feed" ? "🍓" : t === "play" ? "🎮" : "💌"}</span><span>{t.toUpperCase()}</span>
            </button>
          ))}
        </nav>
        <div className="utility-bar">
          <button onClick={() => setNight(v => !v)}>☼ {night ? "DAY" : "NIGHT"}</button>
          <button onClick={() => setMemoryOpen(true)}>▣ MEMORIES</button>
          <Link href="/edit">✎ EDIT WEBSITE</Link>
        </div>
      </section>

      <p className="footer-note">{loading ? "LOADING..." : `PIXEL MEMORY • ${content.coupleName} ♡`}</p>
      {toast && <div className="toast">{toast}</div>}

      {memoryOpen && (
        <div className="modal-backdrop" onClick={() => setMemoryOpen(false)}>
          <div className="memory-book" onClick={e => e.stopPropagation()}>
            <button className="close" onClick={() => setMemoryOpen(false)}>×</button>
            <h2>♡ MEMORY BOOK ♡</h2><p className="book-sub">little moments worth keeping • tap a card to hug it</p>
            <div className="memory-list">
              {content.memories.map((m, i) => (
                <article className="memory-card" key={m.id} onClick={() => gain(1, m.emoji)}>
                  <div className="memory-pixel">{m.emoji}</div>
                  <div><b>{m.title}</b><small>{m.date} • MEMORY #{String(i + 1).padStart(2, "0")}</small><p>{m.text}</p></div>
                </article>
              ))}
              {!content.memories.length && <p className="book-sub">NO MEMORIES YET — ADD SOME IN THE EDITOR ♡</p>}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
