import { useEffect } from "react";

declare global {
  interface Window {
    login?: () => void;
    logout?: () => void;
    startDraw?: () => void;
    resetDrawUI?: () => void;
    pickWinner?: (tier: string) => void;
    confirmWinner?: (tier: string) => void;
    markUnreachable?: (tier: string) => void;
    redrawTier?: (tier: string) => void;
    updateStatus?: (tier: string) => void;
    exportWinnersCSV?: () => void;
  }
}

const html = `
<style>
    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
        background: #f3f4f6;
        padding-bottom: 40px;
    }

    .container {
        max-width: 1000px;
        margin: 0 auto;
        padding: 0 20px;
    }

    .hidden {
        display: none !important;
    }

    /* Login Screen */
    .login-screen {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
    }

    .login-card {
        background: white;
        padding: 40px;
        border-radius: 12px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
        width: 100%;
        max-width: 400px;
    }

    .login-card h1 {
        font-size: 24px;
        margin-bottom: 8px;
        color: #0891b2;
    }

    .login-card p {
        color: #666;
        margin-bottom: 24px;
        font-size: 14px;
    }

    .form-group {
        margin-bottom: 20px;
    }

    label {
        display: block;
        font-weight: 600;
        margin-bottom: 8px;
        font-size: 14px;
        color: #374151;
    }

    input[type="password"],
    select {
        width: 100%;
        padding: 12px 16px;
        font-size: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-family: inherit;
    }

    input:focus,
    select:focus {
        outline: none;
        border-color: #0891b2;
    }

    .error-msg {
        color: #dc2626;
        font-size: 13px;
        margin-top: 8px;
        display: none;
    }

    .error-msg.show {
        display: block;
    }

    /* Top Nav */
    header {
        background: white;
        border-bottom: 2px solid #e5e7eb;
        padding: 16px 0;
        margin-bottom: 24px;
    }

    .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 16px;
    }

    .header-left h1 {
        font-size: 20px;
        font-weight: 700;
        color: #0891b2;
    }

    .header-left .role-badge {
        display: inline-block;
        font-size: 12px;
        font-weight: 600;
        padding: 4px 12px;
        border-radius: 12px;
        margin-left: 12px;
        text-transform: uppercase;
        background: #dcfce7;
        color: #166534;
    }

    nav {
        display: flex;
        gap: 16px;
        align-items: center;
    }

    nav a {
        text-decoration: none;
        color: #4b5563;
        font-weight: 500;
        font-size: 14px;
        padding: 8px 16px;
        border-radius: 6px;
        transition: all 0.2s;
    }

    nav a:hover {
        background: #f3f4f6;
        color: #0891b2;
    }

    nav a.active {
        background: #0891b2;
        color: white;
    }

    /* Buttons */
    .btn {
        padding: 10px 20px;
        font-size: 14px;
        font-weight: 600;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s;
        font-family: inherit;
    }

    .btn-primary {
        background: #0891b2;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #0e7490;
    }

    .btn-secondary {
        background: #6b7280;
        color: white;
    }

    .btn-secondary:hover:not(:disabled) {
        background: #4b5563;
    }

    .btn-danger {
        background: #dc2626;
        color: white;
    }

    .btn-danger:hover:not(:disabled) {
        background: #b91c1c;
    }

    .btn-success {
        background: #10b981;
        color: white;
    }

    .btn-success:hover:not(:disabled) {
        background: #059669;
    }

    .btn-warning {
        background: #f59e0b;
        color: white;
    }

    .btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .btn-large {
        padding: 14px 28px;
        font-size: 16px;
    }

    /* Cards */
    .card {
        background: white;
        border-radius: 12px;
        padding: 24px;
        margin-bottom: 20px;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }

    .card h2 {
        font-size: 20px;
        font-weight: 700;
        margin-bottom: 16px;
        color: #111827;
    }

    .card h3 {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #374151;
    }

    /* Totals Table */
    .totals-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .totals-table th {
        background: #f9fafb;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;
    }

    .totals-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
    }

    .totals-table tr:hover {
        background: #f9fafb;
    }

    /* Draw Info Banner */
    .draw-info {
        background: linear-gradient(135deg, #0891b2, #0e7490);
        color: white;
        padding: 24px;
        border-radius: 12px;
        margin-bottom: 20px;
        text-align: center;
    }

    .draw-info h3 {
        font-size: 18px;
        margin-bottom: 8px;
        color: white;
    }

    .draw-id {
        font-family: monospace;
        font-size: 14px;
        background: rgba(255, 255, 255, 0.2);
        padding: 8px 16px;
        border-radius: 6px;
        display: inline-block;
    }

    /* Tier Cards */
    .tier-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin-top: 24px;
    }

    .tier-card {
        border-radius: 12px;
        padding: 24px;
        border: 3px solid;
    }

    .tier-card.tier-3rd {
        background: #fef3c7;
        border-color: #f59e0b;
    }

    .tier-card.tier-2nd {
        background: #dbeafe;
        border-color: #3b82f6;
    }

    .tier-card.tier-1st {
        background: #dcfce7;
        border-color: #10b981;
    }

    .tier-header {
        text-align: center;
        margin-bottom: 20px;
    }

    .tier-title {
        font-size: 24px;
        font-weight: 800;
        margin-bottom: 8px;
    }

    .tier-3rd .tier-title {
        color: #92400e;
    }

    .tier-2nd .tier-title {
        color: #1e40af;
    }

    .tier-1st .tier-title {
        color: #166534;
    }

    .tier-prize {
        font-size: 14px;
        font-weight: 600;
        opacity: 0.8;
    }

    /* Winner Display */
    .winner-display {
        background: white;
        border-radius: 8px;
        padding: 20px;
        margin: 16px 0;
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
    }

    .winner-display.animating {
        background: linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 50%, #f3f4f6 100%);
        animation: shimmer 1s infinite;
    }

    @keyframes shimmer {
        0% {
            background-position: -1000px 0;
        }

        100% {
            background-position: 1000px 0;
        }
    }

    .winner-info {
        text-align: center;
    }

    .winner-name {
        font-size: 18px;
        font-weight: 700;
        margin-bottom: 4px;
    }

    .winner-details {
        font-size: 13px;
        color: #6b7280;
    }

    .winner-tickets {
        margin-top: 8px;
        font-weight: 700;
        color: #0891b2;
    }

    .empty-winner {
        color: #6b7280;
        font-size: 14px;
    }

    .animating-winner {
        font-size: 18px;
        font-weight: 700;
        color: #6b7280;
        animation: pulse 0.4s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }

        50% {
            opacity: 0.5;
        }
    }

    .tier-actions {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 8px;
        margin-top: 12px;
    }

    .status-select {
        grid-column: span 2;
        padding: 10px 12px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
    }

    /* Toasts */
    .toast-container {
        position: fixed;
        bottom: 20px;
        right: 20px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        z-index: 9999;
    }

    .toast {
        padding: 12px 16px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .toast-info {
        background: #eff6ff;
        color: #1e40af;
    }

    .toast-success {
        background: #dcfce7;
        color: #166534;
    }

    .toast-warning {
        background: #fef3c7;
        color: #92400e;
    }

    .toast-error {
        background: #fee2e2;
        color: #b91c1c;
    }

    @media (max-width: 768px) {
        .tier-grid {
            grid-template-columns: 1fr;
        }

        .header-content {
            flex-direction: column;
            align-items: stretch;
        }

        nav {
            flex-direction: column;
            gap: 8px;
        }
    }
</style>

<div id="loginScreen" class="login-screen">
    <div class="login-card">
        <h1>🎯 Admin Access</h1>
        <p>IFA 2026 Live Draw Dashboard</p>

        <div class="form-group">
            <label>Password</label>
            <input type="password" id="passwordInput" placeholder="Enter password">
            <div class="error-msg" id="passwordError">Invalid password</div>
        </div>

        <button class="btn btn-primary btn-large" style="width: 100%;" onclick="login()">Login</button>
    </div>
</div>

<div id="mainApp" class="hidden">
    <header>
        <div class="container">
            <div class="header-content">
                <div class="header-left">
                    <h1>Live Draw Dashboard</h1>
                    <span class="role-badge" id="roleBadge">ADMIN</span>
                </div>
                <nav>
                    <a href="/ifa2026/internal">Scoring Dashboard</a>
                    <a href="/ifa2026/internal-draw" class="active">Live Draw</a>
                    <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>
                </nav>
            </div>
        </div>
    </header>

    <main class="container">
        <div id="adminContent">
            <div class="card">
                <h2>Current Ticket Totals</h2>
                <p style="color: #6b7280; font-size: 14px; margin-bottom: 16px;">
                    Live view of all participants and their total tickets across all registrations.
                </p>
                <div style="overflow-x: auto;">
                    <table class="totals-table" id="totalsTable">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Company</th>
                                <th>Total Tickets</th>
                                <th>Bonus Applied</th>
                            </tr>
                        </thead>
                        <tbody id="totalsBody">
                            <tr>
                                <td colspan="5" class="text-center" style="padding: 40px; color: #6b7280;">No
                                    registrations yet</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <div class="mt-20">
                    <button class="btn btn-primary btn-large" onclick="startDraw()">Start Draw (Snapshot
                        Totals)</button>
                    <button class="btn btn-secondary" onclick="resetDrawUI()" style="margin-left: 12px;">Reset
                        Current Draw UI</button>
                </div>
            </div>

            <div id="drawInfo" class="draw-info hidden">
                <h3>🎰 Draw Active</h3>
                <div class="draw-id" id="drawIdDisplay"></div>
            </div>

            <div class="tier-grid" id="tierGrid" style="display: none;">
                <div class="tier-card tier-3rd">
                    <div class="tier-header">
                        <div class="tier-title">🥉 3rd Place</div>
                        <div class="tier-prize">15% off annual plan</div>
                    </div>
                    <div class="winner-display" id="winner3rd">
                        <div class="empty-winner">No winner selected</div>
                    </div>
                    <div class="tier-actions">
                        <button class="btn btn-warning btn-large" onclick="pickWinner('3rd')">Pick Winner
                            (Weighted)</button>
                        <button class="btn btn-success" onclick="confirmWinner('3rd')" id="confirm3rd"
                            disabled>Confirm Winner</button>
                        <button class="btn btn-secondary" onclick="markUnreachable('3rd')" id="unreachable3rd"
                            disabled>Mark Unreachable</button>
                        <button class="btn btn-primary" onclick="redrawTier('3rd')" id="redraw3rd" disabled>Redraw
                            This Tier</button>
                        <select class="status-select" id="status3rd" onchange="updateStatus('3rd')" disabled>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="unreachable">Unreachable</option>
                        </select>
                    </div>
                </div>

                <div class="tier-card tier-2nd">
                    <div class="tier-header">
                        <div class="tier-title">🥈 2nd Place</div>
                        <div class="tier-prize">30% off annual plan</div>
                    </div>
                    <div class="winner-display" id="winner2nd">
                        <div class="empty-winner">No winner selected</div>
                    </div>
                    <div class="tier-actions">
                        <button class="btn btn-warning btn-large" onclick="pickWinner('2nd')">Pick Winner
                            (Weighted)</button>
                        <button class="btn btn-success" onclick="confirmWinner('2nd')" id="confirm2nd"
                            disabled>Confirm Winner</button>
                        <button class="btn btn-secondary" onclick="markUnreachable('2nd')" id="unreachable2nd"
                            disabled>Mark Unreachable</button>
                        <button class="btn btn-primary" onclick="redrawTier('2nd')" id="redraw2nd" disabled>Redraw
                            This Tier</button>
                        <select class="status-select" id="status2nd" onchange="updateStatus('2nd')" disabled>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="unreachable">Unreachable</option>
                        </select>
                    </div>
                </div>

                <div class="tier-card tier-1st">
                    <div class="tier-header">
                        <div class="tier-title">🥇 1st Place</div>
                        <div class="tier-prize">Meta Glasses + 30% off</div>
                    </div>
                    <div class="winner-display" id="winner1st">
                        <div class="empty-winner">No winner selected</div>
                    </div>
                    <div class="tier-actions">
                        <button class="btn btn-warning btn-large" onclick="pickWinner('1st')">Pick Winner
                            (Weighted)</button>
                        <button class="btn btn-success" onclick="confirmWinner('1st')" id="confirm1st"
                            disabled>Confirm Winner</button>
                        <button class="btn btn-secondary" onclick="markUnreachable('1st')" id="unreachable1st"
                            disabled>Mark Unreachable</button>
                        <button class="btn btn-primary" onclick="redrawTier('1st')" id="redraw1st" disabled>Redraw
                            This Tier</button>
                        <select class="status-select" id="status1st" onchange="updateStatus('1st')" disabled>
                            <option value="pending">Pending</option>
                            <option value="contacted">Contacted</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="unreachable">Unreachable</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="card" id="exportCard" style="display: none;">
                <h2>Export Winners</h2>
                <button class="btn btn-primary" onclick="exportWinnersCSV()">📥 Export Winners CSV</button>
            </div>
        </div>
    </main>
</div>

<div class="toast-container" id="toastContainer"></div>
`;

export default function InternalDraw() {
  useEffect(() => {
    let currentDraw: any = null;
    let drawSnapshot: any = null;
    let selectedWinners: Record<string, any> = {
      "3rd": null,
      "2nd": null,
      "1st": null,
    };
    let confirmedWinners = new Set<string>();
    let state: any = {
      contacts: {},
      registrations: [],
      ledger: [],
      draws: [],
      winners: [],
    };
    let persistTimer: number | null = null;
    const API_BASE = location.pathname.startsWith("/ifa2026")
      ? "/ifa2026/api/internal"
      : "/api/internal";

    const prizes: Record<string, string> = {
      "3rd": "15% off annual plan",
      "2nd": "30% off annual plan",
      "1st": "Meta Glasses + 30% off",
    };

    const getAuthToken = () => sessionStorage.getItem("ifa2026_admin_token");

    const apiFetch = async (path: string, options: RequestInit = {}) => {
      const headers = options.headers ? { ...(options.headers as Record<string, string>) } : {};
      const token = getAuthToken();
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      return fetch(`${API_BASE}${path}`, { ...options, headers });
    };

    const showToast = (message: string, type = "info") => {
      const container = document.getElementById("toastContainer");
      if (!container) return;
      const toast = document.createElement("div");
      toast.className = `toast toast-${type}`;
      toast.textContent = message;
      container.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    };

    const ensureStateDefaults = () => {
      if (!state || typeof state !== "object") {
        state = { contacts: {}, registrations: [], ledger: [], draws: [], winners: [] };
      }
      state.contacts = state.contacts || {};
      state.registrations = state.registrations || [];
      state.ledger = state.ledger || [];
      state.draws = state.draws || [];
      state.winners = state.winners || [];
    };

    const loadState = async () => {
      const response = await apiFetch("/state");
      if (!response.ok) {
        throw new Error("Failed to load state");
      }
      state = await response.json();
      ensureStateDefaults();
    };

    const persistState = async () => {
      try {
        const response = await apiFetch("/state", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });

        if (!response.ok) {
          throw new Error("Failed to save");
        }
      } catch (error) {
        showToast("Failed to save to Google Sheets", "error");
      }
    };

    const queuePersistState = () => {
      if (persistTimer) {
        window.clearTimeout(persistTimer);
      }
      persistTimer = window.setTimeout(() => {
        persistState();
      }, 300);
    };

    const getContacts = () => {
      ensureStateDefaults();
      return state.contacts;
    };

    const getLedger = () => {
      ensureStateDefaults();
      return state.ledger;
    };

    const getDraws = () => {
      ensureStateDefaults();
      return state.draws;
    };

    const saveDraws = (draws: any[]) => {
      state.draws = draws;
      queuePersistState();
    };

    const getWinners = () => {
      ensureStateDefaults();
      return state.winners;
    };

    const saveWinners = (winners: any[]) => {
      state.winners = winners;
      queuePersistState();
    };

    const getTotalsByEmail = () => {
      const contacts = getContacts();
      const ledger = getLedger();
      const totals: Record<string, any> = {};

      Object.keys(contacts).forEach((email) => {
        const contact = contacts[email];
        const tickets = ledger
          .filter((entry: any) => entry.email === email)
          .reduce((sum: number, entry: any) => sum + entry.delta, 0);

        if (tickets > 0) {
          totals[email] = {
            email,
            name: contact.name,
            company: contact.company,
            tickets,
            bonus_applied: contact.email_bonus_applied,
          };
        }
      });

      return totals;
    };

    const renderTotals = () => {
      const totals = getTotalsByEmail();
      const tbody = document.getElementById("totalsBody");
      if (!tbody) return;
      const entries = Object.values(totals).sort((a: any, b: any) => b.tickets - a.tickets);

      if (entries.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="5" class="text-center" style="padding: 40px; color: #6b7280;">No registrations yet</td></tr>';
        return;
      }

      tbody.innerHTML = entries
        .map(
          (entry: any) => `
        <tr>
          <td><strong>${entry.name}</strong></td>
          <td>${entry.email}</td>
          <td>${entry.company}</td>
          <td><strong style="color: #0891b2; font-size: 16px;">${entry.tickets}</strong></td>
          <td>${entry.bonus_applied ? "✅ Yes" : "❌ No"}</td>
        </tr>
      `
        )
        .join("");
    };

    const startDraw = () => {
      const totals = getTotalsByEmail();

      if (Object.keys(totals).length === 0) {
        showToast("No participants with tickets to draw from", "warning");
        return;
      }

      const drawId = "draw_" + Date.now();
      currentDraw = {
        draw_id: drawId,
        created_at: new Date().toISOString(),
        totals: Object.values(totals),
      };

      drawSnapshot = { ...totals };

      const draws = getDraws();
      draws.push(currentDraw);
      saveDraws(draws);

      document.getElementById("drawInfo")?.classList.remove("hidden");
      const drawIdDisplay = document.getElementById("drawIdDisplay");
      if (drawIdDisplay) {
        drawIdDisplay.textContent = `Draw ID: ${drawId}`;
      }
      const tierGrid = document.getElementById("tierGrid");
      if (tierGrid) {
        tierGrid.style.display = "grid";
      }
      const exportCard = document.getElementById("exportCard");
      if (exportCard) {
        exportCard.style.display = "block";
      }

      showToast("Draw started! Totals have been snapshotted.", "success");
    };

    const resetDrawUI = () => {
      if (!confirm("Reset the current draw UI? This will NOT delete saved winners.")) return;

      currentDraw = null;
      drawSnapshot = null;
      selectedWinners = { "3rd": null, "2nd": null, "1st": null };
      confirmedWinners.clear();

      document.getElementById("drawInfo")?.classList.add("hidden");
      const tierGrid = document.getElementById("tierGrid");
      if (tierGrid) {
        tierGrid.style.display = "none";
      }
      const exportCard = document.getElementById("exportCard");
      if (exportCard) {
        exportCard.style.display = "none";
      }

      ["3rd", "2nd", "1st"].forEach((tier) => {
        const winnerDisplay = document.getElementById(`winner${tier}`);
        if (winnerDisplay) {
          winnerDisplay.innerHTML = '<div class="empty-winner">No winner selected</div>';
        }
        const confirmButton = document.getElementById(`confirm${tier}`) as HTMLButtonElement | null;
        const unreachableButton = document.getElementById(`unreachable${tier}`) as HTMLButtonElement | null;
        const redrawButton = document.getElementById(`redraw${tier}`) as HTMLButtonElement | null;
        const statusSelect = document.getElementById(`status${tier}`) as HTMLSelectElement | null;
        if (confirmButton) confirmButton.disabled = true;
        if (unreachableButton) unreachableButton.disabled = true;
        if (redrawButton) redrawButton.disabled = true;
        if (statusSelect) statusSelect.disabled = true;
      });

      showToast("Draw UI reset", "info");
    };

    const weightedRandom = (pool: any[]) => {
      const totalTickets = pool.reduce((sum, p) => sum + p.tickets, 0);
      let random = Math.random() * totalTickets;

      for (const participant of pool) {
        random -= participant.tickets;
        if (random <= 0) {
          return participant;
        }
      }

      return pool[pool.length - 1];
    };

    const getEligiblePool = (tier: string) => {
      if (!drawSnapshot) return [];

      const pool = Object.values(drawSnapshot).filter((p: any) => {
        if (confirmedWinners.has(p.email)) return false;

        const currentWinner = selectedWinners[tier];
        if (currentWinner && currentWinner.status === "unreachable" && currentWinner.email === p.email) {
          return false;
        }

        return true;
      });

      return pool;
    };

    const displayWinner = (tier: string, winner: any) => {
      const displayEl = document.getElementById(`winner${tier}`);
      if (!displayEl) return;
      displayEl.innerHTML = `
        <div class="winner-info">
          <div class="winner-name">${winner.name}</div>
          <div class="winner-details">${winner.email}</div>
          <div class="winner-details">${winner.company}</div>
          <div class="winner-tickets">🎟️ ${winner.tickets} tickets</div>
        </div>
      `;
    };

    const pickWinner = (tier: string) => {
      if (!currentDraw) {
        showToast("Please start a draw first", "warning");
        return;
      }

      const pool = getEligiblePool(tier);

      if (pool.length === 0) {
        showToast("No eligible participants remaining", "error");
        return;
      }

      const displayEl = document.getElementById(`winner${tier}`);
      if (!displayEl) return;
      displayEl.classList.add("animating");
      displayEl.innerHTML = '<div class="animating-winner">Drawing...</div>';

      let iterations = 0;
      const maxIterations = 20;
      const interval = setInterval(() => {
        const randomPick = pool[Math.floor(Math.random() * pool.length)] as any;
        displayEl.innerHTML = `<div class="animating-winner">${randomPick.name}</div>`;

        iterations += 1;
        if (iterations >= maxIterations) {
          clearInterval(interval);

          const winner = weightedRandom(pool);
          selectedWinners[tier] = {
            ...winner,
            status: "pending",
            tier,
            prize: prizes[tier],
          };

          displayWinner(tier, winner);

          const confirmButton = document.getElementById(`confirm${tier}`) as HTMLButtonElement | null;
          if (confirmButton) confirmButton.disabled = false;
          displayEl.classList.remove("animating");
        }
      }, 100);
    };

    const confirmWinner = (tier: string) => {
      const winner = selectedWinners[tier];
      if (!winner) return;

      const winners = getWinners();
      const existing = winners.find(
        (w: any) => w.draw_id === currentDraw.draw_id && w.tier === tier && w.email === winner.email
      );
      if (existing) {
        showToast("Winner already confirmed for this tier", "info");
        return;
      }

      const winnerRecord = {
        draw_id: currentDraw.draw_id,
        tier,
        prize: prizes[tier],
        email: winner.email,
        name: winner.name,
        company: winner.company,
        status: "pending",
        timestamp: new Date().toISOString(),
      };

      winners.push(winnerRecord);
      saveWinners(winners);

      confirmedWinners.add(winner.email);
      selectedWinners[tier].confirmed = true;

      const statusSelect = document.getElementById(`status${tier}`) as HTMLSelectElement | null;
      const unreachableButton = document.getElementById(`unreachable${tier}`) as HTMLButtonElement | null;
      const confirmButton = document.getElementById(`confirm${tier}`) as HTMLButtonElement | null;

      if (statusSelect) statusSelect.disabled = false;
      if (unreachableButton) unreachableButton.disabled = false;
      if (confirmButton) confirmButton.disabled = true;

      showToast(`${tier} place winner confirmed: ${winner.name}`, "success");
    };

    const markUnreachable = (tier: string) => {
      const winner = selectedWinners[tier];
      if (!winner) return;

      const winners = getWinners();
      const record = winners.find(
        (w: any) => w.draw_id === currentDraw.draw_id && w.tier === tier && w.email === winner.email
      );
      if (record) {
        record.status = "unreachable";
        saveWinners(winners);
      }

      selectedWinners[tier].status = "unreachable";
      const statusSelect = document.getElementById(`status${tier}`) as HTMLSelectElement | null;
      if (statusSelect) statusSelect.value = "unreachable";

      const redrawButton = document.getElementById(`redraw${tier}`) as HTMLButtonElement | null;
      if (redrawButton) redrawButton.disabled = false;
      confirmedWinners.delete(winner.email);

      showToast(`${tier} place winner marked as unreachable. Redraw available.`, "warning");
    };

    const redrawTier = (tier: string) => {
      const currentWinner = selectedWinners[tier];
      if (!currentWinner || currentWinner.status !== "unreachable") {
        showToast("Can only redraw if current winner is unreachable", "warning");
        return;
      }

      selectedWinners[tier] = null;
      const redrawButton = document.getElementById(`redraw${tier}`) as HTMLButtonElement | null;
      const unreachableButton = document.getElementById(`unreachable${tier}`) as HTMLButtonElement | null;
      if (redrawButton) redrawButton.disabled = true;
      if (unreachableButton) unreachableButton.disabled = true;

      pickWinner(tier);
    };

    const updateStatus = (tier: string) => {
      const winner = selectedWinners[tier];
      if (!winner) return;

      const statusSelect = document.getElementById(`status${tier}`) as HTMLSelectElement | null;
      const newStatus = statusSelect ? statusSelect.value : "pending";

      const winners = getWinners();
      const record = winners.find(
        (w: any) => w.draw_id === currentDraw.draw_id && w.tier === tier && w.email === winner.email
      );
      if (record) {
        record.status = newStatus;
        saveWinners(winners);
        showToast(`Status updated to: ${newStatus}`, "info");
      }
    };

    const exportWinnersCSV = () => {
      const winners = getWinners();

      if (winners.length === 0) {
        showToast("No winners to export", "warning");
        return;
      }

      let csv = "Name,Email,Company,Tier,Prize,Status,Timestamp,Draw ID\n";

      winners.forEach((w: any) => {
        csv += `"${w.name}","${w.email}","${w.company}","${w.tier}","${w.prize}","${w.status}","${w.timestamp}","${w.draw_id}"\n`;
      });

      const blob = new Blob([csv], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ifa2026_winners_${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      showToast("Winners CSV exported successfully", "success");
    };

    const updateRoleUI = () => {
      const badge = document.getElementById("roleBadge");
      if (badge) {
        badge.textContent = "ADMIN";
      }
    };

    const login = async () => {
      const password = (document.getElementById("passwordInput") as HTMLInputElement | null)?.value || "";
      const errorMsg = document.getElementById("passwordError");
      errorMsg?.classList.remove("show");

      try {
        const response = await fetch(`${API_BASE}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        });

        if (!response.ok) {
          if (errorMsg) {
            errorMsg.textContent = "Invalid password";
            errorMsg.classList.add("show");
          }
          return;
        }

        const data = await response.json();
        sessionStorage.setItem("ifa2026_admin_token", data.token);

        document.getElementById("loginScreen")?.classList.add("hidden");
        document.getElementById("mainApp")?.classList.remove("hidden");

        updateRoleUI();
        await initApp();
      } catch (error) {
        if (errorMsg) {
          errorMsg.textContent = "Login failed";
          errorMsg.classList.add("show");
        }
      }
    };

    const logout = () => {
      sessionStorage.removeItem("ifa2026_admin_token");
      document.getElementById("loginScreen")?.classList.remove("hidden");
      document.getElementById("mainApp")?.classList.add("hidden");
      const input = document.getElementById("passwordInput") as HTMLInputElement | null;
      if (input) input.value = "";
    };

    const initApp = async () => {
      try {
        await loadState();
        renderTotals();
      } catch (error) {
        showToast("Failed to load data from Google Sheets", "error");
      }
    };

    window.login = login;
    window.logout = logout;
    window.startDraw = startDraw;
    window.resetDrawUI = resetDrawUI;
    window.pickWinner = pickWinner;
    window.confirmWinner = confirmWinner;
    window.markUnreachable = markUnreachable;
    window.redrawTier = redrawTier;
    window.updateStatus = updateStatus;
    window.exportWinnersCSV = exportWinnersCSV;

    if (getAuthToken()) {
      document.getElementById("loginScreen")?.classList.add("hidden");
      document.getElementById("mainApp")?.classList.remove("hidden");
      updateRoleUI();
      initApp().catch(() => {
        logout();
      });
    }

    return () => {
      window.login = undefined;
      window.logout = undefined;
      window.startDraw = undefined;
      window.resetDrawUI = undefined;
      window.pickWinner = undefined;
      window.confirmWinner = undefined;
      window.markUnreachable = undefined;
      window.redrawTier = undefined;
      window.updateStatus = undefined;
      window.exportWinnersCSV = undefined;
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
