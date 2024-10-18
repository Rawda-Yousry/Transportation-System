export const showError = (field, errorMessage) => {
  const existingError = field.nextElementSibling;
  const spanError = document.getElementById("span-error");
  console.log("existing error", existingError);
  if (spanError && spanError.innerText !== "") {
    spanError.innerText = "";
  }
  if (!existingError) {
    const errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.textContent = errorMessage;
    field.insertAdjacentElement("afterend", errorElement);
  } else {
    existingError.textContent = errorMessage;
  }
};

export const checkErrorExists = (field) => {
  const errorElement = field.nextElementSibling;
  console.log("element", errorElement);
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};
