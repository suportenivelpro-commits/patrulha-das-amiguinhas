// Public registration only. Password hashing and sessions are handled by Supabase Auth.
// This endpoint authenticates the app API key itself; gateway verify_jwt must be false
// because new players do not have a user JWT yet. No privileged key is returned.
const PUBLIC_KEY = "sb_publishable_VLLZx14K5dLUcvYsnwEFdQ_IhAVS4_M";
const origins = new Set(["https://patrulha-das-amiguinhas.onrender.com", "http://localhost:5173"]);
Deno.serve(async (request: Request) => {
  const origin = request.headers.get("origin");
  const headers: Record<string, string> = { "Content-Type": "application/json", "Cache-Control": "no-store", "Vary": "Origin", "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info", "Access-Control-Allow-Methods": "POST, OPTIONS" };
  if (origin && origins.has(origin)) headers["Access-Control-Allow-Origin"] = origin;
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers });
  if (origin && !origins.has(origin)) return reply(403, { message: "Origin not allowed" });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (request.method !== "POST") return reply(405, { message: "Use POST" });
  if (!PUBLIC_KEY || request.headers.get("apikey") !== PUBLIC_KEY) return reply(401, { message: "Invalid app key" });
  try {
    if (Number(request.headers.get("content-length") ?? 0) > 4096) return reply(413, { message: "Request too large" });
    const reader = request.body?.getReader(); if (!reader) return reply(400, { message: "Missing body" });
    const chunks: Uint8Array[] = []; let length = 0;
    while (true) { const part = await reader.read(); if (part.done) break; length += part.value.length; if (length > 4096) { await reader.cancel(); return reply(413, { message: "Request too large" }); } chunks.push(part.value); }
    const bytes = new Uint8Array(length); let offset = 0; for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
    let body: Record<string, unknown>; try { body = JSON.parse(new TextDecoder().decode(bytes)); } catch { return reply(400, { message: "Invalid request" }); }
    const username = typeof body?.["username"] === "string" ? body["username"].trim().toLowerCase() : "";
    const password = typeof body?.["password"] === "string" ? body["password"] : "";
    if (!/^[a-z0-9_]{3,24}$/.test(username) || password.length < 8 || new TextEncoder().encode(password).length > 72) return reply(400, { message: "Invalid username or password" });
    const url = Deno.env.get("SUPABASE_URL")!;
    const secret = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    if (!url || !secret) return reply(503, { message: "Registration unavailable" });
    const adminHeaders = { apikey: secret, Authorization: `Bearer ${secret}`, "Content-Type": "application/json" };
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(ip + ":" + secret.slice(-24)));
    const fingerprint = [...new Uint8Array(digest)].map((value) => value.toString(16).padStart(2, "0")).join("");
    const limit = await fetch(url + "/rest/v1/rpc/patrulha_registration_allow", { method: "POST", headers: adminHeaders, body: JSON.stringify({ p_fingerprint: fingerprint }), signal: AbortSignal.timeout(10000) });
    if (!limit.ok) return reply(503, { message: "Registration unavailable" });
    if (await limit.json() !== true) return reply(429, { message: "Try again later" });
    const email = `${username}@patrulha.invalid`;
    const created = await fetch(url + "/auth/v1/admin/users", { method: "POST", headers: adminHeaders, body: JSON.stringify({ email, password, email_confirm: true, app_metadata: { patrulha_account: true } }), signal: AbortSignal.timeout(10000) });
    if (!created.ok) {
      const error = await created.json().catch(() => ({}));
      return reply(["email_exists", "user_already_exists"].includes(error.code) ? 409 : 400, { message: "Unable to create account" });
    }
    const session = await fetch(url + "/auth/v1/token?grant_type=password", { method: "POST", headers: { apikey: PUBLIC_KEY, "Content-Type": "application/json" }, body: JSON.stringify({ email, password }), signal: AbortSignal.timeout(10000) });
    if (!session.ok) return reply(503, { message: "Account created. Sign in to continue." });
    return reply(200, await session.json());
  } catch { return reply(503, { message: "Registration unavailable. Try again later." }); }
});
