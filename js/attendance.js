const statusNames = {
  present: "Present",
  late: "Late",
  absent: "Absent",
  excused: "Excused",
  pending: "Pending",
  approved: "Approved",
  declined: "Declined"
};

function loadList(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function findStudent(id) {
  return students.find(function (student) {
    return student.id === id;
  });
}

function isClassDay(key) {
  const weekday = toDate(key).getDay();
  return key >= course.start && key <= course.end && course.days.includes(weekday);
}

function findScan(studentId, key) {
  return loadList("cm-scans").find(function (scan) {
    return scan.id === studentId && scan.date === key;
  });
}

function isExcused(studentId, key) {
  return loadList("cm-excuses").some(function (excuse) {
    return excuse.studentId === studentId && excuse.date === key && excuse.status === "approved";
  });
}

function getStatus(studentId, key) {
  if (isExcused(studentId, key)) {
    return "excused";
  }

  const scan = findScan(studentId, key);
  if (scan) {
    return scan.status;
  }

  if (key >= todayKey()) {
    return "";
  }

  const student = findStudent(studentId);
  if (student.excused.includes(key)) {
    return "excused";
  }
  if (student.absent.includes(key)) {
    return "absent";
  }
  if (student.late.includes(key)) {
    return "late";
  }
  if (isClassDay(key)) {
    return "present";
  }
  return "";
}

function daysSoFar() {
  const days = [];
  const date = toDate(course.start);
  const today = todayKey();

  while (toKey(date) <= today) {
    days.push(toKey(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
}

function countStatuses(studentId) {
  const totals = { present: 0, late: 0, absent: 0, excused: 0 };

  daysSoFar().forEach(function (key) {
    const status = getStatus(studentId, key);
    if (status) {
      totals[status]++;
    }
  });
  return totals;
}

function badge(status) {
  if (!status) {
    return `<span class="badge">Not yet</span>`;
  }
  return `<span class="badge ${status}">${statusNames[status]}</span>`;
}

function getSession() {
  const session = JSON.parse(localStorage.getItem("cm-session"));
  if (session && session.date === todayKey()) {
    return session;
  }
  return null;
}

function startSession(grace) {
  const session = { date: todayKey(), start: Date.now(), grace: grace, end: null };
  localStorage.setItem("cm-session", JSON.stringify(session));
  return session;
}

function endSession() {
  const session = getSession();
  const scans = loadList("cm-scans");
  session.end = Date.now();

  students.forEach(function (student) {
    if (!getStatus(student.id, session.date)) {
      scans.push({ id: student.id, date: session.date, time: session.end, status: "absent" });
    }
  });

  saveList("cm-scans", scans);
  localStorage.setItem("cm-session", JSON.stringify(session));
}

function lateTime(session) {
  return session.start + session.grace * 60000;
}
