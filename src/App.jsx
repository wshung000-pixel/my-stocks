import { useState, useEffect, useRef, useCallback } from "react";

// ── 初始資料 ──────────────────────────────────────────────
const DEFAULT_PORTFOLIOS = {
  tw: {
    label: "台股", currency: "TWD",
    holdings: [
      { id: 1, name: "元大台灣50（元大）",    ticker: "0050.TW",   shares: 15972,    price: 86.35   },
      { id: 2, name: "元大台灣50（國泰）",    ticker: "0050.TW",   shares: 18692,    price: 86.35   },
      { id: 3, name: "富邦台50",              ticker: "006208.TW", shares: 9226,     price: 199.95  },
      { id: 4, name: "台積電",                ticker: "2330.TW",   shares: 1000,     price: 2050.00 },
    ],
  },
  us: {
    label: "美股", currency: "USD",
    holdings: [
      { id: 1, name: "超微半導體",                ticker: "AMD",  shares: 27.62837,  price: 303.46 },
      { id: 2, name: "英偉達",                    ticker: "NVDA", shares: 316.64793, price: 202.50 },
      { id: 3, name: "谷歌-C",                    ticker: "GOOG", shares: 260.35605, price: 337.73 },
      { id: 4, name: "納斯達克100ETF-ProShares",  ticker: "QQQ",  shares: 86.57179,  price: 655.11 },
      { id: 5, name: "全市場指數ETF-Vanguard",    ticker: "VTI",  shares: 110,       price: 351.22 },
    ],
  },
};

const DEFAULT_CASH = [
  { id: 1, name: "國泰銀行", balance: 5243241 },
  { id: 2, name: "樂天銀行", balance: 0 },
];

const COLORS = ["#0ea5e9","#10b981","#f59e0b","#6366f1","#ec4899","#14b8a6","#f97316"];
const TABS   = ["tw", "us", "cash"];

// ── 工具函數 ──────────────────────────────────────────────
const f = (n, d = 0) => Number(n).toLocaleString("zh-TW", { minimumFractionDigits: d, maximumFractionDigits: d });

async function apiSave(key, value) {
  const r = await fetch("/save", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!r.ok) throw new Error("save failed");
}

async function apiLoad(key) {
  const r = await fetch(`/load?key=${key}`);
  if (!r.ok) return null;
  return r.json();
}

async function apiFetchPrices(tickers) {
  const r = await fetch(`/prices?tickers=${tickers.join(",")}`);
  if (!r.ok) return {};
  return r.json();
}

async function apiSearch(q) {
  const r = await fetch(`/search?q=${encodeURIComponent(q)}`);
  if (!r.ok) return [];
  return r.json();
}

// ── Pie Chart ─────────────────────────────────────────────
function Pie({ slices }) {
  const R = 46, SW = 18, C = 60, circ = 2 * Math.PI * R;
  let cum = 0;
  return (
    <svg width={120} height={120} viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
      <circle cx={C} cy={C} r={R} fill="none" stroke="#e2f5f0" strokeWidth={SW} />
      {slices.map((s, i) => {
        const rot = -90 + (cum / 100) * 360;
        cum += s.pct;
        return (
          <circle key={i} cx={C} cy={C} r={R} fill="none"
            stroke={s.color} strokeWidth={SW}
            strokeDasharray={`${circ * s.pct / 100} ${circ}`}
            transform={`rotate(${rot} ${C} ${C})`} />
        );
      })}
      <circle cx={C} cy={C} r={R - SW / 2 - 2} fill="white" />
    </svg>
  );
}

// ── Styles ────────────────────────────────────────────────
const S = {
  input: {
    width: "100%", boxSizing: "border-box",
    border: "1.5px solid #a7f3d0", borderRadius: 12,
    background: "#f8fffe", color: "#1a1a2e",
    fontSize: 16, padding: "12px 16px",
    outline: "none", fontFamily: "inherit",
  },
  label: { display: "block", color: "#6b7280", fontSize: 12, marginBottom: 6 },
  btnPrimary: {
    width: "100%", border: "none", borderRadius: 14,
    background: "linear-gradient(135deg,#10b981,#0ea5e9)",
    color: "#fff", fontSize: 16, fontWeight: 700,
    padding: "14px", cursor: "pointer", fontFamily: "inherit",
  },
  btnSecondary: {
    flex: 1, border: "none", borderRadius: 14,
    background: "#f0fdf9", color: "#10b981",
    fontSize: 15, fontWeight: 600, padding: 14,
    cursor: "pointer", fontFamily: "inherit",
  },
};

// ── Modal wrapper ─────────────────────────────────────────
function Modal({ title, onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "flex-end" }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#fff", borderRadius: "24px 24px 0 0", padding: "28px 20px 48px", width: "100%", maxWidth: 500, margin: "0 auto" }}>
        <div style={{ width: 36, height: 4, background: "#d1fae5", borderRadius: 99, margin: "0 auto 20px" }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#0f4c3a" }}>{title}</span>
          <button onClick={onClose} style={{ background: "#f0fdf9", border: "none", borderRadius: 10, color: "#10b981", padding: "6px 14px", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>取消</button>
        </div>
        {children}
      </div>
    </div>
  );
}

// ── Add Stock Modal ───────────────────────────────────────
function AddStockModal({ onClose, onAdd }) {
  const [ticker,     setTicker]     = useState("");
  const [name,       setName]       = useState("");
  const [shares,     setShares]     = useState("");
  const [sugs,       setSugs]       = useState([]);
  const [searching,  setSearching]  = useState(false);
  const [loading,    setLoading]    = useState(false);
  const timer = useRef(null);

  function onTickerChange(v) {
    setTicker(v); setName(""); setSugs([]);
    clearTimeout(timer.current);
    if (!v.trim()) return;
    setSearching(true);
    timer.current = setTimeout(async () => {
      try { setSugs(((await apiSearch(v)) || []).slice(0, 5)); }
      catch {}
      setSearching(false);
    }, 500);
  }

  async function submit() {
    if (!ticker.trim() || !name.trim() || !shares.trim()) return;
    setLoading(true);
    try {
      const prices = await apiFetchPrices([ticker.toUpperCase()]);
      const price  = prices[ticker.toUpperCase()] || 0;
      onAdd({ id: Date.now(), name: name.trim(), ticker: ticker.toUpperCase(), shares: parseFloat(shares), price });
      onClose();
    } catch {
      onAdd({ id: Date.now(), name: name.trim(), ticker: ticker.toUpperCase(), shares: parseFloat(shares), price: 0 });
      onClose();
    }
    setLoading(false);
  }

  return (
    <Modal title="新增股票" onClose={onClose}>
      <div style={{ marginBottom: 14, position: "relative" }}>
        <label style={S.label}>股票代號</label>
        <input value={ticker} onChange={e => onTickerChange(e.target.value)}
          placeholder="例：2330 / AAPL" style={S.input} autoCapitalize="characters" />
        {searching && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4 }}>搜尋中…</div>}
        {sugs.length > 0 && (
          <div style={{ position: "absolute", left: 0, right: 0, top: "100%", marginTop: 4, background: "#fff", border: "1.5px solid #a7f3d0", borderRadius: 12, overflow: "hidden", zIndex: 300, boxShadow: "0 8px 24px rgba(0,0,0,0.1)" }}>
            {sugs.map((s, i) => (
              <div key={i} onClick={() => { setTicker(s.ticker); setName(s.name); setSugs([]); }}
                style={{ padding: "10px 16px", display: "flex", justifyContent: "space-between", cursor: "pointer", borderBottom: i < sugs.length - 1 ? "1px solid #f0fdf9" : "none" }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e" }}>{s.name}</span>
                <span style={{ fontSize: 11, color: "#10b981", fontFamily: "monospace" }}>{s.ticker}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>股票名稱</label>
        <input value={name} onChange={e => setName(e.target.value)}
          placeholder="選上方結果或手動輸入" style={{ ...S.input, background: name ? "#f0fdf9" : "#f8fffe" }} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>持有股數</label>
        <input value={shares} onChange={e => setShares(e.target.value)}
          placeholder="1000" style={S.input} inputMode="decimal" />
      </div>
      <div style={{ background: "#f0fdf9", borderRadius: 10, padding: "10px 14px", marginBottom: 14, color: "#10b981", fontSize: 12 }}>
        💡 確認後自動抓取最新報價
      </div>
      <button onClick={submit} disabled={loading || !ticker || !name || !shares}
        style={{ ...S.btnPrimary, opacity: (loading || !ticker || !name || !shares) ? 0.5 : 1 }}>
        {loading ? "取得報價中…" : "確認新增"}
      </button>
    </Modal>
  );
}

// ── Add Cash Modal ────────────────────────────────────────
function AddCashModal({ onClose, onAdd }) {
  const [name,    setName]    = useState("");
  const [balance, setBalance] = useState("");

  function submit() {
    const b = parseFloat(balance.replace(/,/g, ""));
    if (!name.trim() || isNaN(b)) return;
    onAdd({ id: Date.now(), name: name.trim(), balance: b });
    onClose();
  }

  return (
    <Modal title="新增現金帳戶" onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>帳戶名稱</label>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="國泰銀行" style={S.input} />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>餘額</label>
        <input value={balance} onChange={e => setBalance(e.target.value)} placeholder="100000" style={S.input} inputMode="decimal" />
      </div>
      <button onClick={submit} disabled={!name || !balance}
        style={{ ...S.btnPrimary, opacity: (!name || !balance) ? 0.5 : 1 }}>
        確認新增
      </button>
    </Modal>
  );
}

// ── Edit Stock Modal ──────────────────────────────────────
function EditStockModal({ holding, onClose, onSave }) {
  const [shares, setShares] = useState(String(holding.shares));
  const [price,  setPrice]  = useState(String(holding.price));

  function submit() {
    const s = parseFloat(shares), p = parseFloat(price);
    if (isNaN(s) || isNaN(p)) return;
    onSave(holding.id, { shares: s, price: p });
    onClose();
  }

  return (
    <Modal title={`編輯 ${holding.name}`} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>持有股數</label>
        <input value={shares} onChange={e => setShares(e.target.value)} style={S.input} inputMode="decimal" />
      </div>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>現價</label>
        <input value={price} onChange={e => setPrice(e.target.value)} style={S.input} inputMode="decimal" />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={S.btnSecondary}>取消</button>
        <button onClick={submit} style={{ ...S.btnPrimary, flex: 2 }}>儲存</button>
      </div>
    </Modal>
  );
}

// ── Edit Cash Modal ───────────────────────────────────────
function EditCashModal({ account, onClose, onSave }) {
  const [balance, setBalance] = useState(String(account.balance));

  function submit() {
    const b = parseFloat(String(balance).replace(/,/g, ""));
    if (isNaN(b)) return;
    onSave(account.id, b);
    onClose();
  }

  return (
    <Modal title={`編輯 ${account.name}`} onClose={onClose}>
      <div style={{ marginBottom: 14 }}>
        <label style={S.label}>餘額</label>
        <input value={balance} onChange={e => setBalance(e.target.value)} style={S.input} inputMode="decimal" />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
        <button onClick={onClose} style={S.btnSecondary}>取消</button>
        <button onClick={submit} style={{ ...S.btnPrimary, flex: 2 }}>儲存</button>
      </div>
    </Modal>
  );
}

// ── Holding Card ──────────────────────────────────────────
function HoldingCard({ h, pct, color, currency, isUpdating, onEdit, onDelete, dragHandle }) {
  const sym = currency === "USD" ? "US$" : "$";
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "14px 14px 14px 8px", marginBottom: 10, display: "flex", alignItems: "center", gap: 10, border: "1.5px solid #e6faf5", boxShadow: "0 2px 12px rgba(16,185,129,0.06)" }}>
      <div {...dragHandle} style={{ color: "#d1d5db", fontSize: 20, padding: "0 4px", cursor: "grab", userSelect: "none", flexShrink: 0 }}>⠿</div>
      <div style={{ width: 44, height: 44, borderRadius: "50%", flexShrink: 0, background: `conic-gradient(${color} ${pct * 3.6}deg, #e6faf5 ${pct * 3.6}deg)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 9, fontWeight: 800, color, fontFamily: "monospace" }}>{pct}%</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{h.name}</div>
        <div style={{ fontSize: 11, color, fontWeight: 600, fontFamily: "monospace", marginTop: 1 }}>{h.ticker.replace(".TW", "")}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 1 }}>
          {f(h.shares, h.shares % 1 ? 5 : 0)} 股 · {sym}{f(h.price, 2)}
          {isUpdating && <span style={{ color: "#10b981", marginLeft: 4 }}>↻</span>}
        </div>
      </div>
      <div style={{ textAlign: "right", flexShrink: 0 }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#0f4c3a", fontFamily: "monospace" }}>{sym}{f(Math.round(h.shares * h.price))}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 5, justifyContent: "flex-end" }}>
          <button onClick={() => onEdit(h)} style={{ background: "#ecfdf5", border: "none", borderRadius: 7, color: "#10b981", fontSize: 11, padding: "3px 8px", fontWeight: 600, cursor: "pointer" }}>編輯</button>
          <button onClick={() => onDelete(h.id)} style={{ background: "#fff1f2", border: "none", borderRadius: 7, color: "#f43f5e", fontSize: 11, padding: "3px 8px", fontWeight: 600, cursor: "pointer" }}>刪除</button>
        </div>
      </div>
    </div>
  );
}

// ── Cash Card ─────────────────────────────────────────────
function CashCard({ acc, onEdit, onDelete }) {
  return (
    <div style={{ background: "#fff", borderRadius: 18, padding: "16px 16px", marginBottom: 10, display: "flex", alignItems: "center", gap: 12, border: "1.5px solid #e6faf5", boxShadow: "0 2px 12px rgba(16,185,129,0.06)" }}>
      <div style={{ width: 46, height: 46, borderRadius: "50%", background: "linear-gradient(135deg,#d1fae5,#a7f3d0)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>🏦</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: "#1a1a2e" }}>{acc.name}</div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 2 }}>現金存款</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 17, fontWeight: 800, color: "#0f4c3a", fontFamily: "monospace" }}>${f(acc.balance)}</div>
        <div style={{ display: "flex", gap: 4, marginTop: 5, justifyContent: "flex-end" }}>
          <button onClick={() => onEdit(acc)} style={{ background: "#ecfdf5", border: "none", borderRadius: 7, color: "#10b981", fontSize: 11, padding: "3px 8px", fontWeight: 600, cursor: "pointer" }}>編輯</button>
          <button onClick={() => onDelete(acc.id)} style={{ background: "#fff1f2", border: "none", borderRadius: 7, color: "#f43f5e", fontSize: 11, padding: "3px 8px", fontWeight: 600, cursor: "pointer" }}>刪除</button>
        </div>
      </div>
    </div>
  );
}

// ── Drag-to-reorder list ──────────────────────────────────
function SortableList({ items, onReorder, renderItem }) {
  const [dragIdx, setDragIdx] = useState(null);
  const [overIdx, setOverIdx] = useState(null);
  const refs = useRef([]);
  const touchIdx = useRef(null);

  function commitReorder(from, to) {
    if (from === to || from === null || to === null) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onReorder(next);
  }

  return (
    <div
      onTouchMove={e => {
        if (touchIdx.current === null) return;
        e.preventDefault();
        const y = e.touches[0].clientY;
        refs.current.forEach((el, j) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (y >= r.top && y <= r.bottom && j !== touchIdx.current) setOverIdx(j);
        });
      }}
      onTouchEnd={() => {
        commitReorder(touchIdx.current, overIdx);
        touchIdx.current = null; setDragIdx(null); setOverIdx(null);
      }}
    >
      {items.map((item, i) => (
        <div key={item.id}
          ref={el => refs.current[i] = el}
          draggable
          onDragStart={() => setDragIdx(i)}
          onDragOver={e => { e.preventDefault(); setOverIdx(i); }}
          onDrop={() => { commitReorder(dragIdx, i); setDragIdx(null); setOverIdx(null); }}
          onDragEnd={() => { setDragIdx(null); setOverIdx(null); }}
          style={{ opacity: dragIdx === i ? 0.4 : 1, outline: overIdx === i ? "2px dashed #10b981" : "none", borderRadius: 18 }}
        >
          {renderItem(item, i, {
            onTouchStart: () => { touchIdx.current = i; setDragIdx(i); },
          })}
        </div>
      ))}
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────
export default function App() {
  const [tab,         setTab]         = useState("tw");
  const [portfolios,  setPortfolios]  = useState(DEFAULT_PORTFOLIOS);
  const [cash,        setCash]        = useState(DEFAULT_CASH);
  const [usdTwd,      setUsdTwd]      = useState(31.51);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [updating,    setUpdating]    = useState(false);
  const [busyTickers, setBusyTickers] = useState([]);
  const [modal,       setModal]       = useState(null); // null | "addStock" | "addCash" | {type:"editStock",h} | {type:"editCash",a}
  const [loaded,      setLoaded]      = useState(false);
  const [fabOpen,     setFabOpen]     = useState(false);
  const swipeRef = useRef(null);
  const portRef  = useRef(portfolios);
  useEffect(() => { portRef.current = portfolios; }, [portfolios]);

  // ── Load from KV ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [p, c] = await Promise.all([apiLoad("portfolios"), apiLoad("cashAccounts")]);
        if (p && p.tw && p.us) setPortfolios(p);
        if (c && Array.isArray(c)) setCash(c);
      } catch (e) { console.warn("load error", e); }
      setLoaded(true);
    })();
  }, []);

  // ── Save helpers ──────────────────────────────────────
  function updatePortfolios(updater) {
    setPortfolios(prev => {
      const next = updater(prev);
      apiSave("portfolios", next).catch(console.warn);
      return next;
    });
  }

  function updateCash(updater) {
    setCash(prev => {
      const next = updater(prev);
      apiSave("cashAccounts", next).catch(console.warn);
      return next;
    });
  }

  // ── Refresh prices ────────────────────────────────────
  const refresh = useCallback(async () => {
    setUpdating(true);
    try {
      const tickers = ["USDTWD=X", ...Object.values(portRef.current).flatMap(p => p.holdings.map(h => h.ticker))];
      setBusyTickers(tickers);
      const prices = await apiFetchPrices(tickers);
      if (prices["USDTWD=X"]) setUsdTwd(prices["USDTWD=X"]);
      updatePortfolios(prev => {
        const next = { ...prev };
        for (const key of Object.keys(next)) {
          next[key] = { ...next[key], holdings: next[key].holdings.map(h => prices[h.ticker] ? { ...h, price: prices[h.ticker] } : h) };
        }
        return next;
      });
      setLastUpdated(new Date());
    } catch (e) { console.warn(e); }
    setBusyTickers([]);
    setUpdating(false);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    refresh();
    const id = setInterval(refresh, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, [loaded, refresh]);

  // ── Swipe ─────────────────────────────────────────────
  function onTouchStart(e) { swipeRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }
  function onTouchEnd(e) {
    if (!swipeRef.current) return;
    const dx = e.changedTouches[0].clientX - swipeRef.current.x;
    const dy = e.changedTouches[0].clientY - swipeRef.current.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy)) {
      const i = TABS.indexOf(tab);
      if (dx < 0 && i < TABS.length - 1) setTab(TABS[i + 1]);
      if (dx > 0 && i > 0) setTab(TABS[i - 1]);
    }
    swipeRef.current = null;
  }

  // ── Derived ───────────────────────────────────────────
  const port      = portfolios[tab] || portfolios.tw;
  const total     = port.holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const twTotal   = portfolios.tw.holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const usTotal   = portfolios.us.holdings.reduce((s, h) => s + h.shares * h.price, 0);
  const cashTotal = cash.reduce((s, a) => s + a.balance, 0);
  const netWorth  = twTotal + usTotal * usdTwd + cashTotal;
  const slices    = port.holdings.map((h, i) => ({ pct: total ? Math.round(h.shares * h.price / total * 100) : 0, color: COLORS[i % COLORS.length] }));

  const tabDefs = [
    { key: "tw",   label: "台股", sub: `$${f(Math.round(twTotal))}` },
    { key: "us",   label: "美股", sub: `US$${f(Math.round(usTotal))}` },
    { key: "cash", label: "現金", sub: `$${f(Math.round(cashTotal))}` },
  ];

  if (!loaded) return (
    <div style={{ minHeight: "100vh", background: "#f0fdf9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
      <div style={{ width: 36, height: 36, border: "3px solid #d1fae5", borderTop: "3px solid #10b981", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <div style={{ color: "#10b981", fontSize: 14 }}>載入中…</div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#f0fdf9", fontFamily: "'Noto Sans TC',sans-serif", color: "#1a1a2e" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;600;700&display=swap');
        *{box-sizing:border-box;-webkit-tap-highlight-color:transparent}
        body{margin:0}
        ::-webkit-scrollbar{display:none}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Header ── */}
      <div style={{ background: "linear-gradient(150deg,#ecfdf5,#f0f9ff)", padding: "44px 18px 0", position: "sticky", top: 0, zIndex: 50, borderBottom: "1px solid #d1fae5" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 10, color: "#10b981", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>NET WORTH</div>
            <div style={{ fontSize: 11, color: "#9ca3af", marginBottom: 2 }}>總資產（台幣換算）</div>
            <div style={{ fontSize: 26, fontWeight: 700, color: "#0f4c3a", fontFamily: "monospace" }}>${f(Math.round(netWorth))}</div>
          </div>
          <div style={{ textAlign: "right" }}>
            <button onClick={refresh} disabled={updating} style={{
              background: updating ? "#e6faf5" : "linear-gradient(135deg,#10b981,#0ea5e9)",
              border: "none", borderRadius: 10, color: updating ? "#10b981" : "#fff",
              padding: "7px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer", marginBottom: 4, display: "block", marginLeft: "auto"
            }}>{updating ? "更新中…" : "↻ 更新報價"}</button>
            <div style={{ fontSize: 10, color: "#9ca3af" }}>USD/TWD {usdTwd.toFixed(3)}</div>
            {lastUpdated && <div style={{ fontSize: 10, color: "#9ca3af", marginTop: 1 }}>{lastUpdated.toLocaleTimeString("zh-TW", { hour: "2-digit", minute: "2-digit" })} 更新</div>}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginTop: 14 }}>
          {tabDefs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              flex: 1, border: tab === t.key ? "none" : "1.5px solid #d1fae5",
              borderRadius: 12, padding: "8px 4px", cursor: "pointer", fontWeight: 700, fontSize: 13,
              background: tab === t.key ? "linear-gradient(135deg,#10b981,#0ea5e9)" : "#fff",
              color: tab === t.key ? "#fff" : "#10b981",
              boxShadow: tab === t.key ? "0 4px 14px rgba(16,185,129,0.25)" : "none",
            }}>
              <div>{t.label}</div>
              <div style={{ fontSize: 10, fontFamily: "monospace", opacity: 0.9, marginTop: 1 }}>{t.sub}</div>
            </button>
          ))}
        </div>

        {/* Dots */}
        <div style={{ display: "flex", justifyContent: "center", gap: 5, padding: "8px 0 0" }}>
          {TABS.map(k => <div key={k} style={{ height: 5, borderRadius: 99, background: tab === k ? "#10b981" : "#d1fae5", width: tab === k ? 18 : 5, transition: "all 0.2s" }} />)}
        </div>
        <div style={{ height: 1, background: "linear-gradient(90deg,transparent,#a7f3d0,transparent)", margin: "6px 0 0" }} />
      </div>

      {/* ── Content ── */}
      <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ padding: "16px 14px 110px" }}>

        {/* Stock tabs */}
        {(tab === "tw" || tab === "us") && (
          <>
            {/* Summary */}
            <div style={{ background: "#fff", borderRadius: 20, padding: "16px", marginBottom: 14, display: "flex", gap: 14, alignItems: "center", border: "1.5px solid #d1fae5", boxShadow: "0 4px 20px rgba(16,185,129,0.07)" }}>
              <Pie slices={slices} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>{port.label} 合計</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#0f4c3a", fontFamily: "monospace" }}>
                  {port.currency === "USD" ? "US$" : "$"}{f(Math.round(total))}
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 4, marginTop: 8 }}>
                  {slices.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 3, background: "#f0fdf9", borderRadius: 99, padding: "2px 7px" }}>
                      <div style={{ width: 6, height: 6, borderRadius: "50%", background: s.color }} />
                      <span style={{ fontSize: 10, fontFamily: "monospace", color: "#374151" }}>{port.holdings[i]?.ticker.replace(".TW", "")} {s.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ fontSize: 11, color: "#9ca3af", textAlign: "right", marginBottom: 6 }}>⠿ 拖拉調整順序</div>

            <SortableList
              items={port.holdings}
              onReorder={list => updatePortfolios(p => ({ ...p, [tab]: { ...p[tab], holdings: list } }))}
              renderItem={(h, i, dragHandle) => (
                <HoldingCard
                  h={h}
                  pct={slices[i]?.pct || 0}
                  color={COLORS[i % COLORS.length]}
                  currency={port.currency}
                  isUpdating={busyTickers.includes(h.ticker)}
                  onEdit={h => setModal({ type: "editStock", h })}
                  onDelete={id => updatePortfolios(p => ({ ...p, [tab]: { ...p[tab], holdings: p[tab].holdings.filter(h => h.id !== id) } }))}
                  dragHandle={dragHandle}
                />
              )}
            />
          </>
        )}

        {/* Cash tab */}
        {tab === "cash" && (
          <>
            <div style={{ background: "#fff", borderRadius: 20, padding: "18px", marginBottom: 14, border: "1.5px solid #d1fae5", boxShadow: "0 4px 20px rgba(16,185,129,0.07)" }}>
              <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 3 }}>現金合計</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: "#0f4c3a", fontFamily: "monospace" }}>${f(cashTotal)}</div>
            </div>
            {cash.map(a => (
              <CashCard key={a.id} acc={a}
                onEdit={a => setModal({ type: "editCash", a })}
                onDelete={id => updateCash(l => l.filter(a => a.id !== id))} />
            ))}
            {cash.length === 0 && <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0" }}>還沒有帳戶，點 + 新增</div>}
          </>
        )}
      </div>

      {/* ── FAB ── */}
      <div style={{ position: "fixed", bottom: 28, right: 18, zIndex: 100, display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
        {fabOpen && (
          <>
            <button onClick={() => { setFabOpen(false); setModal("addCash"); }}
              style={{ background: "#fff", border: "1.5px solid #a7f3d0", borderRadius: 12, color: "#0f4c3a", padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.15)" }}>
              🏦 新增現金帳戶
            </button>
            <button onClick={() => { setFabOpen(false); setModal("addStock"); }}
              style={{ background: "#fff", border: "1.5px solid #a7f3d0", borderRadius: 12, color: "#0f4c3a", padding: "10px 16px", fontSize: 14, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 14px rgba(16,185,129,0.15)" }}>
              📈 新增股票
            </button>
          </>
        )}
        <button onClick={() => setFabOpen(v => !v)} style={{
          width: 54, height: 54, borderRadius: "50%",
          background: "linear-gradient(135deg,#10b981,#0ea5e9)",
          border: "none", color: "#fff", fontSize: 26, cursor: "pointer",
          boxShadow: "0 6px 24px rgba(16,185,129,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transform: fabOpen ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s",
        }}>+</button>
      </div>

      {/* ── Modals ── */}
      {modal === "addStock" && (
        <AddStockModal
          onClose={() => setModal(null)}
          onAdd={h => {
            updatePortfolios(p => ({ ...p, [tab === "cash" ? "tw" : tab]: { ...p[tab === "cash" ? "tw" : tab], holdings: [...p[tab === "cash" ? "tw" : tab].holdings, h] } }));
            setModal(null);
          }}
        />
      )}
      {modal === "addCash" && (
        <AddCashModal
          onClose={() => setModal(null)}
          onAdd={a => { updateCash(l => [...l, a]); setModal(null); }}
        />
      )}
      {modal?.type === "editStock" && (
        <EditStockModal
          holding={modal.h}
          onClose={() => setModal(null)}
          onSave={(id, upd) => {
            updatePortfolios(p => ({ ...p, [tab]: { ...p[tab], holdings: p[tab].holdings.map(h => h.id === id ? { ...h, ...upd } : h) } }));
            setModal(null);
          }}
        />
      )}
      {modal?.type === "editCash" && (
        <EditCashModal
          account={modal.a}
          onClose={() => setModal(null)}
          onSave={(id, bal) => { updateCash(l => l.map(a => a.id === id ? { ...a, balance: bal } : a)); setModal(null); }}
        />
      )}
    </div>
  );
}
