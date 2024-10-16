export const showError = (field, errorMessage) => {
  const existingError = field.nextElementSibling;
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
  if (errorElement) {
    errorElement.remove();
  }
};
