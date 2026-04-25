export async function onRequest(context) {
  try {
    const url = new URL(context.request.url);
    const key = url.searchParams.get("key");
    if (!key) return new Response("null", { headers: { "Content-Type": "application/json" } });
    const value = await context.env.STOCK_DATA.get(key);
    return new Response(value ?? "null", { headers: { "Content-Type": "application/json" } });
  } catch (e) {
    return new Response("null", { headers: { "Content-Type": "application/json" } });
  }
}
