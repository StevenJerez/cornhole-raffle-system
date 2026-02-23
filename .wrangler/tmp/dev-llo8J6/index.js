var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// .wrangler/tmp/bundle-MeSLFG/checked-fetch.js
var urls = /* @__PURE__ */ new Set();
function checkURL(request, init) {
  const url = request instanceof URL ? request : new URL(
    (typeof request === "string" ? new Request(request, init) : request).url
  );
  if (url.port && url.port !== "443" && url.protocol === "https:") {
    if (!urls.has(url.toString())) {
      urls.add(url.toString());
      console.warn(
        `WARNING: known issue with \`fetch()\` requests to custom HTTPS ports in published Workers:
 - ${url.toString()} - the custom port will be ignored when the Worker is published using the \`wrangler deploy\` command.
`
      );
    }
  }
}
__name(checkURL, "checkURL");
globalThis.fetch = new Proxy(globalThis.fetch, {
  apply(target, thisArg, argArray) {
    const [request, init] = argArray;
    checkURL(request, init);
    return Reflect.apply(target, thisArg, argArray);
  }
});

// src/index.js
var WEBHOOK_URL = "https://workflows.thehiretalent.io/webhook/50d54b65-3faf-45fb-a0fe-1982089861f9";
var rateLimitMap = /* @__PURE__ */ new Map();
var RATE_LIMIT_WINDOW = 6e4;
var RATE_LIMIT_MAX = 5;
function isRateLimited(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { timestamp: now, count: 1 });
    return false;
  }
  if (record.count >= RATE_LIMIT_MAX) {
    return true;
  }
  record.count++;
  return false;
}
__name(isRateLimited, "isRateLimited");
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 100;
}
__name(validateEmail, "validateEmail");
function sanitizeString(str) {
  if (typeof str !== "string") return "";
  return str.trim().slice(0, 100).replace(/<[^>]*>/g, "");
}
__name(sanitizeString, "sanitizeString");
var GOOGLE_TOKEN_URI = "https://oauth2.googleapis.com/token";
var SHEETS_SCOPE = "https://www.googleapis.com/auth/spreadsheets";
var SESSION_TTL_SECONDS = 60 * 60 * 8;
var SHEET_CONFIG = {
  participants: {
    name: "Participants",
    headers: ["name", "last name", "email", "points", "status"],
    parse: /* @__PURE__ */ __name((row) => ({
      name: row["name"] || "",
      last_name: row["last name"] || "",
      email: row["email"] || "",
      points: parseInt(row["points"] || "0", 10),
      status: row["status"] || ""
    }), "parse")
  },
  registrations: {
    name: "registrations",
    headers: [
      "registration_id",
      "email",
      "firstName",
      "lastName",
      "company",
      "jobTitle",
      "phone",
      "companySize",
      "attempts_remaining",
      "tickets_this_registration",
      "summary_email_sent",
      "created_at"
    ],
    parse: /* @__PURE__ */ __name((row) => ({
      registration_id: row.registration_id || "",
      email: row.email || "",
      firstName: row.firstName || "",
      lastName: row.lastName || "",
      company: row.company || "",
      jobTitle: row.jobTitle || "",
      phone: row.phone || "",
      companySize: row.companySize || "",
      attempts_remaining: parseInt(row.attempts_remaining || "0", 10),
      tickets_this_registration: parseInt(row.tickets_this_registration || "0", 10),
      summary_email_sent: toBoolean(row.summary_email_sent),
      created_at: row.created_at || ""
    }), "parse")
  },
  contacts: {
    name: "contacts",
    headers: ["email", "name", "company", "email_bonus_applied", "created_at"],
    parse: /* @__PURE__ */ __name((row) => ({
      email: row.email || "",
      name: row.name || "",
      company: row.company || "",
      email_bonus_applied: toBoolean(row.email_bonus_applied),
      created_at: row.created_at || ""
    }), "parse")
  },
  ledger: {
    name: "ledger",
    headers: ["id", "timestamp", "email", "registration_id", "delta", "reason", "actor"],
    parse: /* @__PURE__ */ __name((row) => ({
      id: row.id || "",
      timestamp: row.timestamp || "",
      email: row.email || "",
      registration_id: row.registration_id || "",
      delta: parseInt(row.delta || "0", 10),
      reason: row.reason || "",
      actor: row.actor || ""
    }), "parse")
  },
  draws: {
    name: "draws",
    headers: ["draw_id", "created_at", "totals_json"],
    parse: /* @__PURE__ */ __name((row) => ({
      draw_id: row.draw_id || "",
      created_at: row.created_at || "",
      totals_json: row.totals_json || ""
    }), "parse")
  },
  winners: {
    name: "winners",
    headers: ["draw_id", "tier", "name", "email", "company", "prize", "status", "timestamp"],
    parse: /* @__PURE__ */ __name((row) => ({
      draw_id: row.draw_id || "",
      tier: row.tier || "",
      name: row.name || "",
      email: row.email || "",
      company: row.company || "",
      prize: row.prize || "",
      status: row.status || "",
      timestamp: row.timestamp || ""
    }), "parse")
  }
};
function toBoolean(value) {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;
  return value.toLowerCase() === "true" || value === "1" || value.toLowerCase() === "yes";
}
__name(toBoolean, "toBoolean");
function normalizeStatus(value) {
  const normalized = (value || "").toString().trim().toLowerCase();
  return normalized === "complete" ? "complete" : "pending";
}
__name(normalizeStatus, "normalizeStatus");
function buildParticipantsRows(state) {
  const registrations = Array.isArray(state.registrations) ? state.registrations : [];
  const contacts = state.contacts && typeof state.contacts === "object" ? state.contacts : {};
  const ledger = Array.isArray(state.ledger) ? state.ledger : [];
  const totalsByEmail = ledger.reduce((acc, entry) => {
    if (!entry.email) return acc;
    acc[entry.email] = (acc[entry.email] || 0) + (entry.delta || 0);
    return acc;
  }, {});
  const registrationsByEmail = registrations.reduce((acc, reg) => {
    if (!reg.email) return acc;
    if (!acc[reg.email]) acc[reg.email] = [];
    acc[reg.email].push(reg);
    return acc;
  }, {});
  const allEmails = /* @__PURE__ */ new Set([
    ...Object.keys(contacts || {}),
    ...Object.keys(totalsByEmail),
    ...Object.keys(registrationsByEmail)
  ]);
  const rows = [];
  allEmails.forEach((email) => {
    const regs = registrationsByEmail[email] || [];
    const firstReg = regs[0] || {};
    const contact = contacts[email] || {};
    const fullName = (contact.name || "").trim();
    const lastSpace = fullName.lastIndexOf(" ");
    const fallbackFirst = lastSpace > 0 ? fullName.slice(0, lastSpace) : fullName;
    const fallbackLast = lastSpace > 0 ? fullName.slice(lastSpace + 1) : "";
    const isComplete = regs.length > 0 && regs.every((reg) => (reg.attempts_remaining || 0) <= 0);
    const status = regs.length ? isComplete ? "complete" : "pending" : "pending";
    rows.push({
      name: firstReg.firstName || fallbackFirst || "",
      last_name: firstReg.lastName || fallbackLast || "",
      email: email || "",
      points: totalsByEmail[email] || 0,
      status
    });
  });
  rows.sort((a, b) => a.email.localeCompare(b.email));
  return rows;
}
__name(buildParticipantsRows, "buildParticipantsRows");
function seedStateFromParticipants(participants) {
  const registrations = [];
  const contacts = {};
  const ledger = [];
  const now = (/* @__PURE__ */ new Date()).toISOString();
  participants.forEach((participant) => {
    if (!participant.email) return;
    const rid = `rid_import_${participant.email.replace(/[^a-z0-9]/gi, "")}_${Date.now()}`;
    const status = normalizeStatus(participant.status);
    const attemptsRemaining = status === "complete" ? 0 : 3;
    contacts[participant.email] = {
      email: participant.email,
      name: `${participant.name || ""} ${participant.last_name || ""}`.trim(),
      company: "",
      email_bonus_applied: false,
      created_at: now
    };
    registrations.push({
      registration_id: rid,
      email: participant.email,
      firstName: participant.name || "",
      lastName: participant.last_name || "",
      company: "",
      jobTitle: "",
      phone: "",
      companySize: "",
      attempts_remaining: attemptsRemaining,
      tickets_this_registration: participant.points || 1,
      summary_email_sent: status === "complete",
      created_at: now
    });
    const points = participant.points || 1;
    ledger.push({
      id: `ledger_import_${rid}`,
      email: participant.email,
      registration_id: rid,
      delta: points,
      reason: "import",
      actor: "system",
      timestamp: now
    });
  });
  return { registrations, contacts, ledger, draws: [], winners: [] };
}
__name(seedStateFromParticipants, "seedStateFromParticipants");
function base64UrlEncodeBytes(bytes) {
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}
__name(base64UrlEncodeBytes, "base64UrlEncodeBytes");
function base64UrlEncodeString(value) {
  return base64UrlEncodeBytes(new TextEncoder().encode(value));
}
__name(base64UrlEncodeString, "base64UrlEncodeString");
function base64UrlEncodeJson(value) {
  return base64UrlEncodeString(JSON.stringify(value));
}
__name(base64UrlEncodeJson, "base64UrlEncodeJson");
function columnLetter(columnCount) {
  let n = columnCount;
  let result = "";
  while (n > 0) {
    const rem = (n - 1) % 26;
    result = String.fromCharCode(65 + rem) + result;
    n = Math.floor((n - 1) / 26);
  }
  return result || "A";
}
__name(columnLetter, "columnLetter");
function normalizePrivateKey(privateKey) {
  if (!privateKey) return "";
  return privateKey.replace(/\\n/g, "\n");
}
__name(normalizePrivateKey, "normalizePrivateKey");
function pemToArrayBuffer(pem) {
  const cleaned = pem.replace("-----BEGIN PRIVATE KEY-----", "").replace("-----END PRIVATE KEY-----", "").replace(/\s+/g, "");
  const binary = atob(cleaned);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}
__name(pemToArrayBuffer, "pemToArrayBuffer");
async function signJwtRSA(privateKey, data) {
  const pem = normalizePrivateKey(privateKey);
  if (!pem) {
    throw new Error("Missing Google Sheets private key");
  }
  const keyData = pemToArrayBuffer(pem);
  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    keyData,
    { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "RSASSA-PKCS1-v1_5",
    cryptoKey,
    new TextEncoder().encode(data)
  );
  return base64UrlEncodeBytes(new Uint8Array(signature));
}
__name(signJwtRSA, "signJwtRSA");
async function getSheetsAccessToken(env) {
  const now = Math.floor(Date.now() / 1e3);
  const header = { alg: "RS256", typ: "JWT" };
  const payload = {
    iss: env.GOOGLE_SHEETS_CLIENT_EMAIL,
    scope: SHEETS_SCOPE,
    aud: GOOGLE_TOKEN_URI,
    iat: now,
    exp: now + 3600
  };
  if (!payload.iss) {
    throw new Error("Missing Google Sheets client email");
  }
  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await signJwtRSA(env.GOOGLE_SHEETS_PRIVATE_KEY, unsignedToken);
  const assertion = `${unsignedToken}.${signature}`;
  const tokenResponse = await fetch(GOOGLE_TOKEN_URI, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion
    })
  });
  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(tokenData.error_description || "Failed to fetch Google access token");
  }
  return tokenData.access_token;
}
__name(getSheetsAccessToken, "getSheetsAccessToken");
async function signSessionToken(secret, data) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data));
  return base64UrlEncodeBytes(new Uint8Array(signature));
}
__name(signSessionToken, "signSessionToken");
async function createSessionToken(env) {
  if (!env.ADMIN_SESSION_SECRET) {
    throw new Error("Missing ADMIN_SESSION_SECRET");
  }
  const now = Math.floor(Date.now() / 1e3);
  const payload = {
    sub: "admin",
    iat: now,
    exp: now + SESSION_TTL_SECONDS
  };
  const header = { alg: "HS256", typ: "JWT" };
  const encodedHeader = base64UrlEncodeJson(header);
  const encodedPayload = base64UrlEncodeJson(payload);
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const signature = await signSessionToken(env.ADMIN_SESSION_SECRET, unsignedToken);
  return `${unsignedToken}.${signature}`;
}
__name(createSessionToken, "createSessionToken");
async function verifySessionToken(env, token) {
  if (!env.ADMIN_SESSION_SECRET || !token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [encodedHeader, encodedPayload, signature] = parts;
  const unsignedToken = `${encodedHeader}.${encodedPayload}`;
  const expectedSignature = await signSessionToken(env.ADMIN_SESSION_SECRET, unsignedToken);
  if (expectedSignature !== signature) return false;
  const payloadJson = atob(encodedPayload.replace(/-/g, "+").replace(/_/g, "/"));
  const payload = JSON.parse(payloadJson);
  const now = Math.floor(Date.now() / 1e3);
  return payload.exp && payload.exp > now && payload.sub === "admin";
}
__name(verifySessionToken, "verifySessionToken");
function getBearerToken(request) {
  const authHeader = request.headers.get("Authorization") || "";
  if (!authHeader.startsWith("Bearer ")) return "";
  return authHeader.slice(7);
}
__name(getBearerToken, "getBearerToken");
async function ensureSheetTabs(env, accessToken) {
  const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!spreadsheetId) {
    throw new Error("Missing Google Sheets spreadsheet ID");
  }
  const sheetResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}?fields=sheets.properties.title`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!sheetResponse.ok) {
    const errorText = await sheetResponse.text();
    throw new Error(`Failed to load spreadsheet metadata: ${errorText}`);
  }
  const sheetData = await sheetResponse.json();
  const existing = new Set(
    (sheetData.sheets || []).map((sheet) => sheet.properties?.title).filter(Boolean)
  );
  const requests = [];
  Object.values(SHEET_CONFIG).forEach((config) => {
    if (!existing.has(config.name)) {
      requests.push({ addSheet: { properties: { title: config.name } } });
    }
  });
  if (requests.length === 0) return;
  const updateResponse = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}:batchUpdate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ requests })
    }
  );
  if (!updateResponse.ok) {
    const errorText = await updateResponse.text();
    throw new Error(`Failed to create sheet tabs: ${errorText}`);
  }
}
__name(ensureSheetTabs, "ensureSheetTabs");
async function fetchSheetRows(env, accessToken, config) {
  const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const range = `${config.name}!A1:${columnLetter(config.headers.length)}`;
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(range)}`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to read ${config.name} sheet: ${errorText}`);
  }
  const data = await response.json();
  const values = data.values || [];
  if (!values.length) return [];
  const headerRow = values[0] || [];
  const headerIndex = /* @__PURE__ */ new Map();
  headerRow.forEach((header, index) => {
    if (header) {
      headerIndex.set(header.toLowerCase(), index);
    }
  });
  return values.slice(1).map((row) => {
    const rowData = {};
    config.headers.forEach((header) => {
      const index = headerIndex.get(header.toLowerCase());
      rowData[header] = index === void 0 ? "" : row[index] || "";
    });
    return rowData;
  }).filter((row) => Object.values(row).some((value) => value !== "")).map((row) => config.parse(row));
}
__name(fetchSheetRows, "fetchSheetRows");
async function writeSheetRows(env, accessToken, config, rows) {
  const spreadsheetId = env.GOOGLE_SHEETS_SPREADSHEET_ID;
  const values = [
    config.headers,
    ...rows.map(
      (row) => config.headers.map((header) => {
        const value = row[header];
        if (typeof value === "boolean") return value ? "true" : "false";
        if (value === void 0 || value === null) return "";
        return String(value);
      })
    )
  ];
  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(
      `${config.name}!A1`
    )}?valueInputOption=RAW`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values })
    }
  );
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to write ${config.name} sheet: ${errorText}`);
  }
}
__name(writeSheetRows, "writeSheetRows");
async function loadInternalState(env) {
  const accessToken = await getSheetsAccessToken(env);
  await ensureSheetTabs(env, accessToken);
  const participants = await fetchSheetRows(env, accessToken, SHEET_CONFIG.participants);
  const registrations = await fetchSheetRows(env, accessToken, SHEET_CONFIG.registrations);
  const contactsList = await fetchSheetRows(env, accessToken, SHEET_CONFIG.contacts);
  const ledger = await fetchSheetRows(env, accessToken, SHEET_CONFIG.ledger);
  const draws = await fetchSheetRows(env, accessToken, SHEET_CONFIG.draws);
  const winners = await fetchSheetRows(env, accessToken, SHEET_CONFIG.winners);
  const contacts = {};
  contactsList.forEach((contact) => {
    if (contact.email) {
      contacts[contact.email] = contact;
    }
  });
  const hasFullData = registrations.length || contactsList.length || ledger.length || draws.length || winners.length;
  if (!hasFullData && participants.length) {
    return seedStateFromParticipants(participants);
  }
  if (participants.length && hasFullData) {
    const now = (/* @__PURE__ */ new Date()).toISOString();
    participants.forEach((participant) => {
      if (!participant.email) return;
      if (contacts[participant.email]) return;
      const rid = `rid_import_${participant.email.replace(/[^a-z0-9]/gi, "")}_${Date.now()}`;
      const status = normalizeStatus(participant.status);
      const attemptsRemaining = status === "complete" ? 0 : 3;
      contacts[participant.email] = {
        email: participant.email,
        name: `${participant.name || ""} ${participant.last_name || ""}`.trim(),
        company: "",
        email_bonus_applied: false,
        created_at: now
      };
      registrations.push({
        registration_id: rid,
        email: participant.email,
        firstName: participant.name || "",
        lastName: participant.last_name || "",
        company: "",
        jobTitle: "",
        phone: "",
        companySize: "",
        attempts_remaining: attemptsRemaining,
        tickets_this_registration: participant.points || 0,
        summary_email_sent: status === "complete",
        created_at: now
      });
      const points = participant.points || 1;
      ledger.push({
        id: `ledger_import_${rid}`,
        email: participant.email,
        registration_id: rid,
        delta: points,
        reason: "import",
        actor: "system",
        timestamp: now
      });
    });
  }
  return { registrations, contacts, ledger, draws, winners };
}
__name(loadInternalState, "loadInternalState");
async function saveInternalState(env, state) {
  const accessToken = await getSheetsAccessToken(env);
  await ensureSheetTabs(env, accessToken);
  const contactsList = Object.values(state.contacts || {});
  const participantsRows = buildParticipantsRows(state);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.participants, participantsRows);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.registrations, state.registrations || []);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.contacts, contactsList);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.ledger, state.ledger || []);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.draws, state.draws || []);
  await writeSheetRows(env, accessToken, SHEET_CONFIG.winners, state.winners || []);
}
__name(saveInternalState, "saveInternalState");
var corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};
var src_default = {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let path = url.pathname;
    if (path.startsWith("/ifa2026")) {
      path = path.slice("/ifa2026".length) || "/";
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }
    if (path === "/api/register" && request.method === "POST") {
      const clientIP = request.headers.get("CF-Connecting-IP") || "unknown";
      if (isRateLimited(clientIP)) {
        return new Response(
          JSON.stringify({ error: "Too many requests. Please wait a moment." }),
          {
            status: 429,
            headers: { "Content-Type": "application/json", ...corsHeaders }
          }
        );
      }
      try {
        const body = await request.json();
        if (!body.firstName || !body.lastName || !body.email) {
          return new Response(
            JSON.stringify({ error: "All fields are required" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        if (!validateEmail(body.email)) {
          return new Response(
            JSON.stringify({ error: "Invalid email address" }),
            { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const sanitizedData = {
          firstName: sanitizeString(body.firstName),
          lastName: sanitizeString(body.lastName),
          email: body.email.trim().toLowerCase().slice(0, 100),
          source: "ifa2026-raffle",
          submittedAt: (/* @__PURE__ */ new Date()).toISOString(),
          clientIP
        };
        let webhookResponse;
        try {
          webhookResponse = await fetch(WEBHOOK_URL, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(sanitizedData)
          });
        } catch (fetchError) {
          console.error("Fetch error:", fetchError.message);
          return new Response(
            JSON.stringify({ error: "Network error. Please try again.", details: fetchError.message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        if (webhookResponse.status >= 200 && webhookResponse.status < 300) {
          return new Response(
            JSON.stringify({ success: true }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } else {
          const webhookError = await webhookResponse.text();
          console.error("Webhook error:", webhookResponse.status, webhookError);
          return new Response(
            JSON.stringify({ error: "Registration failed. Please try again.", status: webhookResponse.status }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } catch (e) {
        console.error("Error processing registration:", e.message);
        return new Response(
          JSON.stringify({ error: "Invalid request", details: e.message }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }
    if (path === "/api/internal/login" && request.method === "POST") {
      try {
        if (!env.ADMIN_PASSWORD) {
          return new Response(
            JSON.stringify({ error: "Admin password not configured" }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const body = await request.json();
        const password = typeof body.password === "string" ? body.password : "";
        if (password !== env.ADMIN_PASSWORD) {
          return new Response(
            JSON.stringify({ error: "Invalid password" }),
            { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
        const token = await createSessionToken(env);
        return new Response(
          JSON.stringify({ token, expiresIn: SESSION_TTL_SECONDS }),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "Cache-Control": "no-store, max-age=0",
              ...corsHeaders
            }
          }
        );
      } catch (error) {
        return new Response(
          JSON.stringify({ error: "Login failed", details: error.message }),
          { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }
    if (path === "/api/internal/state") {
      const token = getBearerToken(request);
      const isAuthorized = await verifySessionToken(env, token);
      if (!isAuthorized) {
        return new Response(
          JSON.stringify({ error: "Unauthorized" }),
          { status: 401, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
      if (request.method === "GET") {
        try {
          const state = await loadInternalState(env);
          return new Response(
            JSON.stringify(state),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, max-age=0",
                ...corsHeaders
              }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: "Failed to load state", details: error.message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }
      if (request.method === "POST") {
        try {
          const body = await request.json();
          const state = {
            registrations: Array.isArray(body.registrations) ? body.registrations : [],
            contacts: body.contacts && typeof body.contacts === "object" ? body.contacts : {},
            ledger: Array.isArray(body.ledger) ? body.ledger : [],
            draws: Array.isArray(body.draws) ? body.draws : [],
            winners: Array.isArray(body.winners) ? body.winners : []
          };
          await saveInternalState(env, state);
          return new Response(
            JSON.stringify({ success: true }),
            {
              status: 200,
              headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-store, max-age=0",
                ...corsHeaders
              }
            }
          );
        } catch (error) {
          return new Response(
            JSON.stringify({ error: "Failed to save state", details: error.message }),
            { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      }
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        { status: 405, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }
    if (path === "/" || !path.includes(".") && !path.startsWith("/assets")) {
      path = "/index.html";
    }
    const gcsUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}${path}`;
    try {
      const response = await fetch(gcsUrl, {
        headers: {
          "Accept": request.headers.get("Accept") || "*/*"
        }
      });
      if (response.ok) {
        const headers = new Headers(response.headers);
        if (path.endsWith(".js")) {
          headers.set("Content-Type", "application/javascript");
        } else if (path.endsWith(".css")) {
          headers.set("Content-Type", "text/css");
        } else if (path.endsWith(".html")) {
          headers.set("Content-Type", "text/html");
        } else if (path.endsWith(".png")) {
          headers.set("Content-Type", "image/png");
        }
        if (path.startsWith("/assets/")) {
          headers.set("Cache-Control", "public, max-age=31536000, immutable");
        }
        return new Response(response.body, {
          status: response.status,
          headers
        });
      }
      if (response.status === 404 && !path.startsWith("/assets/")) {
        const indexUrl = `https://storage.googleapis.com/${env.GCS_BUCKET}/index.html`;
        const indexResponse = await fetch(indexUrl);
        if (indexResponse.ok) {
          return new Response(indexResponse.body, {
            status: 200,
            headers: {
              "Content-Type": "text/html"
            }
          });
        }
      }
      return new Response("Not found", { status: 404 });
    } catch (e) {
      return new Response(`Error: ${e.message}`, { status: 500 });
    }
  }
};

// node_modules/wrangler/templates/middleware/middleware-ensure-req-body-drained.ts
var drainBody = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } finally {
    try {
      if (request.body !== null && !request.bodyUsed) {
        const reader = request.body.getReader();
        while (!(await reader.read()).done) {
        }
      }
    } catch (e) {
      console.error("Failed to drain the unused request body.", e);
    }
  }
}, "drainBody");
var middleware_ensure_req_body_drained_default = drainBody;

// node_modules/wrangler/templates/middleware/middleware-miniflare3-json-error.ts
function reduceError(e) {
  return {
    name: e?.name,
    message: e?.message ?? String(e),
    stack: e?.stack,
    cause: e?.cause === void 0 ? void 0 : reduceError(e.cause)
  };
}
__name(reduceError, "reduceError");
var jsonError = /* @__PURE__ */ __name(async (request, env, _ctx, middlewareCtx) => {
  try {
    return await middlewareCtx.next(request, env);
  } catch (e) {
    const error = reduceError(e);
    return Response.json(error, {
      status: 500,
      headers: { "MF-Experimental-Error-Stack": "true" }
    });
  }
}, "jsonError");
var middleware_miniflare3_json_error_default = jsonError;

// .wrangler/tmp/bundle-MeSLFG/middleware-insertion-facade.js
var __INTERNAL_WRANGLER_MIDDLEWARE__ = [
  middleware_ensure_req_body_drained_default,
  middleware_miniflare3_json_error_default
];
var middleware_insertion_facade_default = src_default;

// node_modules/wrangler/templates/middleware/common.ts
var __facade_middleware__ = [];
function __facade_register__(...args) {
  __facade_middleware__.push(...args.flat());
}
__name(__facade_register__, "__facade_register__");
function __facade_invokeChain__(request, env, ctx, dispatch, middlewareChain) {
  const [head, ...tail] = middlewareChain;
  const middlewareCtx = {
    dispatch,
    next(newRequest, newEnv) {
      return __facade_invokeChain__(newRequest, newEnv, ctx, dispatch, tail);
    }
  };
  return head(request, env, ctx, middlewareCtx);
}
__name(__facade_invokeChain__, "__facade_invokeChain__");
function __facade_invoke__(request, env, ctx, dispatch, finalMiddleware) {
  return __facade_invokeChain__(request, env, ctx, dispatch, [
    ...__facade_middleware__,
    finalMiddleware
  ]);
}
__name(__facade_invoke__, "__facade_invoke__");

// .wrangler/tmp/bundle-MeSLFG/middleware-loader.entry.ts
var __Facade_ScheduledController__ = class ___Facade_ScheduledController__ {
  constructor(scheduledTime, cron, noRetry) {
    this.scheduledTime = scheduledTime;
    this.cron = cron;
    this.#noRetry = noRetry;
  }
  static {
    __name(this, "__Facade_ScheduledController__");
  }
  #noRetry;
  noRetry() {
    if (!(this instanceof ___Facade_ScheduledController__)) {
      throw new TypeError("Illegal invocation");
    }
    this.#noRetry();
  }
};
function wrapExportedHandler(worker) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return worker;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  const fetchDispatcher = /* @__PURE__ */ __name(function(request, env, ctx) {
    if (worker.fetch === void 0) {
      throw new Error("Handler does not export a fetch() function.");
    }
    return worker.fetch(request, env, ctx);
  }, "fetchDispatcher");
  return {
    ...worker,
    fetch(request, env, ctx) {
      const dispatcher = /* @__PURE__ */ __name(function(type, init) {
        if (type === "scheduled" && worker.scheduled !== void 0) {
          const controller = new __Facade_ScheduledController__(
            Date.now(),
            init.cron ?? "",
            () => {
            }
          );
          return worker.scheduled(controller, env, ctx);
        }
      }, "dispatcher");
      return __facade_invoke__(request, env, ctx, dispatcher, fetchDispatcher);
    }
  };
}
__name(wrapExportedHandler, "wrapExportedHandler");
function wrapWorkerEntrypoint(klass) {
  if (__INTERNAL_WRANGLER_MIDDLEWARE__ === void 0 || __INTERNAL_WRANGLER_MIDDLEWARE__.length === 0) {
    return klass;
  }
  for (const middleware of __INTERNAL_WRANGLER_MIDDLEWARE__) {
    __facade_register__(middleware);
  }
  return class extends klass {
    #fetchDispatcher = /* @__PURE__ */ __name((request, env, ctx) => {
      this.env = env;
      this.ctx = ctx;
      if (super.fetch === void 0) {
        throw new Error("Entrypoint class does not define a fetch() function.");
      }
      return super.fetch(request);
    }, "#fetchDispatcher");
    #dispatcher = /* @__PURE__ */ __name((type, init) => {
      if (type === "scheduled" && super.scheduled !== void 0) {
        const controller = new __Facade_ScheduledController__(
          Date.now(),
          init.cron ?? "",
          () => {
          }
        );
        return super.scheduled(controller);
      }
    }, "#dispatcher");
    fetch(request) {
      return __facade_invoke__(
        request,
        this.env,
        this.ctx,
        this.#dispatcher,
        this.#fetchDispatcher
      );
    }
  };
}
__name(wrapWorkerEntrypoint, "wrapWorkerEntrypoint");
var WRAPPED_ENTRY;
if (typeof middleware_insertion_facade_default === "object") {
  WRAPPED_ENTRY = wrapExportedHandler(middleware_insertion_facade_default);
} else if (typeof middleware_insertion_facade_default === "function") {
  WRAPPED_ENTRY = wrapWorkerEntrypoint(middleware_insertion_facade_default);
}
var middleware_loader_entry_default = WRAPPED_ENTRY;
export {
  __INTERNAL_WRANGLER_MIDDLEWARE__,
  middleware_loader_entry_default as default
};
//# sourceMappingURL=index.js.map
