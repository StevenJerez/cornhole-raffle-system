import { useEffect } from "react";

declare global {
  interface Window {
    login?: () => void;
    logout?: () => void;
    searchRegistrations?: () => void;
    selectRegistration?: (regId: string) => void;
    scoreAttempt?: (reason: string, delta: number) => void;
    applyBonus?: () => void;
    undoAction?: (ledgerId: string) => void;
    resetAllData?: () => void;
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
    input[type="text"],
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
    }

    .role-admin {
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

    /* Search Panel */
    .search-input {
        width: 100%;
        padding: 14px 16px;
        font-size: 16px;
        border: 2px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 16px;
    }

    .search-input:focus {
        outline: none;
        border-color: #0891b2;
    }

    .results-list {
        max-height: 500px;
        overflow-y: auto;
    }

    .result-item {
        padding: 16px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 8px;
        cursor: pointer;
        transition: all 0.2s;
    }

    .result-item:hover {
        background: #f9fafb;
        border-color: #0891b2;
    }

    .result-item.active {
        background: #eff6ff;
        border-color: #0891b2;
    }

    .result-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
    }

    .result-name {
        font-weight: 600;
        color: #111827;
        font-size: 16px;
    }

    .result-badge {
        font-size: 12px;
        padding: 3px 10px;
        border-radius: 12px;
        font-weight: 600;
    }

    .badge-active {
        background: #dcfce7;
        color: #166534;
    }

    .badge-done {
        background: #e5e7eb;
        color: #6b7280;
    }

    .result-details {
        font-size: 13px;
        color: #6b7280;
        line-height: 1.5;
    }

    .result-stats {
        display: flex;
        gap: 16px;
        margin-top: 8px;
        font-size: 13px;
        font-weight: 600;
    }

    .stat-item {
        display: flex;
        align-items: center;
        gap: 4px;
    }

    /* Registration Detail */
    .detail-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;
        margin-bottom: 20px;
    }

    .detail-item label {
        display: block;
        font-size: 12px;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 4px;
    }

    .detail-item .value {
        font-size: 16px;
        font-weight: 600;
        color: #111827;
    }

    .scoring-buttons {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin: 20px 0;
    }

    .status-badges {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin: 16px 0;
    }

    .status-badge {
        padding: 6px 14px;
        border-radius: 20px;
        font-size: 13px;
        font-weight: 600;
    }

    .status-success {
        background: #dcfce7;
        color: #166534;
    }

    .status-warning {
        background: #fef3c7;
        color: #92400e;
    }

    .status-info {
        background: #dbeafe;
        color: #1e40af;
    }

    /* Recent Actions */
    .recent-actions {
        margin-top: 24px;
        border-top: 1px solid #e5e7eb;
        padding-top: 16px;
    }

    .recent-actions h4 {
        font-size: 14px;
        color: #6b7280;
        margin-bottom: 12px;
    }

    .action-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        margin-bottom: 8px;
    }

    .action-info {
        flex: 1;
    }

    .action-label {
        font-size: 14px;
        font-weight: 600;
    }

    .action-meta {
        font-size: 12px;
        color: #6b7280;
    }

    .btn-undo {
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        padding: 6px 10px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 12px;
    }

    /* Ledger */
    .ledger-table {
        width: 100%;
        border-collapse: collapse;
        font-size: 14px;
    }

    .ledger-table th {
        background: #f9fafb;
        padding: 12px;
        text-align: left;
        font-weight: 600;
        color: #374151;
        border-bottom: 2px solid #e5e7eb;
    }

    .ledger-table td {
        padding: 12px;
        border-bottom: 1px solid #e5e7eb;
    }

    .ledger-table tr:hover {
        background: #f9fafb;
    }

    .delta-positive {
        color: #166534;
        font-weight: 700;
    }

    .delta-zero {
        color: #6b7280;
        font-weight: 600;
    }

    .text-center {
        text-align: center;
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
        <h1>🎯 Internal Access</h1>
        <p>IFA 2026 Cornhole Raffle System</p>

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
                    <h1>Scoring Dashboard</h1>
                    <span class="role-badge role-admin" id="roleBadge">ADMIN</span>
                </div>
                <nav>
                    <a href="/ifa2026/internal" class="active">Scoring Dashboard</a>
                    <a href="/ifa2026/internal-draw" id="drawLink">Live Draw</a>
                  <button class="btn btn-secondary btn-sm" onclick="resetAllData()">Reset Data</button>
                    <button class="btn btn-danger btn-sm" onclick="logout()">Logout</button>
                </nav>
            </div>
        </div>
    </header>

    <main class="container">
        <div class="card">
            <h2>Search Registrations</h2>
            <input type="text" class="search-input" id="searchInput" placeholder="Search by name or email..."
                oninput="searchRegistrations()">

            <div class="results-list" id="resultsList">
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>Search for registrations by name or email</p>
                </div>
            </div>
        </div>

        <div id="detailCard" class="card hidden">
            <h2>Registration Detail</h2>
            <div id="detailContent"></div>
        </div>

        <div class="card">
            <h2>Recent Activity</h2>
            <div style="overflow-x: auto;">
                <table class="ledger-table">
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Email</th>
                            <th>Reg ID</th>
                            <th>Action</th>
                            <th>Tickets</th>
                            <th>Actor</th>
                        </tr>
                    </thead>
                    <tbody id="ledgerBody">
                        <tr>
                            <td colspan="6" class="text-center" style="padding: 40px; color: #6b7280;">No activity
                                yet</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </main>
</div>

<div class="toast-container" id="toastContainer"></div>
`;

export default function InternalDashboard() {
  useEffect(() => {
    let currentRole = "admin";
    let selectedRegistration: any = null;
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

    const saveContacts = (contacts: any) => {
      state.contacts = contacts;
      queuePersistState();
    };

    const getRegistrations = () => {
      ensureStateDefaults();
      return state.registrations;
    };

    const saveRegistrations = (registrations: any[]) => {
      state.registrations = registrations;
      queuePersistState();
    };

    const getLedger = () => {
      ensureStateDefaults();
      return state.ledger;
    };

    const saveLedger = (ledger: any[]) => {
      state.ledger = ledger;
      queuePersistState();
    };

    const addLedgerEntry = (entry: any) => {
      const ledger = getLedger();
      ledger.push({
        id: "ledger_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9),
        timestamp: new Date().toISOString(),
        ...entry,
      });
      saveLedger(ledger);
    };

    const getTotalTicketsByEmail = (email: string) => {
      const ledger = getLedger();
      return ledger
        .filter((entry: any) => entry.email === email)
        .reduce((sum: number, entry: any) => sum + entry.delta, 0);
    };

    const getRecentActionsForRegistration = (regId: string, email: string) => {
      const ledger = getLedger();
      const actions = ledger.filter(
        (entry: any) =>
          (entry.registration_id === regId || (entry.reason === "bonus" && entry.email === email)) &&
          entry.reason !== "register"
      );
      return actions.slice(-5).reverse();
    };

    const renderLedger = () => {
      const ledger = getLedger();
      const recent = ledger.slice(-25).reverse();
      const tbody = document.getElementById("ledgerBody");
      if (!tbody) return;

      if (recent.length === 0) {
        tbody.innerHTML =
          '<tr><td colspan="6" class="text-center" style="padding: 40px; color: #6b7280;">No activity yet</td></tr>';
        return;
      }

      tbody.innerHTML = recent
        .map((entry: any) => {
          const reasonLabels: Record<string, string> = {
            register: "Registration",
            bag_in: "Bag In",
            board_hit: "Board Hit",
            miss: "Miss",
            bonus: "Onboarding Bonus",
          };

          const deltaClass = entry.delta > 0 ? "delta-positive" : "delta-zero";

          return `
          <tr>
            <td>${new Date(entry.timestamp).toLocaleString()}</td>
            <td>${entry.email}</td>
            <td style="font-family: monospace; font-size: 11px;">${entry.registration_id.substring(
              0,
              12
            )}...</td>
            <td>${reasonLabels[entry.reason] || entry.reason}</td>
            <td class="${deltaClass}">+${entry.delta}</td>
            <td>${entry.actor}</td>
          </tr>
        `;
        })
        .join("");
    };

    const renderRecentActions = () => {
      if (!selectedRegistration) return;

      const actions = getRecentActionsForRegistration(
        selectedRegistration.registration_id,
        selectedRegistration.email
      );

      if (actions.length === 0) return;

      const reasonLabels: Record<string, string> = {
        bag_in: "🎯 Bag In",
        board_hit: "🎲 Board Hit",
        miss: "❌ Miss",
        bonus: "🎁 Onboarding Bonus",
      };

      const actionsHTML = `
        <div class="recent-actions">
          <h4>⏮️ Recent Actions (Can Undo)</h4>
          ${actions
            .map(
              (action: any) => `
            <div class="action-item">
              <div class="action-info">
                <div class="action-label">
                  ${reasonLabels[action.reason] || action.reason} (+${action.delta} tickets)
                </div>
                <div class="action-meta">
                  ${new Date(action.timestamp).toLocaleString()} • by ${action.actor}
                </div>
              </div>
              <button class="btn-undo" onclick="undoAction('${action.id}')" title="Undo this action">
                ↶ Undo
              </button>
            </div>
          `
            )
            .join("")}
        </div>
      `;

      document.getElementById("detailContent")?.insertAdjacentHTML("beforeend", actionsHTML);
    };

    const renderDetail = () => {
      if (!selectedRegistration) return;

      const contacts = getContacts();
      const contact = contacts[selectedRegistration.email];
      const totalTickets = getTotalTicketsByEmail(selectedRegistration.email);
      const canScore = selectedRegistration.attempts_remaining > 0;
      const canBonus = currentRole !== "staff" && contact && !contact.email_bonus_applied;

      const content = `
        <div class="detail-grid">
          <div class="detail-item">
            <label>Name</label>
            <div class="value">${selectedRegistration.firstName} ${selectedRegistration.lastName}</div>
          </div>
          <div class="detail-item">
            <label>Email</label>
            <div class="value">${selectedRegistration.email}</div>
          </div>
          <div class="detail-item">
            <label>Company</label>
            <div class="value">${selectedRegistration.company}</div>
          </div>
          <div class="detail-item">
            <label>Registration ID</label>
            <div class="value" style="font-size: 12px; font-family: monospace;">${selectedRegistration.registration_id}</div>
          </div>
          <div class="detail-item">
            <label>Created</label>
            <div class="value">${new Date(selectedRegistration.created_at).toLocaleString()}</div>
          </div>
          <div class="detail-item">
            <label>Attempts Remaining</label>
            <div class="value">${selectedRegistration.attempts_remaining} / 3</div>
          </div>
          <div class="detail-item">
            <label>Tickets This Reg</label>
            <div class="value">${selectedRegistration.tickets_this_registration}</div>
          </div>
          <div class="detail-item">
            <label>Total Tickets (Email)</label>
            <div class="value" style="color: #0891b2;">${totalTickets}</div>
          </div>
        </div>

        <div class="status-badges">
          <span class="status-badge ${
            contact?.email_bonus_applied ? "status-success" : "status-info"
          }">
            Bonus: ${contact?.email_bonus_applied ? "Applied" : "Not Applied"}
          </span>
          <span class="status-badge ${
            selectedRegistration.summary_email_sent ? "status-success" : "status-warning"
          }">
            Email: ${selectedRegistration.summary_email_sent ? "Sent" : "Pending"}
          </span>
        </div>

        <h3>Score Attempts</h3>
        <div class="scoring-buttons">
          <button class="btn btn-success" onclick="scoreAttempt('bag_in', 10)" ${
            !canScore ? "disabled" : ""
          }>
            🎯 BAG IN (+10)
          </button>
          <button class="btn btn-warning" onclick="scoreAttempt('board_hit', 5)" ${
            !canScore ? "disabled" : ""
          }>
            🎲 BOARD HIT (+5)
          </button>
          <button class="btn btn-secondary" onclick="scoreAttempt('miss', 0)" ${
            !canScore ? "disabled" : ""
          }>
            ❌ MISS (+0)
          </button>
        </div>
        ${
          !canScore
            ? '<p style="color: #6b7280; font-size: 14px; margin-top: -8px;">No attempts remaining for this registration.</p>'
            : ""
        }

        ${
          currentRole !== "staff"
            ? `
          <h3 style="margin-top: 20px;">Bonus</h3>
          <button class="btn btn-primary" onclick="applyBonus()" ${!canBonus ? "disabled" : ""}>
            🎁 ADD +15 BONUS
          </button>
          ${
            !canBonus && contact?.email_bonus_applied
              ? '<p style="color: #6b7280; font-size: 14px; margin-top: 8px;">Bonus already used for this email.</p>'
              : ""
          }
        `
            : ""
        }
      `;

      const detailContent = document.getElementById("detailContent");
      if (detailContent) {
        detailContent.innerHTML = content;
      }

      renderRecentActions();
    };

    const renderResults = (registrations: any[]) => {
      const container = document.getElementById("resultsList");
      if (!container) return;

      if (registrations.length === 0) {
        container.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p>No registrations found</p>
          </div>
        `;
        return;
      }

      container.innerHTML = registrations
        .map((reg: any) => {
          const totalTickets = getTotalTicketsByEmail(reg.email);
          const isActive = reg.attempts_remaining > 0;
          const badgeClass = isActive ? "badge-active" : "badge-done";
          const badgeText = isActive ? `${reg.attempts_remaining} left` : "Complete";

          return `
          <div class="result-item" onclick="selectRegistration('${reg.registration_id}')">
            <div class="result-header">
              <div class="result-name">${reg.firstName} ${reg.lastName}</div>
              <span class="result-badge ${badgeClass}">${badgeText}</span>
            </div>
            <div class="result-details">
              <div>${reg.email}</div>
              <div>${reg.company}</div>
              <div>Registered: ${new Date(reg.created_at).toLocaleString()}</div>
            </div>
            <div class="result-stats">
              <div class="stat-item">
                <span>🎟️ This Reg:</span>
                <span>${reg.tickets_this_registration}</span>
              </div>
              <div class="stat-item">
                <span>🎫 Total:</span>
                <span>${totalTickets}</span>
              </div>
            </div>
          </div>
        `;
        })
        .join("");
    };

    const searchRegistrations = () => {
      const input = document.getElementById("searchInput") as HTMLInputElement | null;
      const query = input ? input.value.toLowerCase().trim() : "";
      const registrations = getRegistrations();

      let filtered = registrations;
      if (query) {
        filtered = registrations.filter(
          (reg: any) =>
            reg.firstName.toLowerCase().includes(query) ||
            reg.lastName.toLowerCase().includes(query) ||
            reg.email.toLowerCase().includes(query) ||
            reg.company.toLowerCase().includes(query)
        );
      }

      filtered.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      renderResults(filtered);
    };

    const selectRegistration = (regId: string) => {
      const registrations = getRegistrations();
      selectedRegistration = registrations.find((r: any) => r.registration_id === regId);

      if (!selectedRegistration) return;

      document.getElementById("detailCard")?.classList.remove("hidden");
      renderDetail();
      document.getElementById("detailCard")?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };

    const scoreAttempt = (reason: string, delta: number) => {
      if (!selectedRegistration || selectedRegistration.attempts_remaining <= 0) return;

      const registrations = getRegistrations();
      const reg = registrations.find((r: any) => r.registration_id === selectedRegistration.registration_id);

      reg.attempts_remaining -= 1;
      reg.tickets_this_registration += delta;

      const wasLastAttempt = reg.attempts_remaining === 0;

      addLedgerEntry({
        email: reg.email,
        registration_id: reg.registration_id,
        delta: delta,
        reason: reason,
        actor: currentRole,
      });

      if (wasLastAttempt) {
        reg.summary_email_sent = true;
        showToast(`Summary email simulated as sent for ${reg.email} (registration ${reg.registration_id})`, "info");
      }

      saveRegistrations(registrations);
      selectedRegistration = reg;

      const reasonText = reason === "bag_in" ? "BAG IN" : reason === "board_hit" ? "BOARD HIT" : "MISS";
      showToast(`Scored: ${reasonText} (+${delta} tickets)`, "success");

      renderDetail();
      searchRegistrations();
      renderLedger();
    };

    const applyBonus = () => {
      if (!selectedRegistration) return;

      const contacts = getContacts();
      const contact = contacts[selectedRegistration.email];

      if (!contact || contact.email_bonus_applied) {
        showToast("Bonus already applied for this email", "warning");
        return;
      }

      contact.email_bonus_applied = true;
      saveContacts(contacts);

      addLedgerEntry({
        email: selectedRegistration.email,
        registration_id: selectedRegistration.registration_id,
        delta: 15,
        reason: "bonus",
        actor: currentRole,
      });

      showToast("Onboarding bonus (+15 tickets) applied!", "success");

      renderDetail();
      searchRegistrations();
      renderLedger();
    };

    const undoAction = (ledgerId: string) => {
      if (!confirm("Are you sure you want to undo this action? This cannot be reversed.")) return;

      const ledger = getLedger();
      const entryIndex = ledger.findIndex((e: any) => e.id === ledgerId);

      if (entryIndex === -1) {
        showToast("Action not found", "error");
        return;
      }

      const entry = ledger[entryIndex];
      const registrations = getRegistrations();
      const reg = registrations.find((r: any) => r.registration_id === entry.registration_id);

      if (!reg) {
        showToast("Registration not found", "error");
        return;
      }

      if (entry.reason === "bonus") {
        const contacts = getContacts();
        const contact = contacts[entry.email];
        if (contact) {
          contact.email_bonus_applied = false;
          saveContacts(contacts);
        }
        showToast("Bonus undone: +15 tickets removed", "info");
      } else if (["bag_in", "board_hit", "miss"].includes(entry.reason)) {
        const wasComplete = reg.attempts_remaining === 0;
        reg.attempts_remaining += 1;
        reg.tickets_this_registration -= entry.delta;

        if (wasComplete) {
          reg.summary_email_sent = false;
          showToast("Summary email status reset (attempt restored)", "info");
        }

        const reasonText =
          entry.reason === "bag_in" ? "Bag In" : entry.reason === "board_hit" ? "Board Hit" : "Miss";
        showToast(`${reasonText} undone: attempt restored, ${entry.delta} tickets removed`, "info");
      }

      ledger.splice(entryIndex, 1);
      saveLedger(ledger);
      saveRegistrations(registrations);

      selectedRegistration = reg;

      renderDetail();
      searchRegistrations();
      renderLedger();
    };

    const updateRoleUI = () => {
      const badge = document.getElementById("roleBadge");
      if (badge) {
        badge.textContent = "ADMIN";
        badge.className = "role-badge role-admin";
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
      currentRole = "admin";
      document.getElementById("loginScreen")?.classList.remove("hidden");
      document.getElementById("mainApp")?.classList.add("hidden");
      const input = document.getElementById("passwordInput") as HTMLInputElement | null;
      if (input) input.value = "";
    };

    const initApp = async () => {
      try {
        await loadState();
        renderLedger();
        searchRegistrations();
      } catch (error) {
        showToast("Failed to load data from Google Sheets", "error");
      }
    };

    const resetAllData = async () => {
      if (!confirm("This will clear all internal data in Google Sheets. Continue?")) return;

      state = {
        contacts: {},
        registrations: [],
        ledger: [],
        draws: [],
        winners: [],
      };

      await persistState();

      selectedRegistration = null;
      document.getElementById("detailCard")?.classList.add("hidden");
      const resultsList = document.getElementById("resultsList");
      if (resultsList) {
        resultsList.innerHTML = `
          <div class="empty-state">
            <div class="empty-state-icon">🔍</div>
            <p>Search for registrations by name or email</p>
          </div>
        `;
      }
      renderLedger();
      showToast("All internal data cleared", "success");
    };

    window.login = login;
    window.logout = logout;
    window.searchRegistrations = searchRegistrations;
    window.selectRegistration = selectRegistration;
    window.scoreAttempt = scoreAttempt;
    window.applyBonus = applyBonus;
    window.undoAction = undoAction;
    window.resetAllData = resetAllData;

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
      window.searchRegistrations = undefined;
      window.selectRegistration = undefined;
      window.scoreAttempt = undefined;
      window.applyBonus = undefined;
      window.undoAction = undefined;
      window.resetAllData = undefined;
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
