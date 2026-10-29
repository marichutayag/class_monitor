const user = requireRole(["student", "classrep", "instructor"]);

if (user) {
  setupHeader(user);
  showProfile();
  setupThemes();
  setupReset();
}

function showProfile() {
  document.getElementById("back-link").href = homePage(user.role);
  document.getElementById("profile-name").textContent = user.name;
  document.getElementById("profile-email").textContent = user.email;
  document.getElementById("profile-role").textContent = roleNames[user.role];
  document.getElementById("profile-class").textContent = course.code + " · " + course.section;

  if (user.studentId) {
    document.getElementById("profile-id").textContent = user.studentId;
  } else {
    document.getElementById("id-row").hidden = true;
  }
}

function setupThemes() {
  const current = getTheme(user);

  document.querySelectorAll('input[name="theme"]').forEach(function (option) {
    option.checked = option.value === current;
    option.addEventListener("change", function () {
      saveTheme(user, option.value);
    });
  });
}

function setupReset() {
  document.getElementById("reset-btn").addEventListener("click", function () {
    if (!confirm("Clear all demo data?")) {
      return;
    }

    localStorage.removeItem("cm-scans");
    localStorage.removeItem("cm-session");
    localStorage.removeItem("cm-excuses");
    document.getElementById("reset-message").textContent = "Demo data cleared.";
  });
}
