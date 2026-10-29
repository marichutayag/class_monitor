const user = requireRole(["classrep", "instructor"]);
let reader = null;
let cameraOn = false;
let lastCode = "";
let lastScanTime = 0;

if (user) {
  setupHeader(user);
  setupScanner();
  showSession();
  showScans();
}

function setupScanner() {
  if (!getSession()) {
    startSession(course.grace);
  }

  document.getElementById("back-link").hidden = user.role !== "instructor";
  document.getElementById("class-name").textContent = course.code + " · " + course.title + " · " + course.section;
  document.getElementById("camera-btn").addEventListener("click", toggleCamera);

  document.getElementById("manual-form").addEventListener("submit", function (event) {
    event.preventDefault();
    const input = document.getElementById("manual-id");
    recordAttendance(input.value.trim());
    input.value = "";
  });
}

function showSession() {
  const session = getSession();
  const info = document.getElementById("session-info");

  if (session.end) {
    document.getElementById("session-pill").classList.add("ended");
    info.textContent = "Session ended at " + formatTime(session.end);
    return;
  }

  info.textContent = "Session opened " + formatTime(session.start) + " · Late after " + formatTime(lateTime(session));
}

function toggleCamera() {
  const button = document.getElementById("camera-btn");

  if (typeof Html5Qrcode === "undefined") {
    showError("Scanner unavailable", "Check your internet connection, or type the Student ID below.");
    return;
  }

  button.disabled = true;

  if (cameraOn) {
    reader.stop().then(function () {
      setCamera(false);
    });
    return;
  }

  if (!reader) {
    reader = new Html5Qrcode("reader");
  }

  reader.start({ facingMode: "environment" }, { fps: 10 }, handleScan)
    .then(function () {
      setCamera(true);
    })
    .catch(function () {
      setCamera(false);
      showError("Camera unavailable", "Allow camera access, or type the Student ID below.");
    });
}

function setCamera(on) {
  const button = document.getElementById("camera-btn");

  cameraOn = on;
  button.disabled = false;
  document.getElementById("viewfinder").classList.toggle("scanning", on);

  if (on) {
    button.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">videocam_off</span>Stop camera`;
  } else {
    button.innerHTML = `<span class="material-symbols-rounded" aria-hidden="true">photo_camera</span>Start camera`;
  }
}

function handleScan(text) {
  const now = Date.now();

  if (text === lastCode && now - lastScanTime < 5000) {
    return;
  }

  lastCode = text;
  lastScanTime = now;
  recordAttendance(text.trim());
}

function recordAttendance(id) {
  const student = findStudent(id);
  const session = getSession() || startSession(course.grace);

  if (!student) {
    showError("Not on the class list", `No student in ${course.section} has the ID "${safeText(id)}".`);
    return;
  }

  if (session.end) {
    showError("Session closed", "Today's attendance session has already ended.");
    return;
  }

  const existing = findScan(student.id, session.date);
  if (existing) {
    showResult(student, existing, "Already recorded");
    return;
  }

  const now = Date.now();
  const scan = {
    id: student.id,
    date: session.date,
    time: now,
    status: now > lateTime(session) ? "late" : "present"
  };
  const scans = loadList("cm-scans");
  scans.push(scan);
  saveList("cm-scans", scans);

  showResult(student, scan, "Attendance recorded");
  showScans();
}

function showResult(student, scan, title) {
  const result = document.getElementById("result");
  result.className = "card result " + scan.status;
  result.innerHTML = `
    <span class="avatar large">${getInitials(student.name)}</span>
    <div class="result-info">
      <p class="result-title">${title}</p>
      <h3>${student.name}</h3>
      <span>${student.id} · ${formatTime(scan.time)}</span>
    </div>
    ${badge(scan.status)}`;
}

function showError(title, text) {
  const result = document.getElementById("result");
  result.className = "card result error";
  result.innerHTML = `
    <span class="result-icon"><span class="material-symbols-rounded" aria-hidden="true">error</span></span>
    <div class="result-info">
      <p class="result-title">${title}</p>
      <span>${text}</span>
    </div>`;
}

function showScans() {
  const today = todayKey();
  const list = document.getElementById("scan-list");
  const scans = loadList("cm-scans").filter(function (scan) {
    return scan.date === today && scan.status !== "absent";
  }).reverse();

  document.getElementById("scan-count").textContent = scans.length + " of " + students.length + " students";

  if (scans.length === 0) {
    list.innerHTML = `<li class="empty">No scans yet today.</li>`;
    return;
  }

  list.innerHTML = scans.map(function (scan) {
    const student = findStudent(scan.id);
    return `<li class="list-item">
        ${avatar(student.name)}
        <div class="list-main">
          <strong>${student.name}</strong>
          <span>${student.id} · ${formatTime(scan.time)}</span>
        </div>
        ${badge(scan.status)}
      </li>`;
  }).join("");
}
