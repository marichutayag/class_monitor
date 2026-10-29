const user = requireRole(["student"]);
let qrCode = null;
let qrTimer = null;

if (user) {
  setupHeader(user);
  showGreeting();
  showToday();
  showRecentDays();
  setupCalendar(user.studentId);
  setupExcuseForm();
  showRequests();
  setupTimeIn();
}

function showGreeting() {
  document.getElementById("hero-date").textContent = longDate(todayKey());
  document.getElementById("hero-title").textContent = greeting() + ", " + user.nickname;
  document.getElementById("class-name").textContent = course.code + " · " + course.title;
  document.getElementById("class-schedule").textContent = course.schedule + " · " + course.room;
}

function showToday() {
  const today = todayKey();
  const status = getStatus(user.studentId, today);
  const scan = findScan(user.studentId, today);
  let html = `<span class="muted">Not yet timed in</span>`;

  if (status) {
    html = badge(status);
  }
  if (scan && scan.status !== "absent") {
    html += `<span>Timed in ${formatTime(scan.time)}</span>`;
  }

  document.getElementById("today-date").textContent = "Today · " + shortDate(today);
  document.getElementById("today-status").innerHTML = html;
  document.getElementById("time-in-label").textContent = status ? "Show QR" : "Time In";
}

function showRecentDays() {
  const today = todayKey();
  const list = document.getElementById("recent-list");
  const days = daysSoFar().filter(function (key) {
    return key !== today && getStatus(user.studentId, key);
  });
  const recent = days.slice(-5).reverse();

  if (recent.length === 0) {
    list.innerHTML = `<li class="empty">No attendance records yet.</li>`;
    return;
  }

  list.innerHTML = recent.map(function (key) {
    const scan = findScan(user.studentId, key);
    let time = "";
    if (scan && scan.status !== "absent") {
      time = `<span>Timed in ${formatTime(scan.time)}</span>`;
    }
    return `<li class="list-item">
        <div class="list-main">
          <strong>${shortDate(key)}</strong>
          ${time}
        </div>
        ${badge(getStatus(user.studentId, key))}
      </li>`;
  }).join("");
}

function setupExcuseForm() {
  const form = document.getElementById("excuse-form");
  const dateInput = document.getElementById("excuse-date");

  dateInput.min = course.start;
  dateInput.max = todayKey();

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const excuses = loadList("cm-excuses");
    const message = document.getElementById("excuse-message");
    const fileInput = document.getElementById("excuse-file");
    const alreadySent = excuses.some(function (excuse) {
      return excuse.studentId === user.studentId && excuse.date === dateInput.value && excuse.status !== "declined";
    });

    if (alreadySent) {
      message.textContent = "Already sent for this date.";
      message.className = "message error";
      return;
    }

    excuses.push({
      id: Date.now(),
      studentId: user.studentId,
      date: dateInput.value,
      reason: document.getElementById("excuse-reason").value,
      details: document.getElementById("excuse-details").value.trim(),
      file: fileInput.files.length > 0 ? fileInput.files[0].name : "",
      status: "pending"
    });

    saveList("cm-excuses", excuses);
    form.reset();
    message.textContent = "Request sent.";
    message.className = "message success";
    showRequests();
  });
}

function showRequests() {
  const list = document.getElementById("request-list");
  const requests = loadList("cm-excuses").filter(function (excuse) {
    return excuse.studentId === user.studentId;
  }).reverse();

  if (requests.length === 0) {
    list.innerHTML = `<li class="empty">No requests yet.</li>`;
    return;
  }

  list.innerHTML = requests.map(function (excuse) {
    const file = excuse.file ? safeText(excuse.file) : "No attachment";
    return `<li class="list-item">
        <div class="list-main">
          <strong>${shortDate(excuse.date)} · ${safeText(excuse.reason)}</strong>
          <span>${file}</span>
        </div>
        ${badge(excuse.status)}
      </li>`;
  }).join("");
}

function setupTimeIn() {
  const dialog = document.getElementById("qr-dialog");

  document.getElementById("qr-name").textContent = user.name;
  document.getElementById("qr-id").textContent = user.studentId;

  document.getElementById("time-in-btn").addEventListener("click", function () {
    dialog.showModal();
    startQr();
  });

  dialog.addEventListener("click", function (event) {
    if (event.target === dialog) {
      dialog.close();
    }
  });

  dialog.addEventListener("close", stopQr);

  if (typeof QRCode === "undefined") {
    document.getElementById("qr-code").textContent = "QR code unavailable.";
    return;
  }

  qrCode = new QRCode(document.getElementById("qr-code"), {
    text: qrText(),
    width: 440,
    height: 440,
    colorDark: "#13221a",
    colorLight: "#ffffff",
    correctLevel: QRCode.CorrectLevel.M
  });
}

function qrText() {
  return user.studentId + "|" + Math.floor(Date.now() / 1000);
}

function startQr() {
  stopQr();
  if (!qrCode) {
    return;
  }
  qrCode.makeCode(qrText());
  qrTimer = setInterval(function () {
    qrCode.makeCode(qrText());
  }, course.qrRefresh * 1000);
}

function stopQr() {
  clearInterval(qrTimer);
}
