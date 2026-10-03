"use client";
import type { ReactNode } from "react";
import { BOY, CAT, GIRL, type Sprite } from "@/lib/sprites";

type Rect = [number, number, number, number];

function Layer({ rows, palette }: { rows: string[]; palette: Record<string, string> }) {
  const out: ReactNode[] = [];
  rows.forEach((row, y) => {
    let x = 0;
    while (x < row.length) {
      const c = row[x];
      if (c === ".") { x++; continue; }
      let w = 1;
      while (x + w < row.length && row[x + w] === c) w++;
      out.push(<rect key={`${x}-${y}`} x={x} y={y} width={w} height={1} fill={palette[c] ?? "#000"} />);
      x += w;
    }
  });
  return <>{out}</>;
}

const Rects = ({ list, fill }: { list: Rect[]; fill: string }) => (
  <>{list.map(([x, y, w, h], i) => <rect key={i} x={x} y={y} width={w} height={h} fill={fill} />)}</>
);

export function Avatar({ kind, happy, onClick, label }: { kind: "girl" | "boy"; happy: boolean; onClick: () => void; label: string }) {
  const s: Sprite = kind === "girl" ? GIRL : BOY;
  return (
    <button className={`avatar-btn ${kind} ${happy ? "happy" : ""}`} onClick={onClick} aria-label={label}>
      <svg viewBox="0 0 24 40" shapeRendering="crispEdges" className="avatar-svg">
        <ellipse cx="12" cy="39.6" rx="9" ry="1.2" fill="rgba(40,25,60,.25)" />
        <g className="avatar-body">
          <Layer rows={s.rows} palette={s.palette} />
          <g className="eyes"><Rects list={s.eyes as Rect[]} fill={s.eyeColor} /></g>
          <Rects list={(happy ? s.mouthHappy : s.mouth) as Rect[]} fill="#a5485c" />
        </g>
      </svg>
    </button>
  );
}

export function Cat({ onClick }: { onClick: () => void }) {
  return (
    <button className="cat-btn" onClick={onClick} aria-label="pet the cat">
      <svg viewBox="0 0 14 10" shapeRendering="crispEdges">
        <Layer rows={CAT.rows} palette={CAT.palette} />
      </svg>
    </button>
  );
}

/** Whole background scene: sky, city, cafe terrace with wooden chairs, concrete wall, handrail, steps. */
export function SceneArt() {
  return (
    <svg className="scene-art" viewBox="0 0 320 180" preserveAspectRatio="xMidYMax slice" shapeRendering="crispEdges">
      <defs>
        <pattern id="speck" width="8" height="8" patternUnits="userSpaceOnUse">
          <rect x="1" y="1" width="1" height="1" className="speck" />
          <rect x="5" y="4" width="1" height="1" className="speck2" />
          <rect x="3" y="7" width="1" height="1" className="speck" />
        </pattern>
      </defs>
      <rect width="320" height="40" className="sky1" /><rect y="40" width="320" height="30" className="sky2" /><rect y="70" width="320" height="30" className="sky3" />
      <g className="moon-sun"><rect x="246" y="20" width="16" height="16" className="sun" /><rect x="244" y="22" width="20" height="12" className="sun" /><rect x="248" y="18" width="12" height="20" className="sun" /></g>
      <g className="stars">{[[20,14],[60,30],[110,12],[170,26],[210,10],[290,34],[140,44],[40,52]].map(([x,y],i)=><rect key={i} x={x} y={y} width="2" height="2" className="star" style={{animationDelay:`${i*0.4}s`}} />)}</g>
      <g className="cloud cl1"><rect x="20" y="30" width="30" height="8" /><rect x="26" y="24" width="18" height="8" /><rect x="14" y="34" width="42" height="6" /></g>
      <g className="cloud cl2"><rect x="150" y="48" width="24" height="6" /><rect x="156" y="43" width="12" height="6" /><rect x="146" y="51" width="34" height="5" /></g>
      <g className="city">
        <rect x="0" y="62" width="26" height="40" /><rect x="30" y="52" width="20" height="50" /><rect x="54" y="68" width="30" height="34" /><rect x="190" y="58" width="24" height="44" /><rect x="218" y="70" width="28" height="32" /><rect x="262" y="56" width="22" height="46" /><rect x="288" y="66" width="32" height="36" />
        {[[6,68],[14,76],[36,60],[42,72],[60,76],[196,64],[204,76],[224,78],[268,62],[274,74],[296,74]].map(([x,y],i)=><rect key={i} x={x} y={y} width="4" height="5" className="win" />)}
      </g>
      {/* cafe terrace */}
      <rect x="0" y="96" width="320" height="6" className="deck" />
      <g className="rail"><rect x="38" y="62" width="4" height="40" /><rect x="150" y="62" width="4" height="40" /><rect x="262" y="62" width="4" height="40" /><rect x="0" y="82" width="320" height="3" /></g>
      <g className="table"><rect x="188" y="74" width="46" height="5" /><rect x="208" y="79" width="4" height="17" /><rect x="200" y="94" width="20" height="3" /></g>
      <g className="chair"><rect x="86" y="62" width="4" height="34" /><rect x="112" y="62" width="4" height="34" /><rect x="90" y="64" width="22" height="3" /><rect x="90" y="70" width="22" height="3" /><rect x="90" y="76" width="22" height="3" /><rect x="84" y="84" width="34" height="4" /><rect x="86" y="88" width="4" height="8" /><rect x="112" y="88" width="4" height="8" /></g>
      <g className="chair"><rect x="248" y="68" width="3" height="28" /><rect x="270" y="68" width="3" height="28" /><rect x="251" y="70" width="19" height="3" /><rect x="251" y="75" width="19" height="3" /><rect x="246" y="84" width="30" height="4" /><rect x="248" y="88" width="3" height="8" /><rect x="272" y="88" width="3" height="8" /></g>
      <g className="parasol"><rect x="188" y="40" width="46" height="4" /><rect x="194" y="36" width="34" height="4" /><rect x="198" y="32" width="26" height="4" /><rect x="209" y="44" width="3" height="30" className="pole" /></g>
      {/* string lights */}
      <path d="M0 8 Q 80 24 160 8 T 320 8" className="wire" fill="none" />
      {[[16,16],[48,20],[80,20],[112,17],[144,10],[176,10],[208,17],[240,20],[272,20],[304,16]].map(([x,y],i)=><rect key={i} x={x} y={y} width="4" height="5" className={`bulb b${i%3}`} />)}
      {/* concrete wall */}
      <rect y="102" width="320" height="78" className="wall" /><rect y="102" width="320" height="78" fill="url(#speck)" />
      <rect y="102" width="320" height="3" className="wall-top" />
      <rect x="40" y="116" width="30" height="14" className="patch" /><rect x="212" y="130" width="40" height="10" className="patch" />
      {/* handrail */}
      <g className="handrail"><polygon points="0,138 320,112 320,116 0,142" /><rect x="40" y="134" width="3" height="24" /><rect x="150" y="125" width="3" height="32" /><rect x="260" y="117" width="3" height="40" /></g>
      {/* ground + steps */}
      <rect y="156" width="320" height="24" className="landing" />
      <rect y="156" width="320" height="2" className="step-edge" />
      <rect y="164" width="320" height="3" className="step-edge" /><rect y="172" width="320" height="3" className="step-edge" />
      <rect y="158" width="320" height="6" className="step-a" /><rect y="167" width="320" height="5" className="step-b" /><rect y="175" width="320" height="5" className="step-a" />
      {/* potted plants */}
      <g className="plant"><rect x="12" y="140" width="12" height="16" className="pot" /><rect x="14" y="126" width="3" height="14" className="leaf" /><rect x="8" y="128" width="8" height="4" className="leaf" /><rect x="17" y="122" width="8" height="4" className="leaf" /><rect x="19" y="130" width="8" height="4" className="leaf" /></g>
      <g className="plant"><rect x="292" y="138" width="14" height="18" className="pot" /><rect x="298" y="120" width="3" height="18" className="leaf" /><rect x="290" y="122" width="10" height="5" className="leaf" /><rect x="300" y="116" width="10" height="5" className="leaf" /><rect x="302" y="128" width="10" height="5" className="leaf" /><rect x="296" y="112" width="5" height="5" className="flwr" /></g>
    </svg>
  );
}
