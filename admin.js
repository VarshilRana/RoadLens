/* =========================================
   ROADLENS — ADMIN DASHBOARD
   SUPABASE BACKEND
========================================= */

let reports = [];
let selectedReportId = null;
let currentPage = 1;
const reportsPerPage = 6;

/* =========================================
   DOM
========================================= */

const table = document.getElementById("reportsTable");
const reportSearch = document.getElementById("reportSearch");
const statusFilter = document.getElementById("statusFilter");
const severityFilter = document.getElementById("severityFilter");
const reportCount = document.getElementById("reportCount");
const paginationInfo = document.getElementById("paginationInfo");
const sidebar = document.getElementById("sidebar");
const mobileMenu = document.getElementById("mobileMenu");
const reportModal = document.getElementById("reportModal");

/* =========================================
   AUTH / ADMIN CHECK
========================================= */

async function requireAdmin() {
    const {
        data: { session },
        error: sessionError
    } = await supabaseClient.auth.getSession();

    if (sessionError || !session) {
        window.location.href = "auth.html";
        return null;
    }

    const { data: profile, error: profileError } = await supabaseClient
        .from("profiles")
        .select("role, full_name, email")
        .eq("id", session.user.id)
        .single();

    if (profileError || profile?.role !== "admin") {
        alert("You do not have permission to access the admin panel.");
        await supabaseClient.auth.signOut();
        window.location.href = "index.html";
        return null;
    }

    const adminName = document.querySelector(".admin-info strong");
    const adminEmail = document.querySelector(".admin-info span");
    const avatar = document.querySelector(".admin-profile .avatar");

    const name = profile.full_name || session.user.email?.split("@")[0] || "Admin";
    const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map(part => part.charAt(0).toUpperCase())
        .join("");

    if (adminName) adminName.textContent = name;
    if (adminEmail) adminEmail.textContent = profile.email || session.user.email || "";
    if (avatar) avatar.textContent = initials || "AD";

    return session;
}

/* =========================================
   REPORT HELPERS
========================================= */

function formatIssueType(type) {
    if (!type) return "Road issue";

    return type
        .replace(/-/g, " ")
        .replace(/\b\w/g, char => char.toUpperCase());
}

function normalizeStatus(status) {
    const value = String(status || "").trim().toLowerCase();

    if (value === "pending" || value === "submitted") return "pending";
    if (value === "review" || value === "under review") return "review";
    if (value === "progress" || value === "in progress") return "progress";
    if (value === "resolved") return "resolved";

    return "pending";
}

function getStatusLabel(status) {
    return {
        pending: "Pending",
        review: "Under Review",
        progress: "In Progress",
        resolved: "Resolved"
    }[status] || "Pending";
}

function getStatusClass(status) {
    return {
        pending: "badge-pending",
        review: "badge-review",
        progress: "badge-progress",
        resolved: "badge-resolved"
    }[status] || "badge-pending";
}

function getSeverityClass(severity) {
    const value = String(severity || "");

    return {
        Critical: "severity-critical",
        High: "severity-high",
        Medium: "severity-medium",
        Low: "severity-low"
    }[value] || "";
}

function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric"
    });
}

function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/\"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

/* =========================================
   LOAD REPORTS
========================================= */

async function loadReports() {
    const session = await requireAdmin();
    if (!session) return;

    const { data, error } = await supabaseClient
        .from("reports")
        .select(`
            id,
            user_id,
            issue_type,
            title,
            description,
            severity,
            location_text,
            latitude,
            longitude,
            image_url,
            status,
            created_at,
            updated_at,
            profiles:user_id (
                full_name,
                email
            )
        `)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Failed to load admin reports:", error);
        showToast("Unable to load reports.");
        return;
    }

    reports = (data || []).map(report => ({
        ...report,
        title: report.title || formatIssueType(report.issue_type),
        type: formatIssueType(report.issue_type),
        location: report.location_text || "Location unavailable",
        severity: report.severity || "Low",
        status: normalizeStatus(report.status),
        reporter: report.profiles?.full_name || report.profiles?.email || "Unknown user",
        reporterEmail: report.profiles?.email || "",
        date: formatDate(report.created_at),
        description: report.description || "No description provided."
    }));

    currentPage = 1;
    updateStatistics();
    renderReports();
    updateRecentReports();
}

/* =========================================
   FILTERING
========================================= */

function getFilteredReports() {
    const search = reportSearch?.value.trim().toLowerCase() || "";
    const status = statusFilter?.value || "all";
    const severity = severityFilter?.value || "all";

    return reports.filter(report => {
        const searchable = [
            report.id,
            report.title,
            report.type,
            report.location,
            report.reporter,
            report.reporterEmail
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        const matchesSearch = !search || searchable.includes(search);
        const matchesStatus = status === "all" || report.status === status;
        const matchesSeverity =
            severity === "all" ||
            String(report.severity).toLowerCase() === severity.toLowerCase();

        return matchesSearch && matchesStatus && matchesSeverity;
    });
}

/* =========================================
   RENDER REPORTS
========================================= */

function renderReports() {
    if (!table) return;

    const filtered = getFilteredReports();
    const totalPages = Math.max(1, Math.ceil(filtered.length / reportsPerPage));

    if (currentPage > totalPages) currentPage = totalPages;

    const start = (currentPage - 1) * reportsPerPage;
    const visible = filtered.slice(start, start + reportsPerPage);

    table.innerHTML = "";

    if (!visible.length) {
        table.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;padding:45px 20px;color:#687671;">
                    No reports found.
                </td>
            </tr>
        `;

        if (reportCount) reportCount.textContent = "0 reports";
        if (paginationInfo) paginationInfo.textContent = "No matching reports";
        return;
    }

    visible.forEach(report => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>
                <span class="report-id">${escapeHtml(report.id)}</span>
            </td>
            <td>
                <div class="issue-cell">
                    <strong>${escapeHtml(report.title)}</strong>
                    <span>${escapeHtml(report.type)}</span>
                </div>
            </td>
            <td>
                <span class="location-cell">${escapeHtml(report.location)}</span>
            </td>
            <td>
                <span class="severity ${getSeverityClass(report.severity)}">
                    ${escapeHtml(report.severity)}
                </span>
            </td>
            <td>
                <span class="badge ${getStatusClass(report.status)}">
                    ${getStatusLabel(report.status)}
                </span>
            </td>
            <td>${escapeHtml(report.date)}</td>
            <td>
                <button class="view-report" data-report-id="${escapeHtml(report.id)}">
                    View →
                </button>
            </td>
        `;

        table.appendChild(row);
    });

    if (reportCount) {
        reportCount.textContent = `${filtered.length} ${filtered.length === 1 ? "report" : "reports"}`;
    }

    if (paginationInfo) {
        paginationInfo.textContent =
            `Showing ${start + 1}–${Math.min(start + visible.length, filtered.length)} of ${filtered.length} reports`;
    }
}

/* =========================================
   REPORT MODAL
========================================= */

function openReport(id) {
    const report = reports.find(item => item.id === id);
    if (!report) return;

    selectedReportId = report.id;

    const setText = (elementId, value) => {
        const element = document.getElementById(elementId);
        if (element) element.textContent = value || "—";
    };

    setText("modalId", report.id);
    setText("modalIssue", report.title);
    setText("modalLocation", report.location);
    setText("modalReporter", report.reporter);
    setText("modalSeverity", report.severity);
    setText("modalStatus", getStatusLabel(report.status));

    const select = document.getElementById("updateStatus");
    if (select) select.value = report.status;

    reportModal?.classList.add("open");
}

function closeReport() {
    reportModal?.classList.remove("open");
    selectedReportId = null;
}

/* =========================================
   UPDATE REPORT STATUS — REAL SUPABASE UPDATE
========================================= */

async function updateReportStatus() {
    if (!selectedReportId) return;

    const newStatus = document.getElementById("updateStatus")?.value;
    if (!newStatus) return;

    const session = await requireAdmin();
    if (!session) return;

    const button = document.querySelector('#reportModal .btn-primary');
    if (button) button.disabled = true;

    const { data, error } = await supabaseClient
        .from("reports")
        .update({
            status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq("id", selectedReportId)
        .select()
        .single();

    if (button) button.disabled = false;

    if (error) {
        console.error("Failed to update report status:", error);
        showToast("Unable to update report status.");
        return;
    }

    const index = reports.findIndex(report => report.id === selectedReportId);

    if (index !== -1 && data) {
        reports[index] = {
            ...reports[index],
            ...data,
            status: normalizeStatus(data.status),
            date: formatDate(data.created_at)
        };
    }

    showToast(`${selectedReportId} updated to ${getStatusLabel(newStatus)} ✓`);

    closeReport();
    updateStatistics();
    renderReports();
    updateRecentReports();
}

/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {
    const total = reports.length;
    const pending = reports.filter(report => report.status === "pending" || report.status === "review").length;
    const progress = reports.filter(report => report.status === "progress").length;
    const resolved = reports.filter(report => report.status === "resolved").length;

    const values = { total, pending, progress, resolved };

    Object.entries(values).forEach(([key, value]) => {
        const element = document.querySelector(`[data-stat="${key}"]`);
        if (element) animateNumber(element, value);
    });

    const totalText = document.querySelector("#dashboardTotalReports");
    if (totalText) totalText.textContent = total.toLocaleString();
}

function animateNumber(element, target) {
    if (!element) return;

    const duration = 500;
    const start = performance.now();
    const from = Number(element.textContent.replace(/,/g, "")) || 0;

    function update(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const value = Math.round(from + (target - from) * eased);

        element.textContent = value.toLocaleString();

        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

/* =========================================
   RECENT REPORTS
========================================= */

function updateRecentReports() {
    const container = document.querySelector(".report-list");
    if (!container) return;

    const recent = reports.slice(0, 3);

    container.innerHTML = recent.length
        ? recent.map(report => `
            <div class="report-item">
                <div class="report-thumb">◉</div>
                <div class="report-info">
                    <strong>${escapeHtml(report.title)}</strong>
                    <p>${escapeHtml(report.location)}</p>
                </div>
                <span class="status ${report.status === "review" ? "progress" : report.status}">
                    ${escapeHtml(getStatusLabel(report.status))}
                </span>
            </div>
        `).join("")
        : `<div style="padding:24px;color:#718077;">No reports yet.</div>`;
}

/* =========================================
   FILTER EVENTS
========================================= */

reportSearch?.addEventListener("input", () => {
    currentPage = 1;
    renderReports();
});

statusFilter?.addEventListener("change", () => {
    currentPage = 1;
    renderReports();
});

severityFilter?.addEventListener("change", () => {
    currentPage = 1;
    renderReports();
});

/* =========================================
   PAGINATION
========================================= */

document.getElementById("prevPage")?.addEventListener("click", () => {
    if (currentPage > 1) {
        currentPage--;
        renderReports();
    }
});

document.getElementById("nextPage")?.addEventListener("click", () => {
    const totalPages = Math.max(1, Math.ceil(getFilteredReports().length / reportsPerPage));

    if (currentPage < totalPages) {
        currentPage++;
        renderReports();
    }
});

/* =========================================
   DYNAMIC REPORT BUTTON HANDLER
========================================= */

table?.addEventListener("click", event => {
    const button = event.target.closest(".view-report");
    if (!button) return;

    openReport(button.dataset.reportId);
});

/* =========================================
   REFRESH
========================================= */

document.getElementById("refreshBtn")?.addEventListener("click", async event => {
    const button = event.currentTarget;
    button.style.transform = "rotate(360deg)";

    setTimeout(() => {
        button.style.transform = "";
    }, 500);

    await loadReports();
    showToast("Dashboard data refreshed ✓");
});

/* =========================================
   MOBILE SIDEBAR
========================================= */

mobileMenu?.addEventListener("click", () => {
    sidebar?.classList.toggle("open");
});

/* =========================================
   SIDEBAR NAVIGATION
========================================= */

document.querySelectorAll(".nav-item").forEach(button => {
    button.addEventListener("click", () => {
        const viewName = button.dataset.view;
        document.querySelectorAll(".view").forEach(view => view.classList.remove("active"));
        document.getElementById(viewName)?.classList.add("active");

        document.querySelectorAll(".nav-item").forEach(item => {
            item.classList.toggle("active", item === button);
        });

        const pageTitles = {
            dashboard: "Dashboard",
            reports: "Reports",
            analytics: "Analytics",
            users: "Users",
            settings: "Settings"
        };

        const pageTitle = document.getElementById("pageTitle");
        if (pageTitle) pageTitle.textContent = pageTitles[viewName] || "Dashboard";
    });
});

/* =========================================
   TOAST
========================================= */

function showToast(message) {
    const toast = document.getElementById("toast");
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

/* =========================================
   CLOSE MODAL EVENTS
========================================= */

document.getElementById("closeModal")?.addEventListener("click", closeReport);
document.getElementById("cancelModal")?.addEventListener("click", closeReport);
document.getElementById("modalBackdrop")?.addEventListener("click", closeReport);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && reportModal?.classList.contains("open")) {
        closeReport();
    }
});

/* =========================================
   INITIALIZE
========================================= */

loadReports();