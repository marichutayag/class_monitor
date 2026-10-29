const signedIn = getUser();

if (signedIn) {
  location.replace(homePage(signedIn.role));
}

document.getElementById("login-form").addEventListener("submit", function (event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim().toLowerCase();
  const password = document.getElementById("password").value;
  const account = accounts.find(function (item) {
    return item.email === email && item.password === password;
  });

  if (!account) {
    document.getElementById("login-error").textContent = "Incorrect email or password.";
    return;
  }

  localStorage.setItem("cm-user", account.email);
  location.href = homePage(account.role);
});

document.getElementById("login-form").addEventListener("input", function () {
  document.getElementById("login-error").textContent = "";
});
