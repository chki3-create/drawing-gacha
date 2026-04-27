import React, { useState, useEffect, useRef } from "react";

const prompts = [
  "侍の猫","空を飛ぶパン","未来都市の高校生","地下都市","宇宙猫",
  "ドラゴン牧場","ホラーな水族館","未来の東京","海底列車","夢の世界の入口",
  "魔法使いのコンビニ","時間が止まった図書館","空中に浮かぶ神社","巨大な亀の背中の街","雨の降らない雲の上",
  "サメに乗る郵便配達員","月面の温泉旅館","機械仕掛けの桜","砂漠のラーメン屋","妖怪だらけの学校",
  "逆さまに建つ城","氷の森の狐","カエルの騎士団","巨大ロボットと子猫","夜光る植物の庭",
  "海賊船の食堂","星を売る露店","透明な都市","古代遺跡のカフェ","雷を操る老人",
  "マグマの中の冷蔵庫","九尾狐の美容院","宇宙人の銭湯","幽霊と暮らす少女","ペンギンの探偵事務所",
  "タコの料理人","キノコの家に住む人","忍者とスマートフォン","光でできた橋","翼のある象",
  "骨董屋の妖精","夜空を泳ぐ鯨","異世界のコンビニバイト","電気を食べる怪物","虹色の砂浜",
  "竜巻の中の図書館","氷山の宮殿","月を釣る老漁師","怒れる山の神","夢を食べるバク",
  "雲の牧場","地球外の桜並木","海底神殿の守り人","機械仕掛けの鳥居","星屑を集める子供",
  "巨人の手のひらの村","消えかけた灯台","クラゲの森","風船で作られた街","砂時計の中の世界",
  "逃げる影","踊るキノコたち","霧の中の城下町","タイムマシンの修理屋","夜市の幽霊屋台",
  "鏡の中の別世界","氷河の探検家","マグマ温泉旅館","深海の遊園地","雷雲の養蜂家",
  "金魚の泳ぐ夜空","廃墟に咲く桜","巨大植物の密林都市","砂漠の海賊船","空に浮かぶ田んぼ",
  "ロボットの茶道","夕焼けの中の竜","雪原の列車","迷宮の八百屋","鬼の温泉宿",
  "風を纏う少女","記憶の博物館","透き通る竜","ネコ島の灯台守","月明かりの刀鍛冶",
  "地底の花畑","浮遊する岩場の家","宇宙を旅する居酒屋","霊峰の自動販売機","夢と現実の境界線",
  "魚が泳ぐ空","消えゆく街の地図屋","砂漠のオルゴール","流れ星を集める少年","古都と未来の融合",
  "川を流れる鳥居","電脳世界の縁日","鉄と花の神殿","満月に吠える機械狼","星間航路の駅弁屋",
];

const THEME_KEY = "gacha-theme";
const VIEWS_KEY = "gacha-views";
const ROLLS_KEY = "gacha-rolls";

const themes = {
  light: {
    bg: "#f5f0e8",
    card: "#fffdf8",
    accent: "#e85d3a",
    accent2: "#3a7de8",
    text: "#1a1208",
    muted: "#6a5a45",
    border: "rgba(100,70,30,0.35)",
    badgeBg: "#fff3e0",
    badgeText: "#8b5e1a",
    listBg: "#faf6ee",
    statBorder: "rgba(100,70,30,0.3)",
  },
  dark: {
    bg: "#1a1510",
    card: "#241e16",
    accent: "#ff7755",
    accent2: "#6aabff",
    text: "#f0e8d8",
    muted: "#9a8a72",
    border: "rgba(255,220,150,0.2)",
    badgeBg: "#2a1f10",
    badgeText: "#f0a040",
    listBg: "#1e1810",
    statBorder: "rgba(255,220,150,0.15)",
  },
};

function getSystemTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export default function App() {
  const [result, setResult] = useState("ボタンを押してお題を引こう！");
  const [hint, setHint] = useState(`全${prompts.length}種類のお題があるよ`);
  const [views, setViews] = useState(0);
  const [totalRolls, setTotalRolls] = useState(0);
  const [themeKey, setThemeKey] = useState(() => localStorage.getItem(THEME_KEY) || "auto");
  const [listOpen, setListOpen] = useState(false);
  const [popping, setPopping] = useState(false);
  const [particles, setParticles] = useState([]);
  const lastIdx = useRef(-1);

  const resolvedTheme = themeKey === "auto" ? getSystemTheme() : themeKey;
  const t = themes[resolvedTheme];

  useEffect(() => {
    const v = parseInt(localStorage.getItem(VIEWS_KEY) || "0") + 1;
    localStorage.setItem(VIEWS_KEY, v);
    setViews(v);
    const r = parseInt(localStorage.getItem(ROLLS_KEY) || "0");
    setTotalRolls(r);
  }, []);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeKey);
  }, [themeKey]);

  const burst = () => {
    const colors = ["#e85d3a", "#3a7de8", "#f5a623", "#7ed321", "#bd10e0"];
    const newParticles = Array.from({ length: 12 }, (_, i) => {
      const angle = (i / 12) * Math.PI * 2;
      const r = 50 + Math.random() * 40;
      return {
        id: Date.now() + i,
        color: colors[i % colors.length],
        size: 6 + Math.random() * 6,
        tx: Math.cos(angle) * r,
        ty: Math.sin(angle) * r,
      };
    });
    setParticles(newParticles);
    setTimeout(() => setParticles([]), 700);
  };

  const rollGacha = () => {
    let idx;
    do { idx = Math.floor(Math.random() * prompts.length); }
    while (idx === lastIdx.current && prompts.length > 1);
    lastIdx.current = idx;

    const r = totalRolls + 1;
    localStorage.setItem(ROLLS_KEY, r);
    setTotalRolls(r);

    setPopping(false);
    setTimeout(() => {
      setResult(prompts[idx]);
      setHint(`${idx + 1}/${prompts.length} 番目のお題`);
      setPopping(true);
    }, 10);

    burst();
  };

  const share = () => {
    const msg =
      result === "ボタンを押してお題を引こう！"
        ? "🎨 絵のお題ガチャ — ランダムにイラストのお題を引けるよ！"
        : `🎨 絵のお題ガチャで「${result}」を引いた！`;
    if (navigator.share) {
      navigator.share({ text: msg });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(msg);
    }
  };

  const styles = {
    root: {
      minHeight: "100vh",
      background: t.bg,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "2rem 1rem 3rem",
      fontFamily: "'M PLUS Rounded 1c', 'Zen Maru Gothic', sans-serif",
      color: t.text,
      transition: "background 0.3s, color 0.3s",
    },
    h1: { fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.01em", color: t.text },
    h1Span: { color: t.accent },
    subText: { fontSize: "0.85rem", color: t.muted, marginTop: 4, letterSpacing: "0.02em" },
    card: {
      background: t.card,
      border: `2px solid ${t.border}`,
      borderRadius: 20,
      padding: "2rem 2rem 1.75rem",
      width: "100%",
      maxWidth: 440,
      boxShadow: "0 2px 24px rgba(0,0,0,0.08)",
      transition: "background 0.3s, border-color 0.3s",
      marginTop: "1rem",
    },
    stats: { display: "flex", gap: 10, marginBottom: "1.5rem" },
    stat: {
      flex: 1,
      background: t.badgeBg,
      borderRadius: 12,
      border: `1.5px solid ${t.statBorder}`,
      padding: "0.65rem 0.75rem",
      textAlign: "center",
      transition: "background 0.3s",
    },
    statLabel: { fontSize: "0.72rem", color: t.badgeText, letterSpacing: "0.05em", marginBottom: 2 },
    statVal: { fontSize: "1.25rem", fontWeight: 700, color: t.badgeText },
    resultBox: {
      background: t.listBg,
      border: `2px dashed ${t.border}`,
      borderRadius: 16,
      padding: "1.5rem 1rem",
      textAlign: "center",
      minHeight: 90,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: "0.6rem",
      position: "relative",
      overflow: "hidden",
      transition: "all 0.3s",
    },
    resultText: {
      fontSize: "1.5rem",
      fontWeight: 700,
      color: t.text,
      letterSpacing: "0.02em",
      animation: popping ? "pop 0.35s cubic-bezier(0.22,1,0.36,1)" : "none",
    },
    hint: { fontSize: "0.75rem", color: t.muted, marginBottom: "1.25rem", textAlign: "center" },
    btnMain: {
      width: "100%",
      padding: "0.9rem",
      border: "none",
      borderRadius: 14,
      background: t.accent,
      color: "#fff",
      fontFamily: "inherit",
      fontSize: "1.05rem",
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: "0.04em",
      marginBottom: "0.75rem",
    },
    actions: { display: "flex", gap: 8, marginBottom: "0.75rem" },
    btnSub: {
      flex: 1,
      padding: "0.6rem",
      border: `2px solid ${t.border}`,
      borderRadius: 11,
      background: "transparent",
      color: t.muted,
      fontFamily: "inherit",
      fontSize: "0.82rem",
      fontWeight: 700,
      cursor: "pointer",
      letterSpacing: "0.02em",
    },
    themeBar: { display: "flex", gap: 6, justifyContent: "center", marginTop: "0.5rem" },
    themeBtnBase: {
      padding: "0.4rem 0.9rem",
      borderRadius: 99,
      border: `2px solid ${t.border}`,
      background: "transparent",
      fontFamily: "inherit",
      fontSize: "0.78rem",
      fontWeight: 700,
      color: t.muted,
      cursor: "pointer",
      letterSpacing: "0.04em",
    },
    themeBtnSel: { background: t.accent2, color: "#fff", border: "2px solid transparent" },
    promptList: {
      display: listOpen ? "flex" : "none",
      flexDirection: "column",
      marginTop: "1.25rem",
      borderRadius: 14,
      border: `2px solid ${t.border}`,
      overflow: "hidden",
      maxHeight: 320,
      overflowY: "auto",
    },
    promptItem: {
      padding: "0.7rem 1rem",
      fontSize: "0.9rem",
      color: t.text,
      background: t.listBg,
      borderBottom: `1px solid ${t.border}`,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    promptNum: { fontSize: "0.72rem", color: t.muted, minWidth: 26, textAlign: "right" },
  };

  return (
    <div style={styles.root}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;700&display=swap');
        @keyframes pop {
          0% { transform: scale(0.7) rotate(-4deg); opacity: 0; }
          60% { transform: scale(1.1) rotate(1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes burst {
          to { transform: translate(var(--tx), var(--ty)) scale(0); opacity: 0; }
        }
      `}</style>

      <div style={{ textAlign: "center" }}>
        <h1 style={styles.h1}>
          🎨 絵のお題<span style={styles.h1Span}>ガチャ</span>
        </h1>
        <p style={styles.subText}>イラストのお題をランダムに引こう！</p>
      </div>

      <div style={styles.card}>
        {/* Stats */}
        <div style={styles.stats}>
          {[["👀 閲覧数", views], ["🎲 ガチャ回数", totalRolls]].map(([label, val]) => (
            <div key={label} style={styles.stat}>
              <div style={styles.statLabel}>{label}</div>
              <div style={styles.statVal}>{val}</div>
            </div>
          ))}
        </div>

        {/* Result */}
        <div style={styles.resultBox}>
          <div style={styles.resultText}>{result}</div>
          {particles.map((p) => (
            <div
              key={p.id}
              style={{
                position: "absolute",
                pointerEvents: "none",
                borderRadius: "50%",
                width: p.size,
                height: p.size,
                background: p.color,
                left: "50%",
                top: "50%",
                "--tx": `${p.tx}px`,
                "--ty": `${p.ty}px`,
                animation: "burst 0.6s ease-out forwards",
              }}
            />
          ))}
        </div>
        <div style={styles.hint}>{hint}</div>

        {/* Main button */}
        <button style={styles.btnMain} onClick={rollGacha}>
          🎰 ガチャを回す
        </button>

        {/* Sub actions */}
        <div style={styles.actions}>
          <button style={styles.btnSub} onClick={() => setListOpen(!listOpen)}>
            {listOpen ? "✖ 閉じる" : "📋 お題一覧"}
          </button>
          <button style={styles.btnSub} onClick={share}>
            📤 シェア
          </button>
        </div>

        {/* Theme switcher */}
        <div style={styles.themeBar}>
          {[["light", "☀ ライト"], ["auto", "⚙ 自動"], ["dark", "🌙 ダーク"]].map(([key, label]) => (
            <button
              key={key}
              style={themeKey === key
                ? { ...styles.themeBtnBase, ...styles.themeBtnSel }
                : styles.themeBtnBase}
              onClick={() => setThemeKey(key)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Prompt list */}
        <div style={styles.promptList}>
          {prompts.map((p, i) => (
            <div
              key={i}
              style={{
                ...styles.promptItem,
                ...(i === prompts.length - 1 ? { borderBottom: "none" } : {}),
              }}
            >
              <span style={styles.promptNum}>{i + 1}</span>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}