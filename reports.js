/* =========================================
   ROADLENS — MY REPORTS
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

        statusLabel: "In progress",

        date: "Sep 15, 2026",

        update: "Repair team assigned",

        description:
            "Large pothole near the road junction. It becomes difficult to notice at night and may be unsafe for two-wheelers.",

        timeline: [

            {
                title: "Report submitted",

                description:
                    "Your road issue was successfully received.",

                time: "Sep 15 · 10:42 AM",

                state: "complete"

            },

            {
                title: "Report verified",

                description:
                    "The issue was reviewed and verified.",

                time: "Sep 15 · 11:08 AM",

                state: "complete"

            },

            {
                title: "Repair team assigned",

                description:
                    "The issue has been assigned for road repair.",

                time: "Sep 15 · 01:24 PM",

                state: "current"

            },

            {
                title: "Road repair",

                description:
                    "Repair work will begin at the reported location.",

                time: "Pending",

                state: ""

            },

            {
                title: "Issue resolved",

                description:
                    "The road issue will be marked resolved after completion.",

                time: "Pending",

                state: ""

            }

        ]

    },


    {
        id: "RL-2026-12791",

        title: "Damaged road surface",

        type: "Damaged road",

        location: "Alkapuri, Vadodara",

        severity: "Medium",

        status: "review",

        statusLabel: "Under review",

        date: "Sep 14, 2026",

        update: "Report is being reviewed",

        description:
            "A damaged section of the road surface is creating an uneven driving area near the intersection.",

        timeline: [

            {
                title: "Report submitted",

                description:
                    "Your road issue was successfully received.",

                time: "Sep 14 · 04:18 PM",

                state: "complete"

            },

            {
                title: "Under review",

                description:
                    "The report is currently being verified.",

                time: "Sep 15 · 09:15 AM",

                state: "current"

            },

            {
                title: "Repair team assigned",

                description:
                    "A repair team will be assigned after verification.",

                time: "Pending",

                state: ""

            },

            {
                title: "Road repair",

                description:
                    "Repair work will begin after assignment.",

                time: "Pending",

                state: ""

            },

            {
                title: "Issue resolved",

                description:
                    "The issue will be marked resolved after completion.",

                time: "Pending",

                state: ""

            }

        ]

    },


    {
        id: "RL-2026-12673",

        title: "Broken streetlight",

        type: "Streetlight",

        location: "Fatehgunj, Vadodara",

        severity: "High",

        status: "resolved",

        statusLabel: "Resolved",

        date: "Sep 12, 2026",

        update: "Streetlight repaired",

        description:
            "Streetlight near the pedestrian crossing was not working during the evening.",

        timeline: [

            {
                title: "Report submitted",

                description:
                    "Your road issue was successfully received.",

                time: "Sep 10 · 07:32 PM",

                state: "complete"

            },

            {
                title: "Report verified",

                description:
                    "The issue was reviewed and verified.",

                time: "Sep 11 · 09:12 AM",

                state: "complete"

            },

            {
                title: "Repair team assigned",

                description:
                    "The issue was assigned to the maintenance team.",

                time: "Sep 11 · 11:40 AM",

                state: "complete"

            },

            {
                title: "Repair completed",

                description:
                    "The streetlight was repaired successfully.",

                time: "Sep 12 · 06:20 PM",

                state: "complete"

            },

            {
                title: "Issue resolved",

                description:
                    "The report has been marked as resolved.",

                time: "Sep 12 · 07:05 PM",

                state: "complete"

            }

        ]

    },


    {
        id: "RL-2026-12448",

        title: "Cracked road surface",

        type: "Cracked road",

        location: "Manjalpur, Vadodara",

        severity: "Low",

        status: "resolved",

        statusLabel: "Resolved",

        date: "Sep 08, 2026",

        update: "Road surface repaired",

        description:
            "Several cracks were visible across the road surface near the residential lane.",

        timeline: [

            {
                title: "Report submitted",

                description:
                    "Your road issue was successfully received.",

                time: "Sep 08 · 09:14 AM",

                state: "complete"

            },

            {
                title: "Report verified",

                description:
                    "The issue was reviewed and verified.",

                time: "Sep 08 · 11:30 AM",

                state: "complete"

            },

            {
                title: "Repair team assigned",

                description:
                    "The issue was assigned to the road maintenance team.",

                time: "Sep 09 · 10:15 AM",

                state: "complete"

            },

            {
                title: "Road repair",

                description:
                    "The damaged surface was repaired.",

                time: "Sep 10 · 03:40 PM",

                state: "complete"

            },

            {
                title: "Issue resolved",

                description:
                    "The report has been marked as resolved.",

                time: "Sep 10 · 04:05 PM",

                state: "complete"

            }

        ]

    }

];


/* =========================================
   DOM
========================================= */

const reportsList =
    document.getElementById("reportsList");

const emptyState =
    document.getElementById("emptyState");

const reportCount =
    document.getElementById("reportCount");

const filterButtons =
    document.querySelectorAll(".filter-btn");


/* =========================================
   STATUS
========================================= */

function getStatusClass(status) {

    if (status === "progress") {
        return "status-progress";
    }

    if (status === "review") {
        return "status-review";
    }

    if (status === "resolved") {
        return "status-resolved";
    }

    return "status-submitted";

}


function getStatusLabel(status) {

    if (status === "progress") {
        return "In progress";
    }

    if (status === "review") {
        return "Under review";
    }

    if (status === "resolved") {
        return "Resolved";
    }

    return "Submitted";

}


/* =========================================
   SEVERITY
========================================= */

function getSeverityClass(severity) {

    return severity.toLowerCase();

}


/* =========================================
   PROGRESS BUILDER
========================================= */

function getProgressHTML(report) {

    const stages = [
        "Submitted",
        "Verified",
        "In progress",
        "Resolved"
    ];


    let currentIndex = 0;


    if (report.status === "review") {
        currentIndex = 1;
    }

    if (report.status === "progress") {
        currentIndex = 2;
    }

    if (report.status === "resolved") {
        currentIndex = 3;
    }


    let html = "";


    stages.forEach((stage, index) => {

        const complete =
            index < currentIndex;

        const current =
            index === currentIndex;


        if (index > 0) {

            html += `
        <div
          class="progress-line
          ${complete || current ? "complete" : ""}"
        ></div>
      `;

        }


        html += `
      <div class="progress-step">

        <div
          class="progress-node
          ${complete ? "complete" : ""}
          ${current ? "current" : ""}"
        >
          ${complete ? "✓" : ""}
        </div>

        <span
          class="progress-label
          ${current ? "active" : ""}"
        >
          ${stage}
        </span>

      </div>
    `;

    });


    return html;

}


/* =========================================
   REPORT CARD
========================================= */

function createReportCard(report, index) {

    const statusClass =
        getStatusClass(report.status);

    const statusLabel =
        getStatusLabel(report.status);

    const severityClass =
        getSeverityClass(report.severity);


    return `

    <article
      class="report-card"
      style="animation-delay:${index * 70}ms"
    >

      <div class="report-top">

        <span class="report-id-small">
          ${report.id}
        </span>

        <span class="status ${statusClass}">
          <i class="status-dot"></i>
          ${statusLabel}
        </span>

      </div>


      <div class="report-main">

        <div>

          <div class="report-title-row">

            <h3 class="report-title">
              ${report.title}
            </h3>

            <span
              class="severity ${severityClass}"
            >
              ${report.severity}
            </span>

          </div>


          <div class="report-location">
            📍 ${report.location}
          </div>


          <div class="report-date">
            Reported ${report.date}
          </div>


          <div class="progress">

            ${getProgressHTML(report)}

          </div>

        </div>


        <button
          class="view-btn"
          data-report-id="${report.id}"
        >
          View details →
        </button>

      </div>


      <div class="latest-update">

        <span class="update-dot"></span>

        <span>
          Latest update ·
          <strong>${report.update}</strong>
        </span>

      </div>

    </article>

  `;

}


/* =========================================
   RENDER REPORTS
========================================= */

function renderReports(filter = "all") {

    let filteredReports = reports;


    if (filter === "active") {

        filteredReports =
            reports.filter(report =>
                report.status !== "resolved"
            );

    }


    if (filter === "resolved") {

        filteredReports =
            reports.filter(report =>
                report.status === "resolved"
            );

    }


    reportsList.innerHTML =
        filteredReports
            .map(createReportCard)
            .join("");


    reportCount.textContent =
        `${filteredReports.length} ${filteredReports.length === 1
            ? "report"
            : "reports"
        }`;


    if (!filteredReports.length) {

        reportsList.style.display =
            "none";

        emptyState.style.display =
            "block";

    } else {

        reportsList.style.display =
            "grid";

        emptyState.style.display =
            "none";

    }


    /* Attach view buttons */

    document
        .querySelectorAll(".view-btn")
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    openDetails(
                        button.dataset.reportId
                    );

                }
            );

        });

}


/* =========================================
   SUMMARY COUNTERS
========================================= */

function updateSummary() {

    const total =
        reports.length;


    const review =
        reports.filter(
            report =>
                report.status === "review"
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


    document.getElementById(
        "totalCount"
    ).textContent = total;


    document.getElementById(
        "reviewCount"
    ).textContent = review;


    document.getElementById(
        "progressCount"
    ).textContent = progress;


    document.getElementById(
        "resolvedCount"
    ).textContent = resolved;

}


/* =========================================
   FILTERS
========================================= */

filterButtons.forEach(button => {

    button.addEventListener(
        "click",
        () => {

            filterButtons.forEach(btn => {

                btn.classList.remove(
                    "active"
                );

            });


            button.classList.add(
                "active"
            );


            renderReports(
                button.dataset.filter
            );

        }
    );

});


/* =========================================
   DETAILS MODAL
========================================= */

const detailsModal =
    document.getElementById(
        "detailsModal"
    );

const detailsBackdrop =
    document.getElementById(
        "detailsBackdrop"
    );

const detailsClose =
    document.getElementById(
        "detailsClose"
    );


function openDetails(reportId) {

    const report =
        reports.find(
            item =>
                item.id === reportId
        );


    if (!report) return;


    document.getElementById(
        "detailsTitle"
    ).textContent =
        report.title;


    document.getElementById(
        "detailsId"
    ).textContent =
        report.id;


    document.getElementById(
        "detailsDescription"
    ).textContent =
        report.description;


    /* Status */

    document.getElementById(
        "detailsStatus"
    ).innerHTML = `

    <span class="status ${getStatusClass(report.status)}">

      <i class="status-dot"></i>

      ${getStatusLabel(report.status)}

    </span>

  `;


    /* Timeline */

    const timeline =
        document.getElementById(
            "timeline"
        );


    timeline.innerHTML =
        report.timeline
            .map(item => `

        <div
          class="timeline-item ${item.state}"
        >

          <div class="timeline-node">

            ${item.state === "complete"
                    ? "✓"
                    : ""
                }

          </div>

          <h4>
            ${item.title}
          </h4>

          <p>
            ${item.description}
          </p>

          <time>
            ${item.time}
          </time>

        </div>

      `)
            .join("");


    /* Details info */

    document.getElementById(
        "detailsInfo"
    ).innerHTML = `

    <div class="info-box">

      <span>
        Issue type
      </span>

      <strong>
        ${report.type}
      </strong>

    </div>


    <div class="info-box">

      <span>
        Severity
      </span>

      <strong>
        ${report.severity}
      </strong>

    </div>


    <div class="info-box">

      <span>
        Location
      </span>

      <strong>
        ${report.location}
      </strong>

    </div>


    <div class="info-box">

      <span>
        Reported
      </span>

      <strong>
        ${report.date}
      </strong>

    </div>

  `;


    detailsModal.classList.add(
        "open"
    );


    detailsModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


/* =========================================
   CLOSE DETAILS
========================================= */

function closeDetails() {

    detailsModal.classList.remove(
        "open"
    );


    detailsModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


detailsClose?.addEventListener(
    "click",
    closeDetails
);


detailsBackdrop?.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            detailsBackdrop
        ) {

            closeDetails();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape" &&
            detailsModal.classList.contains(
                "open"
            )
        ) {

            closeDetails();

        }

    }
);


/* =========================================
   MOBILE NAV
========================================= */

const menuBtn =
    document.getElementById(
        "menuBtn"
    );

const navLinks =
    document.getElementById(
        "navLinks"
    );


menuBtn?.addEventListener(
    "click",
    () => {

        navLinks.classList.toggle(
            "open"
        );


        menuBtn.textContent =
            navLinks.classList.contains(
                "open"
            )
                ? "×"
                : "☰";

    }
);


/* =========================================
   NEW REPORT
========================================= */

function goToReport() {

    window.location.href =
        "index.html?openReport=1";

}

document.getElementById(
    "newReportBtn"
)?.addEventListener(
    "click",
    goToReport
);


document.getElementById(
    "emptyReportBtn"
)?.addEventListener(
    "click",
    goToReport
);


/* =========================================
   SIGN IN
========================================= */

document.getElementById(
    "signInBtn"
)?.addEventListener(
    "click",
    () => {

        showToast(
            "Sign in flow coming next"
        );

    }
);


/* =========================================
   REPORT ISSUE NAV BUTTON
========================================= */

document.getElementById(
    "reportIssueBtn"
)?.addEventListener(
    "click",
    goToReport
);


/* =========================================
   TOAST
========================================= */

const toast =
    document.getElementById(
        "toast"
    );


function showToast(message) {

    if (!toast) return;


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        window.roadLensToast
    );


    window.roadLensToast =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            2600
        );

}


/* =========================================
   INITIALIZE
========================================= */

updateSummary();

renderReports("all");