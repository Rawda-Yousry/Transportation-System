//
const formLogin = document.getElementById("form-login");
const userNameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

const formRegister = document.getElementById("form-register");
const userNameRegister = document.getElementById("username-register");
const passwordRegister = document.getElementById("password-register");
const emailRegister = document.getElementById("email-register");
const roleRegister = document.getElementById("role-register");

const showError = (field, errorMessage) => {
  const existingError = field.nextElementSibling;
  if (!existingError.classList.contains("error")) {
    const errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.textContent = errorMessage;
    field.insertAdjacentElement("afterend", errorElement);
  } else {
    existingError.textContent = errorMessage;
  }
};

const checkErrorExists = (field) => {
  const errorElement = field.nextElementSibling;
  if (errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};

const validateUserInputLogin = (event) => {
  event.preventDefault();
  if (userNameLogin.value.trim() === "") {
    showError(userNameLogin, "You should enter username");
  } else {
    checkErrorExists(userNameLogin);
  }

  if (passwordLogin.value === "") {
    showError(passwordLogin, "You should enter the password");
  } else {
    checkErrorExists(passwordLogin);
  }

  const errorsNumber = document.getElementsByClassName("error").length;
  if (errorsNumber === 0) {
    const loginData = {
      name: userNameLogin.value,
      password: passwordLogin.value,
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        window.location.href = data.redirectURL;
      })
      .catch((error) => console.log(error));
  }
};

const validateUserInputRegister = (event) => {
  event.preventDefault();
  if (emailRegister.value.trim() === "") {
    showError(emailRegister, "You should enter the email");
  } else {
    checkErrorExists(emailRegister);
  }
  if (passwordRegister.value === "") {
    showError(passwordRegister, "You should enter the password");
  } else {
    checkErrorExists(passwordRegister);
  }
  if (roleRegister.value === "") {
    showError(roleRegister, "You should enter the password");
  } else {
    checkErrorExists(roleRegister);
  }
  if (userNameRegister.value === "") {
    showError(userNameRegister, "You should enter the password");
  } else {
    checkErrorExists(userNameRegister);
  }
};
if (formLogin) {
  formLogin.addEventListener("submit", validateUserInputLogin);
}

if (formRegister) {
  formRegister.addEventListener("submit", validateUserInputRegister);
}
