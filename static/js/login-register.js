import { showError, checkErrorExists } from "./utilities.js";
const formLogin = document.getElementById("form-login");
const userEmailLogin = document.getElementById("useremail-login");
const passwordLogin = document.getElementById("password-login");
const paragraphError = document.getElementById("span-error");

const formRegister = document.getElementById("form-register");
const userNameRegister = document.getElementById("username-register");
const passwordRegister = document.getElementById("password-register");
const emailRegister = document.getElementById("email-register");

const registeredMessage = document.getElementById("register-message");

const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

const checkToSubmit = (route, requestData) => {
  const errorsNumber = document.getElementsByClassName("error").length;
  if (errorsNumber === 0) {
    fetch(route, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.redirectURL) {
          window.location.href = data.redirectURL;
          localStorage.setItem("AdminMessage", data.message);
          localStorage.setItem("EmployeeMessage", data.message);
          if (data.messageavaliable)
            localStorage.setItem("MessageAvaliable", data.messageavaliable);
        } else if (data.message) {
          registeredMessage.innerText = data.message;
        } else if (data.message_login) {
          paragraphError.innerText = data.message_login;
        }
      })
      .catch((error) => console.log(error));
  }
};

const validateUserInputLogin = (event) => {
  event.preventDefault();
  if (
    userEmailLogin.value.trim() === "" ||
    !emailRegex.test(userEmailLogin.value)
  ) {
    showError(userEmailLogin, "You should enter the email");
  } else {
    checkErrorExists(userEmailLogin);
  }

  if (passwordLogin.value === "") {
    showError(passwordLogin, "You should enter the password");
  } else {
    checkErrorExists(passwordLogin);
  }
  const loginData = {
    email: userEmailLogin.value.trim(),
    password: passwordLogin.value.trim(),
  };

  checkToSubmit("/login", loginData);
};

const validateUserInputRegister = (event) => {
  event.preventDefault();
  if (
    emailRegister.value.trim() === "" ||
    !emailRegex.test(emailRegister.value.trim())
  ) {
    showError(emailRegister, "You should enter the email");
  } else {
    checkErrorExists(emailRegister);
  }
  if (passwordRegister.value === "") {
    showError(passwordRegister, "You should enter the password");
  } else {
    checkErrorExists(passwordRegister);
  }
  if (userNameRegister.value.trim() === "" || !isNaN(userNameRegister.value)) {
    showError(userNameRegister, "You should enter a name");
  } else {
    checkErrorExists(userNameRegister);
  }

  const registerData = {
    email: emailRegister.value.trim(),
    user_name: userNameRegister.value.trim(),
    password: passwordRegister.value.trim(),
  };

  checkToSubmit("/register", registerData);
};

if (formLogin) {
  formLogin.addEventListener("submit", validateUserInputLogin);
}

if (formRegister) {
  formRegister.addEventListener("submit", validateUserInputRegister);
}
