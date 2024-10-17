import { showError, checkErrorExists } from "./utilities.js";
const formLogin = document.getElementById("form-login");
const userNameLogin = document.getElementById("username-login");
const passwordLogin = document.getElementById("password-login");

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
        if (data.redirectURL) window.location.href = data.redirectURL;
        else if(registeredMessage) {
          registeredMessage.innerText = data.message;
        }
      })
      .catch((error) => console.log(error));
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
  const loginData = {
    name: userNameLogin.value.trim(),
    password: passwordLogin.value.trim(),
  };

  checkToSubmit("/login", loginData);
};

const validateUserInputRegister = (event) => {
  event.preventDefault();
  if (emailRegister.value.trim() === "") {
    showError(emailRegister, "You should enter the email");
  }else if(!emailRegex.test(emailRegister.value.trim())){
    showError(emailRegister, "Wrong email format");
  } else {
    checkErrorExists(emailRegister);
  }
  if (passwordRegister.value === "") {
    showError(passwordRegister, "You should enter the password");
  } else {
    checkErrorExists(passwordRegister);
  }
  if (userNameRegister.value === "") {
    showError(userNameRegister, "You should enter your name");
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
