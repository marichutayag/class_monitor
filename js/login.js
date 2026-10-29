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

document.getElementById("password-toggle").addEventListener("click", function () {
  const input = document.getElementById("password");
  const button = document.getElementById("password-toggle");
  const hidden = input.type === "password";

  input.type = hidden ? "text" : "password";
  button.querySelector(".material-symbols-rounded").textContent = hidden ? "visibility_off" : "visibility";
  button.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});
