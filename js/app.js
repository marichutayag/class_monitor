const roleNames = {
  student: "Student",
  classrep: "Class Representative",
  instructor: "Instructor"
};

function getUser() {
  const email = localStorage.getItem("cm-user");
  return accounts.find(function (account) {
    return account.email === email;
  });
}

function homePage(role) {
  if (role === "instructor") {
    return "instructor.html";
  }
  if (role === "classrep") {
    return "scanner.html";
  }
  return "student.html";
}

function requireRole(roles) {
  const user = getUser();
  if (!user) {
    location.replace("index.html");
    return null;
  }
  if (!roles.includes(user.role)) {
    location.replace(homePage(user.role));
    return null;
  }
  return user;
}

function logout() {
  localStorage.removeItem("cm-user");
  location.href = "index.html";
}

function getTheme(user) {
  if (!user) {
    return "green";
  }
  return localStorage.getItem("cm-theme-" + user.email) || "green";
}

function saveTheme(user, theme) {
  localStorage.setItem("cm-theme-" + user.email, theme);
  applyTheme(theme);
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}

function getInitials(fullName) {
  const words = fullName.split(" ");
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}

function avatar(fullName) {
  return `<span class="avatar">${getInitials(fullName)}</span>`;
}

function safeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function toKey(date) {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return date.getFullYear() + "-" + month + "-" + day;
}

function toDate(key) {
  const parts = key.split("-");
  return new Date(parts[0], parts[1] - 1, parts[2]);
}

function todayKey() {
  return toKey(new Date());
}

function shortDate(key) {
  return toDate(key).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

function longDate(key) {
  return toDate(key).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

function formatTime(time) {
  return new Date(time).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good morning";
  }
  if (hour < 18) {
    return "Good afternoon";
  }
  return "Good evening";
}

function toggleMenu() {
  const menu = document.getElementById("profile-menu");
  menu.classList.toggle("open");
  document.getElementById("profile-btn").setAttribute("aria-expanded", menu.classList.contains("open"));
}

function closeMenu() {
  document.getElementById("profile-menu").classList.remove("open");
  document.getElementById("profile-btn").setAttribute("aria-expanded", "false");
}

function setupHeader(user) {
  document.getElementById("brand-link").href = homePage(user.role);
  document.getElementById("menu-name").textContent = user.name;
  document.getElementById("menu-role").textContent = roleNames[user.role];
  document.querySelectorAll(".user-initials").forEach(function (item) {
    item.textContent = getInitials(user.name);
  });

  document.getElementById("profile-btn").addEventListener("click", toggleMenu);
  document.getElementById("logout-btn").addEventListener("click", logout);

  document.addEventListener("click", function (event) {
    if (!event.target.closest(".profile")) {
      closeMenu();
    }
  });

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeMenu();
    }
  });
}

applyTheme(getTheme(getUser()));
