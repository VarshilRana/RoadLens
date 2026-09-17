const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const toast = document.getElementById("toast");

menuBtn?.addEventListener("click", () => {
  navLinks.classList.toggle("open");
  menuBtn.textContent = navLinks.classList.contains("open") ? "×" : "☰";
});

document.querySelectorAll(".nav-links a").forEach(link => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuBtn.textContent = "☰";
  });
});

function scrollToReport() {
  openReportForm();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function submitReport() {
  showToast("Demo report submitted successfully ✓");
}

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

const counters = document.querySelectorAll("[data-count]");
let countersStarted = false;

const counterObserver = new IntersectionObserver(entries => {
  if (!entries[0].isIntersecting || countersStarted) return;
  countersStarted = true;
  counters.forEach(el => {
    const target = Number(el.dataset.count);
    const suffix = el.textContent.includes("%") ? "%" : "";
    const duration = 1300;
    const start = performance.now();

    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.floor(target * eased);
      el.textContent = value.toLocaleString() + suffix;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}, { threshold: 0.4 });

const stats = document.querySelector(".stats");
if (stats) counterObserver.observe(stats);

window.addEventListener("scroll", () => {
  const header = document.querySelector("header");
  if (window.scrollY > 20) {
    header.style.background = "rgba(245,247,244,.88)";
    header.style.backdropFilter = "blur(14px)";
    header.style.borderBottom = "1px solid rgba(223,230,225,.8)";
  } else {
    header.style.background = "transparent";
    header.style.backdropFilter = "none";
    header.style.borderBottom = "0";
  }
});
/* =========================================
   ROADLENS REPORT FORM
========================================= */

const reportModal =
  document.getElementById("reportModal");

const closeReport =
  document.getElementById("closeReport");

const reportBackdrop =
  document.getElementById("reportBackdrop");

const reportForm =
  document.getElementById("reportForm");

const reportSuccess =
  document.getElementById("reportSuccess");

const finishReport =
  document.getElementById("finishReport");



/* =========================================
   OPEN REPORT FORM
========================================= */

function openReportForm() {

  if (!reportModal) return;

  reportModal.classList.add("open");

  reportModal.setAttribute(
    "aria-hidden",
    "false"
  );

  document.body.style.overflow = "hidden";

}


/* =========================================
   OPEN REPORT FORM FROM MY REPORTS
========================================= */

const reportParams =
  new URLSearchParams(window.location.search);

if (
  reportParams.get("openReport") === "1"
) {

  openReportForm();

  // Remove query parameter from URL
  window.history.replaceState(
    {},
    document.title,
    window.location.pathname
  );

}

/* =========================================
   CLOSE REPORT FORM
========================================= */

function closeReportForm() {

  if (!reportModal) return;

  reportModal.classList.remove("open");

  reportModal.setAttribute(
    "aria-hidden",
    "true"
  );

  document.body.style.overflow = "";

}


/* =========================================
   CLOSE
========================================= */

closeReport?.addEventListener(
  "click",
  closeReportForm
);


reportBackdrop?.addEventListener(
  "click",
  closeReportForm
);


document.addEventListener(
  "keydown",
  function (event) {

    if (
      event.key === "Escape" &&
      reportModal?.classList.contains("open")
    ) {

      closeReportForm();

    }

  }
);



/* =========================================
   PHOTO UPLOAD
========================================= */

const photoUpload =
  document.getElementById("photoUpload");

const roadPhoto =
  document.getElementById("roadPhoto");

const photoEmpty =
  document.getElementById("photoEmpty");

const photoPreview =
  document.getElementById("photoPreview");

const photoPreviewImage =
  document.getElementById(
    "photoPreviewImage"
  );

const photoName =
  document.getElementById("photoName");

const photoSize =
  document.getElementById("photoSize");

const removePhoto =
  document.getElementById("removePhoto");



photoUpload?.addEventListener(
  "click",
  function (event) {

    if (
      !event.target.closest(
        "#removePhoto"
      )
    ) {

      roadPhoto.click();

    }

  }
);



roadPhoto?.addEventListener(
  "change",
  function () {

    const file =
      this.files[0];

    if (file) {

      processRoadPhoto(file);

    }

  }
);



function processRoadPhoto(file) {

  const photoError =
    document.getElementById(
      "photoError"
    );


  /* Validate type */

  if (
    !file.type.startsWith("image/")
  ) {

    photoError.textContent =
      "Please upload a valid image.";

    return;

  }


  /* Validate size */

  if (
    file.size >
    5 * 1024 * 1024
  ) {

    photoError.textContent =
      "Image must be smaller than 5 MB.";

    return;

  }


  photoError.textContent = "";


  const reader =
    new FileReader();


  reader.onload =
    function (event) {

      photoPreviewImage.src =
        event.target.result;

      photoName.textContent =
        file.name;

      photoSize.textContent =
        `${(
          file.size /
          1024 /
          1024
        ).toFixed(2)} MB`;

      photoEmpty.hidden =
        true;

      photoPreview.hidden =
        false;

    };


  reader.readAsDataURL(file);

}



/* =========================================
   DRAG & DROP
========================================= */

[
  "dragenter",
  "dragover"
].forEach(eventName => {

  photoUpload?.addEventListener(
    eventName,
    function (event) {

      event.preventDefault();

      photoUpload.classList.add(
        "dragging"
      );

    }
  );

});


[
  "dragleave",
  "drop"
].forEach(eventName => {

  photoUpload?.addEventListener(
    eventName,
    function (event) {

      event.preventDefault();

      photoUpload.classList.remove(
        "dragging"
      );

    }
  );

});


photoUpload?.addEventListener(
  "drop",
  function (event) {

    const file =
      event.dataTransfer.files[0];

    if (file) {

      processRoadPhoto(file);

    }

  }
);



/* =========================================
   REMOVE PHOTO
========================================= */

removePhoto?.addEventListener(
  "click",
  function (event) {

    event.stopPropagation();

    roadPhoto.value = "";

    photoPreviewImage.src = "";

    photoPreview.hidden =
      true;

    photoEmpty.hidden =
      false;

  }
);



/* =========================================
   DESCRIPTION COUNTER
========================================= */

const roadDescription =
  document.getElementById(
    "roadDescription"
  );

const descriptionCount =
  document.getElementById(
    "descriptionCount"
  );


roadDescription?.addEventListener(
  "input",
  function () {

    descriptionCount.textContent =
      this.value.length;

  }
);



/* =========================================
   CURRENT LOCATION
========================================= */

const currentLocation =
  document.getElementById(
    "currentLocation"
  );

const roadLocation =
  document.getElementById(
    "roadLocation"
  );


currentLocation?.addEventListener(
  "click",
  function () {

    if (!navigator.geolocation) {

      roadLocation.value =
        "Location unavailable — enter manually";

      return;

    }


    currentLocation.disabled =
      true;

    currentLocation.textContent =
      "Detecting…";


    navigator.geolocation.getCurrentPosition(

      function (position) {

        const latitude =
          position.coords.latitude
            .toFixed(5);

        const longitude =
          position.coords.longitude
            .toFixed(5);


        roadLocation.value =
          `Current location · ${latitude}, ${longitude}`;


        currentLocation.textContent =
          "Location detected ✓";


        setTimeout(
          function () {

            currentLocation.disabled =
              false;

            currentLocation.textContent =
              "Use current location";

          },
          1800
        );

      },


      function () {

        roadLocation.value =
          "Unable to detect location — enter manually";

        currentLocation.disabled =
          false;

        currentLocation.textContent =
          "Try again";

      },


      {
        enableHighAccuracy: true,
        timeout: 7000
      }

    );

  }
);



/* =========================================
   VALIDATION
========================================= */

function validateRoadReport() {

  let valid = true;


  const issueType =
    document.getElementById(
      "issueType"
    );


  const location =
    document.getElementById(
      "roadLocation"
    );


  const severity =
    document.querySelector(
      'input[name="severity"]:checked'
    );


  const issueField =
    issueType.closest(
      ".report-field"
    );


  const locationField =
    location.closest(
      ".report-field"
    );


  issueField.classList.remove(
    "invalid"
  );

  locationField.classList.remove(
    "invalid"
  );


  if (!issueType.value) {

    issueField.classList.add(
      "invalid"
    );

    issueField.querySelector(
      ".report-error"
    ).textContent =
      "Please select an issue type.";

    valid = false;

  }


  if (!location.value.trim()) {

    locationField.classList.add(
      "invalid"
    );

    locationField.querySelector(
      ".report-error"
    ).textContent =
      "Please enter the issue location.";

    valid = false;

  }


  if (!severity) {

    showToast(
      "Please select the issue severity."
    );

    valid = false;

  }


  return valid;

}



/* =========================================
   SUBMIT
========================================= */

reportForm?.addEventListener(
  "submit",
  async function (event) {

    event.preventDefault();

    if (!validateRoadReport()) {
      return;
    }

    const {
      data: { session }
    } = await supabaseClient.auth.getSession();

    if (!session) {
      showToast("Please sign in to submit a report.");
      return;
    }

    const submitButton = this.querySelector(".report-submit");
    const submitText = document.getElementById("reportSubmitText");

    submitButton.disabled = true;
    submitText.textContent = "Submitting…";

    const issueType = document.getElementById("issueType").value;
    const location = document.getElementById("roadLocation").value.trim();
    const description = document.getElementById("roadDescription").value.trim();

    const severity = document.querySelector(
      'input[name="severity"]:checked'
    )?.value;
    let latitude = null;
    let longitude = null;
    const photoFile = document.getElementById("roadPhoto")?.files?.[0] || null;
    const coordinateMatch = location.match(
      /(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/
    );

    if (coordinateMatch) {
      latitude = parseFloat(coordinateMatch[1]);
      longitude = parseFloat(coordinateMatch[2]);
    }
    try {

      let imageUrl = null;

      if (photoFile) {

        const fileExtension = photoFile.name
          .split(".")
          .pop()
          .toLowerCase();

        const fileName =
          `${session.user.id}/${crypto.randomUUID()}.${fileExtension}`;

        const { error: uploadError } = await supabaseClient
          .storage
          .from("road-images")
          .upload(fileName, photoFile, {
            cacheControl: "3600",
            upsert: false
          });

        if (uploadError) {
          throw uploadError;
        }

        const { data: publicUrlData } = supabaseClient
          .storage
          .from("road-images")
          .getPublicUrl(fileName);

        imageUrl = publicUrlData.publicUrl;
      }

      const { data, error } = await supabaseClient
        .from("reports")
        .insert({
          user_id: session.user.id,
          issue_type: issueType,
          description: description,
          severity: severity,
          location_text: location,
          latitude: latitude,
          longitude: longitude,
          image_url: imageUrl,
          status: "Submitted"
        })
        .select()
        .single();

      if (error) {
        throw error;
      }

      console.log("Report created:", data);

      document.getElementById("generatedReportId").textContent =
        data.id;

      reportForm.hidden = true;

      document.querySelector(".report-dialog-head").hidden = true;

      reportSuccess.hidden = false;

      showToast("Report submitted successfully ✓");

    } catch (error) {

      console.error("Report submission error:", error);

      showToast(
        error.message || "Unable to submit report."
      );

    } finally {

      submitButton.disabled = false;
      submitText.textContent = "Submit report";

    }

  }
);



/* =========================================
   COPY REPORT ID
========================================= */

document
  .getElementById("copyReportId")
  ?.addEventListener(
    "click",
    async function () {

      const reportId =
        document.getElementById(
          "generatedReportId"
        ).textContent;


      try {

        await navigator.clipboard
          .writeText(reportId);


        this.textContent =
          "Copied ✓";


        setTimeout(
          () => {

            this.textContent =
              "Copy";

          },
          1600
        );

      } catch {

        showToast(reportId);

      }

    }
  );



/* =========================================
   FINISH / RESET
========================================= */

finishReport?.addEventListener(
  "click",
  function () {

    closeReportForm();


    reportForm.reset();


    reportForm.hidden =
      false;


    reportSuccess.hidden =
      true;


    document.querySelector(
      ".report-dialog-head"
    ).hidden =
      false;


    photoPreview.hidden =
      true;


    photoEmpty.hidden =
      false;


    photoPreviewImage.src =
      "";


    descriptionCount.textContent =
      "0";


    document.getElementById(
      "reportSubmitText"
    ).textContent =
      "Submit report";

  }
);