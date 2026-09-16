/* =========================================
   ROADLENS — ADMIN DASHBOARD
========================================= */


/* =========================================
   DEMO REPORT DATA
========================================= */

const reports = [

    {
        id: "RL-2026-12842",
        title: "Pothole on Sayajigunj Road",
        type: "Pothole",
        location: "Sayajigunj, Vadodara",
        severity: "High",
        status: "progress",
        date: "Sep 15, 2026",
        description:
            "Large pothole near the road junction. It becomes difficult to notice at night and may be unsafe for two-wheelers."
    },


    {
        id: "RL-2026-12791",
        title: "Damaged road surface",
        type: "Damaged road",
        location: "Alkapuri, Vadodara",
        severity: "Medium",
        status: "review",
        date: "Sep 14, 2026",
        description:
            "A damaged section of the road surface is creating an uneven driving area near the intersection."
    },


    {
        id: "RL-2026-12754",
        title: "Deep pothole near junction",
        type: "Pothole",
        location: "Akota, Vadodara",
        severity: "Critical",
        status: "pending",
        date: "Sep 14, 2026",
        description:
            "A deep pothole has formed near the junction and is affecting traffic movement."
    },


    {
        id: "RL-2026-12692",
        title: "Waterlogging after rainfall",
        type: "Waterlogging",
        location: "Gotri, Vadodara",
        severity: "High",
        status: "progress",
        date: "Sep 13, 2026",
        description:
            "Water accumulation is covering a significant portion of the road after rainfall."
    },


    {
        id: "RL-2026-12631",
        title: "Broken streetlight",
        type: "Streetlight",
        location: "Manjalpur, Vadodara",
        severity: "Low",
        status: "resolved",
        date: "Sep 12, 2026",
        description:
            "Streetlight is not functioning near the residential road."
    },


    {
        id: "RL-2026-12588",
        title: "Road crack near school",
        type: "Damaged road",
        location: "Fatehgunj, Vadodara",
        severity: "High",
        status: "pending",
        date: "Sep 11, 2026",
        description:
            "Multiple cracks have appeared on the road near the school entrance."
    },


    {
        id: "RL-2026-12542",
        title: "Large pothole",
        type: "Pothole",
        location: "Vasna Road, Vadodara",
        severity: "Critical",
        status: "progress",
        date: "Sep 10, 2026",
        description:
            "Large pothole causing vehicles to slow down and move around the damaged section."
    },


    {
        id: "RL-2026-12491",
        title: "Uneven road surface",
        type: "Damaged road",
        location: "Karelibaug, Vadodara",
        severity: "Medium",
        status: "resolved",
        date: "Sep 09, 2026",
        description:
            "Uneven road surface reported near the main road."
    },


    {
        id: "RL-2026-12453",
        title: "Blocked drainage causing waterlogging",
        type: "Waterlogging",
        location: "Harni Road, Vadodara",
        severity: "High",
        status: "review",
        date: "Sep 08, 2026",
        description:
            "Blocked drainage is causing water to collect along the road."
    },


    {
        id: "RL-2026-12394",
        title: "Road damage near market",
        type: "Damaged road",
        location: "Raopura, Vadodara",
        severity: "Medium",
        status: "resolved",
        date: "Sep 07, 2026",
        description:
            "Road surface has deteriorated near the market area."
    }

];


/* =========================================
   DOM
========================================= */

const table =
    document.getElementById("reportsTable");

const searchInput =
    document.getElementById("searchInput");

const statusFilter =
    document.getElementById("statusFilter");

const severityFilter =
    document.getElementById("severityFilter");

const typeFilter =
    document.getElementById("typeFilter");

const reportCount =
    document.getElementById("reportCount");

const paginationInfo =
    document.getElementById("paginationInfo");

const toast =
    document.getElementById("toast");

const sidebar =
    document.getElementById("sidebar");

const mobileMenu =
    document.getElementById("mobileMenu");


/* =========================================
   MODAL ELEMENTS
========================================= */

const reportModal =
    document.getElementById("reportModal");

const modalBackdrop =
    document.getElementById("modalBackdrop");

const closeModal =
    document.getElementById("closeModal");

const cancelModal =
    document.getElementById("cancelModal");

const modalTitle =
    document.getElementById("modalTitle");

const modalId =
    document.getElementById("modalId");

const modalType =
    document.getElementById("modalType");

const modalSeverity =
    document.getElementById("modalSeverity");

const modalLocation =
    document.getElementById("modalLocation");

const modalDate =
    document.getElementById("modalDate");

const modalDescription =
    document.getElementById("modalDescription");

const modalStatus =
    document.getElementById("modalStatus");

const saveStatus =
    document.getElementById("saveStatus");


let selectedReportId = null;

let currentPage = 1;

const reportsPerPage = 6;


/* =========================================
   STATUS HELPERS
========================================= */

function getStatusLabel(status) {

    const labels = {

        pending: "Pending",

        review: "Under review",

        progress: "In progress",

        resolved: "Resolved"

    };

    return labels[status] || status;

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

    return {

        Critical: "severity-critical",

        High: "severity-high",

        Medium: "severity-medium",

        Low: "severity-low"

    }[severity] || "";

}


/* =========================================
   FILTER REPORTS
========================================= */

function getFilteredReports() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const status =
        statusFilter.value;


    const severity =
        severityFilter.value;


    const type =
        typeFilter.value;


    return reports.filter(report => {

        const matchesSearch =
            !search ||
            report.id.toLowerCase().includes(search) ||
            report.title.toLowerCase().includes(search) ||
            report.location.toLowerCase().includes(search) ||
            report.type.toLowerCase().includes(search);


        const matchesStatus =
            status === "all" ||
            report.status === status;


        const matchesSeverity =
            severity === "all" ||
            report.severity === severity;


        const matchesType =
            type === "all" ||
            report.type === type;


        return (
            matchesSearch &&
            matchesStatus &&
            matchesSeverity &&
            matchesType
        );

    });

}


/* =========================================
   RENDER REPORTS
========================================= */

function renderReports() {

    const filtered =
        getFilteredReports();


    const start =
        (currentPage - 1) *
        reportsPerPage;


    const end =
        start + reportsPerPage;


    const visible =
        filtered.slice(start, end);


    table.innerHTML = "";


    if (!visible.length) {

        table.innerHTML = `

      <tr>

        <td colspan="7"
          style="
            text-align:center;
            padding:45px 20px;
            color:#687671;
          ">

          No reports found.

        </td>

      </tr>

    `;

        reportCount.textContent =
            "0 reports";

        paginationInfo.textContent =
            "No matching reports";

        return;

    }


    visible.forEach(report => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

      <td>

        <span class="report-id">
          ${report.id}
        </span>

      </td>


      <td>

        <div class="issue-cell">

          <strong>
            ${report.title}
          </strong>

          <span>
            ${report.type}
          </span>

        </div>

      </td>


      <td>

        <span class="location-cell">
          ${report.location}
        </span>

      </td>


      <td>

        <span
          class="severity ${getSeverityClass(report.severity)}">

          ${report.severity}

        </span>

      </td>


      <td>

        <span
          class="badge ${getStatusClass(report.status)}">

          ${getStatusLabel(report.status)}

        </span>

      </td>


      <td>
        ${report.date}
      </td>


      <td>

        <button
          class="view-report"
          data-report-id="${report.id}">

          View →

        </button>

      </td>

    `;


        table.appendChild(row);

    });


    reportCount.textContent =
        `${filtered.length} ${filtered.length === 1
            ? "report"
            : "reports"
        }`;


    paginationInfo.textContent =

        `Showing ${start + 1
        }–${Math.min(end, filtered.length)
        } of ${filtered.length
        } reports`;


    document
        .querySelectorAll(".view-report")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openReport(
                        button.dataset.reportId
                    );

                }
            );

        });

}


/* =========================================
   OPEN REPORT MODAL
========================================= */

function openReport(id) {

    const report =
        reports.find(
            item => item.id === id
        );


    if (!report) return;


    selectedReportId =
        report.id;


    modalTitle.textContent =
        report.title;


    modalId.textContent =
        report.id;


    modalType.textContent =
        report.type;


    modalSeverity.textContent =
        report.severity;


    modalLocation.textContent =
        report.location;


    modalDate.textContent =
        report.date;


    modalDescription.textContent =
        report.description;


    modalStatus.value =
        report.status;


    reportModal.classList.add("open");

    reportModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE MODAL
========================================= */

function closeReportModal() {

    reportModal.classList.remove(
        "open"
    );


    reportModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


closeModal.addEventListener(
    "click",
    closeReportModal
);


cancelModal.addEventListener(
    "click",
    closeReportModal
);


modalBackdrop.addEventListener(
    "click",
    closeReportModal
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            reportModal.classList.contains("open")
        ) {

            closeReportModal();

        }

    }
);


/* =========================================
   SAVE STATUS
========================================= */

saveStatus.addEventListener(
    "click",
    () => {

        const report =
            reports.find(
                item =>
                    item.id === selectedReportId
            );


        if (!report) return;


        report.status =
            modalStatus.value;


        renderReports();

        updateStatistics();


        closeReportModal();


        showToast(
            `${report.id} status updated successfully ✓`
        );

    }
);


/* =========================================
   STATISTICS
========================================= */

function updateStatistics() {

    const total =
        reports.length;


    const pending =
        reports.filter(
            report =>
                report.status === "pending"
        ).length;


    const progress =
        reports.filter(
            report =>
                report.status === "progress"
        ).length;


    const resolved =
        reports.filter(
            report =>
                report.status === "resolved"
        ).length;


    animateNumber(
        document.querySelector(
            '[data-stat="total"]'
        ),
        total
    );


    animateNumber(
        document.querySelector(
            '[data-stat="pending"]'
        ),
        pending
    );


    animateNumber(
        document.querySelector(
            '[data-stat="progress"]'
        ),
        progress
    );


    animateNumber(
        document.querySelector(
            '[data-stat="resolved"]'
        ),
        resolved
    );

}


/* =========================================
   NUMBER ANIMATION
========================================= */

function animateNumber(
    element,
    target
) {

    const duration = 800;

    const startTime =
        performance.now();


    function update(now) {

        const progress =
            Math.min(
                (now - startTime) /
                duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            Math.floor(
                target * eased
            );


        element.textContent =
            value.toLocaleString();


        if (progress < 1) {

            requestAnimationFrame(
                update
            );

        }

    }


    requestAnimationFrame(
        update
    );

}


/* =========================================
   FILTER EVENTS
========================================= */

[
    searchInput,
    statusFilter,
    severityFilter,
    typeFilter
].forEach(element => {

    element.addEventListener(
        "input",
        () => {

            currentPage = 1;

            renderReports();

        }
    );

});


/* =========================================
   PAGINATION
========================================= */

document
    .getElementById("prevPage")
    ?.addEventListener(
        "click",
        () => {

            if (currentPage > 1) {

                currentPage--;

                renderReports();

            }

        }
    );


document
    .getElementById("nextPage")
    ?.addEventListener(
        "click",
        () => {

            const totalPages =
                Math.ceil(
                    getFilteredReports().length /
                    reportsPerPage
                );


            if (
                currentPage <
                totalPages
            ) {

                currentPage++;

                renderReports();

            }

        }
    );


/* =========================================
   ALL REPORTS BUTTON
========================================= */

document
    .getElementById("allReportsBtn")
    ?.addEventListener(
        "click",
        () => {

            document
                .getElementById("reports")
                ?.scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =========================================
   SIDEBAR NAVIGATION
========================================= */

document
    .querySelectorAll(".sidebar-link")
    .forEach(link => {

        link.addEventListener(
            "click",
            event => {

                event.preventDefault();


                document
                    .querySelectorAll(
                        ".sidebar-link"
                    )
                    .forEach(item =>
                        item.classList.remove(
                            "active"
                        )
                    );


                link.classList.add(
                    "active"
                );


                const section =
                    link.dataset.section;


                const target =
                    document.getElementById(
                        section
                    );


                if (target) {

                    target.scrollIntoView({
                        behavior: "smooth"
                    });

                }


                if (
                    window.innerWidth <= 850
                ) {

                    sidebar.classList.remove(
                        "open"
                    );

                }

            }
        );

    });


/* =========================================
   MOBILE SIDEBAR
========================================= */

mobileMenu?.addEventListener(
    "click",
    () => {

        sidebar.classList.toggle(
            "open"
        );

    }
);


/* =========================================
   REFRESH
========================================= */

document
    .getElementById("refreshBtn")
    ?.addEventListener(
        "click",
        event => {

            const button =
                event.currentTarget;


            button.style.transform =
                "rotate(360deg)";


            setTimeout(() => {

                button.style.transform =
                    "";

            }, 500);


            renderReports();

            updateStatistics();


            showToast(
                "Dashboard data refreshed ✓"
            );

        }
    );


/* =========================================
   NOTIFICATIONS
========================================= */

document
    .getElementById(
        "notificationsBtn"
    )
    ?.addEventListener(
        "click",
        () => {

            showToast(
                "No new critical notifications"
            );

        }
    );


/* =========================================
   EXPORT CSV
========================================= */

document
    .getElementById("exportBtn")
    ?.addEventListener(
        "click",
        () => {

            const headers = [

                "Report ID",
                "Issue",
                "Type",
                "Location",
                "Severity",
                "Status",
                "Date"

            ];


            const rows =
                reports.map(report => [

                    report.id,

                    report.title,

                    report.type,

                    report.location,

                    report.severity,

                    getStatusLabel(
                        report.status
                    ),

                    report.date

                ]);


            const csv = [

                headers,

                ...rows

            ]
                .map(row =>
                    row
                        .map(value =>
                            `"${String(value)
                                .replace(/"/g, '""')}"`
                        )
                        .join(",")
                )
                .join("\n");


            const blob =
                new Blob(
                    [csv],
                    {
                        type:
                            "text/csv;charset=utf-8;"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;

            link.download =
                "roadlens-reports.csv";


            link.click();


            URL.revokeObjectURL(
                url
            );


            showToast(
                "Report data exported ✓"
            );

        }
    );


/* =========================================
   TOAST
========================================= */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        }, 2800);

}


/* =========================================
   INITIALIZE
========================================= */

renderReports();

updateStatistics();