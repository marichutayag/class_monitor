const user = requireRole(["instructor"]);

if (user) {
  setupHeader(user);
  showGreeting();
  setupActions();
  showDashboard();
}

function showGreeting() {
  document.getElementById("hero-date").textContent = longDate(todayKey());
  document.getElementById("hero-title").textContent = greeting() + ", " + user.nickname;
  document.getElementById("hero-class").textContent = course.code + " · " + course.title + " · " + course.section;
  document.getElementById("session-schedule").textContent = course.schedule + " · " + course.room;
  document.getElementById("today-label").textContent = students.length + " students in " + course.section;
}

function setupActions() {
  document.getElementById("start-btn").addEventListener("click", function () {
    startSession(Number(document.getElementById("grace-select").value));
    showDashboard();
  });

  document.getElementById("end-btn").addEventListener("click", function () {
    if (confirm("End today's session? Students who haven't been scanned will be marked Absent.")) {
      endSession();
      showDashboard();
    }
  });

  document.getElementById("request-list").addEventListener("click", function (event) {
    const button = event.target.closest("[data-decision]");
    if (button) {
      reviewRequest(Number(button.dataset.id), button.dataset.decision);
    }
  });
}

function showDashboard() {
  showSession();
  showToday();
  showRequests();
  showRecords();
}

function showSession() {
  const session = getSession();
  const idle = document.getElementById("session-idle");
  const open = document.getElementById("session-open");
  const closed = document.getElementById("session-closed");

  idle.hidden = true;
  open.hidden = true;
  closed.hidden = true;

  if (!session) {
    idle.hidden = false;
  } else if (session.end) {
    closed.hidden = false;
    document.getElementById("closed-text").textContent = "Ended at " + formatTime(session.end);
  } else {
    open.hidden = false;
    document.getElementById("open-text").textContent = "Opened " + formatTime(session.start) + " · Late after " + formatTime(lateTime(session));
  }
}

function showToday() {
  const counts = { present: 0, late: 0, absent: 0, waiting: 0 };

  students.forEach(function (student) {
    const status = getStatus(student.id, todayKey());
    if (status === "present" || status === "late" || status === "absent") {
      counts[status]++;
    } else if (!status) {
      counts.waiting++;
    }
  });

  document.getElementById("count-present").textContent = counts.present;
  document.getElementById("count-late").textContent = counts.late;
  document.getElementById("count-absent").textContent = counts.absent;
  document.getElementById("count-waiting").textContent = counts.waiting;
}

function showRequests() {
  const list = document.getElementById("request-list");
  const excuses = loadList("cm-excuses").reverse();
  const pending = excuses.filter(function (excuse) {
    return excuse.status === "pending";
  });

  document.getElementById("pending-text").textContent = pending.length + " waiting for review";

  if (excuses.length === 0) {
    list.innerHTML = `<li class="empty">No excuse requests yet.</li>`;
    return;
  }

  list.innerHTML = excuses.map(requestCard).join("");
}

function requestCard(excuse) {
  const student = findStudent(excuse.studentId);
  let extra = "";

  if (excuse.details) {
    extra += `<p class="request-details">${safeText(excuse.details)}</p>`;
  }
  if (excuse.file) {
    extra += `<p class="request-file"><span class="material-symbols-rounded" aria-hidden="true">attach_file</span>${safeText(excuse.file)}</p>`;
  }
  if (excuse.status === "pending") {
    extra += `<div class="request-actions">
        <button class="btn btn-small btn-primary" type="button" data-id="${excuse.id}" data-decision="approved">Approve</button>
        <button class="btn btn-small btn-danger" type="button" data-id="${excuse.id}" data-decision="declined">Decline</button>
      </div>`;
  }

  return `<li class="request">
      <div class="request-head">
        ${avatar(student.name)}
        <div class="list-main">
          <strong>${student.name}</strong>
          <span>${shortDate(excuse.date)} · ${safeText(excuse.reason)}</span>
        </div>
        ${badge(excuse.status)}
      </div>
      ${extra}
    </li>`;
}

function reviewRequest(id, decision) {
  const excuses = loadList("cm-excuses");
  const excuse = excuses.find(function (item) {
    return item.id === id;
  });

  excuse.status = decision;
  saveList("cm-excuses", excuses);
  showDashboard();
}

function showRecords() {
  const today = todayKey();

  document.getElementById("records-body").innerHTML = students.map(function (student) {
    const totals = countStatuses(student.id);
    return `<tr>
        <td>
          <div class="student-cell">
            ${avatar(student.name)}
            <div>
              <strong>${student.name}</strong>
              <span>${student.id}</span>
            </div>
          </div>
        </td>
        <td class="num">${totals.present}</td>
        <td class="num">${totals.late}</td>
        <td class="num">${totals.absent}</td>
        <td class="num">${totals.excused}</td>
        <td>${badge(getStatus(student.id, today))}</td>
      </tr>`;
  }).join("");
}
