const accounts = [
  {
    email: "202610508@gordoncollege.edu.ph",
    password: "student123",
    role: "student",
    name: "Marichu Tayag",
    nickname: "Marichu",
    studentId: "202610508"
  },
  {
    email: "202610401@gordoncollege.edu.ph",
    password: "student123",
    role: "student",
    name: "Rheyanne Estella",
    nickname: "Rheyanne",
    studentId: "202610401"
  },
  {
    email: "202610917@gordoncollege.edu.ph",
    password: "student123",
    role: "student",
    name: "Hirofumi Hilario",
    nickname: "Hirofumi",
    studentId: "202610917"
  },
  {
    email: "202611480@gordoncollege.edu.ph",
    password: "student123",
    role: "student",
    name: "Roel Javier Jr.",
    nickname: "Roel",
    studentId: "202611480"
  },
  {
    email: "202613904@gordoncollege.edu.ph",
    password: "classrep123",
    role: "classrep",
    name: "Rodel Mempin",
    nickname: "Rodel",
    studentId: "202613904"
  },
  {
    email: "azucenas.maria@gordoncollege.edu.ph",
    password: "instructor123",
    role: "instructor",
    name: "Maria Cherryl Azucenas",
    nickname: "Ms. Maria Cherryl Azucenas"
  }
];

const course = {
  code: "CC101",
  title: "Introduction to Computing",
  section: "BSCS 1D",
  schedule: "Mon & Wed · 1:00 – 3:00 PM",
  room: "Room 305",
  days: [1, 3],
  start: "2026-08-17",
  end: "2026-12-18",
  grace: 15,
  qrRefresh: 5,
  qrValid: 10
};

const students = [
  {
    id: "202613904",
    name: "Rodel Mempin",
    late: ["2026-09-09", "2026-11-16"],
    absent: ["2026-10-12"],
    excused: []
  },
  {
    id: "202610401",
    name: "Rheyanne Estella",
    late: ["2026-08-26", "2026-09-23", "2026-10-21", "2026-11-25"],
    absent: ["2026-09-14", "2026-10-19", "2026-12-02"],
    excused: ["2026-10-05"]
  },
  {
    id: "202610917",
    name: "Hirofumi Hilario",
    late: ["2026-08-19", "2026-10-07"],
    absent: ["2026-09-30"],
    excused: ["2026-11-09"]
  },
  {
    id: "202611480",
    name: "Roel Javier Jr.",
    late: ["2026-09-02", "2026-09-28", "2026-10-26", "2026-11-18"],
    absent: ["2026-08-31", "2026-11-04"],
    excused: []
  },
  {
    id: "202610508",
    name: "Marichu Tayag",
    late: ["2026-10-14"],
    absent: [],
    excused: ["2026-09-21", "2026-12-07"]
  }
];
