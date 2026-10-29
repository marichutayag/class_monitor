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
  code: "CSC111A / CSC111L",
  title: "Introduction to Computing",
  section: "BSCS 1D",
  schedule: "Mon & Tue 10:00 – 11:30 AM (Lab) · Thu 2:00 – 4:00 PM (Lec)",
  room: "GC Main 520 & 528",
  days: [1, 2, 4],
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
    late: ["2026-09-10", "2026-11-16"],
    absent: ["2026-10-12"],
    excused: []
  },
  {
    id: "202610401",
    name: "Rheyanne Estella",
    late: ["2026-08-27", "2026-09-24", "2026-10-22", "2026-11-26"],
    absent: ["2026-09-14", "2026-10-19", "2026-12-03"],
    excused: ["2026-10-05"]
  },
  {
    id: "202610917",
    name: "Hirofumi Hilario",
    late: ["2026-08-20", "2026-10-08"],
    absent: ["2026-10-01"],
    excused: ["2026-11-09"]
  },
  {
    id: "202611480",
    name: "Roel Javier Jr.",
    late: ["2026-09-03", "2026-09-28", "2026-10-26", "2026-11-19"],
    absent: ["2026-08-31", "2026-11-05"],
    excused: []
  },
  {
    id: "202610508",
    name: "Marichu Tayag",
    late: ["2026-10-15"],
    absent: [],
    excused: ["2026-09-21", "2026-12-07"]
  }
];
