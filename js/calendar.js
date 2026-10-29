let shownMonth = new Date();
let calendarStudent = "";

function setupCalendar(studentId) {
  calendarStudent = studentId;
  shownMonth.setDate(1);

  document.getElementById("prev-month").addEventListener("click", function () {
    shownMonth.setMonth(shownMonth.getMonth() - 1);
    drawCalendar();
  });

  document.getElementById("next-month").addEventListener("click", function () {
    shownMonth.setMonth(shownMonth.getMonth() + 1);
    drawCalendar();
  });

  document.getElementById("calendar-days").addEventListener("click", function (event) {
    const day = event.target.closest(".day");
    if (day) {
      showDay(day.dataset.date);
    }
  });

  drawCalendar();
  showDay(todayKey());
}

function drawCalendar() {
  const year = shownMonth.getFullYear();
  const month = shownMonth.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const totalDays = new Date(year, month + 1, 0).getDate();
  const today = todayKey();
  let html = "";

  for (let i = 0; i < firstWeekday; i++) {
    html += "<span></span>";
  }

  for (let day = 1; day <= totalDays; day++) {
    const key = toKey(new Date(year, month, day));
    const status = getStatus(calendarStudent, key);
    let classes = "day";

    if (isClassDay(key)) {
      classes += " class-day";
    }
    if (status) {
      classes += " " + status;
    } else if (isClassDay(key) && key >= today) {
      classes += " upcoming";
    }
    if (key === today) {
      classes += " today";
    }

    html += `<button class="${classes}" type="button" data-date="${key}">${day}</button>`;
  }

  document.getElementById("calendar-month").textContent = shownMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  document.getElementById("calendar-days").innerHTML = html;
}

function showDay(key) {
  const status = getStatus(calendarStudent, key);
  const scan = findScan(calendarStudent, key);
  let note = `<span class="muted">No class</span>`;

  if (status) {
    note = badge(status);
  } else if (key === todayKey()) {
    note = `<span class="muted">Not yet timed in</span>`;
  } else if (isClassDay(key)) {
    note = `<span class="muted">Upcoming class</span>`;
  }

  if (scan && scan.status !== "absent") {
    note = `<span class="muted">Timed in ${formatTime(scan.time)}</span>` + note;
  }

  document.querySelectorAll(".day.selected").forEach(function (day) {
    day.classList.remove("selected");
  });

  const selected = document.querySelector(`.day[data-date="${key}"]`);
  if (selected) {
    selected.classList.add("selected");
  }

  document.getElementById("day-details").innerHTML = `<strong>${longDate(key)}</strong><div class="day-note">${note}</div>`;
}
