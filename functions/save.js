export async function onRequest(context) {
  if (context.request.method !== "POST") return new Response("method not allowed", { status: 405 });
  try {
    const { key, value } = await context.request.json();
    await context.env.STOCK_DATA.put(key, JSON.stringify(value));
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: e.message }), {
      status: 500, headers: { "Content-Type": "application/json" }
    });
  }
}
