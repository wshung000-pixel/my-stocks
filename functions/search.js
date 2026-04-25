const TW_NAMES = {
  "0050.TW":   "元大台灣50",
  "0051.TW":   "元大中型100",
  "0052.TW":   "富邦科技",
  "0053.TW":   "元大電子",
  "0056.TW":   "元大高股息",
  "006208.TW": "富邦台50",
  "00631L.TW": "元大台灣50正2",
  "00646.TW":  "元大S&P500",
  "00662.TW":  "富邦NASDAQ",
  "00713.TW":  "元大台灣高息低波",
  "00757.TW":  "統一FANG+",
  "00878.TW":  "國泰永續高股息",
  "00881.TW":  "國泰台灣5G+",
  "00900.TW":  "富邦特選高股息30",
  "00919.TW":  "群益台灣精選高息",
  "00922.TW":  "國泰台灣ESG永續",
  "00929.TW":  "復華台灣科技優息",
  "00940.TW":  "元大台灣價值高息",
  "1101.TW":   "台泥",
  "1102.TW":   "亞泥",
  "1216.TW":   "統一",
  "1301.TW":   "台塑",
  "1303.TW":   "南亞",
  "1326.TW":   "台化",
  "2002.TW":   "中鋼",
  "2207.TW":   "和泰車",
  "2301.TW":   "光寶科",
  "2303.TW":   "聯電",
  "2308.TW":   "台達電",
  "2317.TW":   "鴻海",
  "2327.TW":   "國巨",
  "2330.TW":   "台積電",
  "2337.TW":   "旺宏",
  "2344.TW":   "華邦電",
  "2345.TW":   "智邦",
  "2347.TW":   "聯強",
  "2356.TW":   "英業達",
  "2357.TW":   "華碩",
  "2360.TW":   "致茂",
  "2379.TW":   "瑞昱",
  "2382.TW":   "廣達",
  "2383.TW":   "台光電",
  "2395.TW":   "研華",
  "2408.TW":   "南亞科",
  "2409.TW":   "友達",
  "2412.TW":   "中華電",
  "2454.TW":   "聯發科",
  "2603.TW":   "長榮",
  "2609.TW":   "陽明",
  "2615.TW":   "萬海",
  "2618.TW":   "長榮航",
  "2633.TW":   "台灣高鐵",
  "2880.TW":   "華南金",
  "2881.TW":   "富邦金",
  "2882.TW":   "國泰金",
  "2883.TW":   "開發金",
  "2884.TW":   "玉山金",
  "2885.TW":   "元大金",
  "2886.TW":   "兆豐金",
  "2887.TW":   "台新金",
  "2888.TW":   "新光金",
  "2890.TW":   "永豐金",
  "2891.TW":   "中信金",
  "2892.TW":   "第一金",
  "2912.TW":   "統一超",
  "3008.TW":   "大立光",
  "3017.TW":   "奇鋐",
  "3034.TW":   "聯詠",
  "3037.TW":   "欣興",
  "3045.TW":   "台灣大",
  "3231.TW":   "緯創",
  "3443.TW":   "創意",
  "3481.TW":   "群創",
  "3711.TW":   "日月光投控",
  "4904.TW":   "遠傳",
  "4938.TW":   "和碩",
  "5871.TW":   "中租控股",
  "5876.TW":   "上海商銀",
  "5880.TW":   "合庫金",
  "6505.TW":   "台塑化",
  "6669.TW":   "緯穎",
  "6770.TW":   "力積電",
  "8046.TW":   "南電",
};

export async function onRequest(context) {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get("q") ?? "").trim().toUpperCase();
  if (!q) return new Response("no query", { status: 400 });

  // Local TW lookup first
  const localMatches = Object.entries(TW_NAMES)
    .filter(([ticker, name]) =>
      ticker.replace(".TW","").startsWith(q) ||
      ticker.replace(".TW","") === q ||
      name.includes(q)
    )
    .slice(0, 5)
    .map(([ticker, name]) => ({ ticker, name }));

  if (localMatches.length > 0) {
    return new Response(JSON.stringify(localMatches), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }

  // Fallback to Yahoo Finance
  try {
    const yahooUrl = `https://query1.finance.yahoo.com/v1/finance/search?q=${encodeURIComponent(q)}&lang=zh-TW&region=TW&quotesCount=6&newsCount=0`;
    const res = await fetch(yahooUrl, {
      headers: { "User-Agent": "Mozilla/5.0", "Accept": "application/json" }
    });
    const data = await res.json();
    const quotes = (data?.quotes ?? [])
      .filter(q => q.quoteType === "EQUITY" || q.quoteType === "ETF")
      .map(q => ({ ticker: q.symbol, name: q.longname || q.shortname || q.symbol }))
      .slice(0, 5);

    return new Response(JSON.stringify(quotes), {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  } catch (e) {
    return new Response("[]", {
      headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
    });
  }
}
