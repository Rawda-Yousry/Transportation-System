const formLogin = document.getElementById("form-login");
const userName = document.getElementById("user-name");
const password = document.getElementById("user-id");

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

const validateUserInput = (event) => {
  event.preventDefault();
  const existingError = userName.nextElementSibling;
  if (userName.value.trim() === "") {
    showError(userName, "You should enter username");
  } else {
    if (existingError.classList.contains("error")) {
      existingError.remove();
    }
  }
  if (password.value === "") {
    showError(password, "You should enter the password");
  } else {
    if (existingError.classList.contains("error")) {
      existingError.remove();
    }
  }
  const errorsNumber = document.getElementsByClassName("error").length;
  if (errorsNumber === 0) {
    const loginData = {
      name: userName.value,
      password: password.value,
    };
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => 
        response.json()
      )
      .then((data) => {
        console.log(data);
        window.location.href = data.redirectURL;
      })
      .catch((error) => console.log(error));
  }
};

formLogin.addEventListener("submit", validateUserInput);
