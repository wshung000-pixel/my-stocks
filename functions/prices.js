export async function onRequest(context) {
  const url = new URL(context.request.url);
  const tickers = url.searchParams.get("tickers") ?? "";
  if (!tickers) {
    return new Response("no tickers", { status: 400 });
  }

  const symbols = tickers.split(",").map(s => s.trim()).filter(Boolean);
  const results = {};

  await Promise.all(symbols.map(async (symbol) => {
    try {
      const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1d`;
      const res = await fetch(yahooUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          "Accept": "application/json",
        }
      });
      const data = await res.json();
      const price = data?.chart?.result?.[0]?.meta?.regularMarketPrice;
      if (price) results[symbol] = price;
    } catch (e) {
      console.error(`Failed ${symbol}:`, e.message);
    }
  }));

  return new Response(JSON.stringify(results), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    }
  });
}
