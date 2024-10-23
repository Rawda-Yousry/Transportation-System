// Functions that used alot in the project
export const showError = (field, errorMessage) => {
  const existingError = field.nextElementSibling;
  const spanError = document.getElementById("span-error");
  if (spanError && spanError.innerText !== "") {
    spanError.innerText = "";
  }
  if (!existingError) {
    const errorElement = document.createElement("span");
    errorElement.className = "error";
    errorElement.style.display = "block";
    errorElement.textContent = errorMessage;
    field.insertAdjacentElement("afterend", errorElement);
  } else {
    existingError.textContent = errorMessage;
  }
};

export const checkErrorExists = (field) => {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};

export const deleteEntity = (event, entityType) => {
  const clickedButton = event.target;
  const deletedId = clickedButton.getAttribute("data-id");
  const divClassName = entityType === "ride" ? "ride__wrapper" : "rows";
  const url =
    entityType === "ride" ? `/employee/delete_ride` : `/drivers/delete`;

  const divs = document.getElementsByClassName(divClassName);
  const fetchOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = {
    deletedId: deletedId,
  };
  fetchOptions.body = JSON.stringify(data);

  for (let i = 0; i < divs.length; i++) {
    const deletedDivId = divs[i].getAttribute("data-id");

    if (deletedDivId === deletedId) {
      fetch(url, fetchOptions)
        .then((response) => response.json())
        .then(() => {
          divs[i].remove();
        })
        .catch((error) => {});
      break;
    }
  }
};

export const toggleFormVisibility = (
  form,
  formFields,
  isAdd,
  errors,
  errorParagraph
) => {
  if (form.style.display == "block") {
    form.style.display = "none";
  } else {
    if (errors && errors.length > 0) {
      for (let i = 0; i < errors.length; i++) {
        errors[i].innerText = "";
      }
    }

    errorParagraph.innerText = "";

    if (isAdd === "add") {
      for (let i = 1; i < 6; i++) {
        const checkbox = document.getElementById(`checkbox-${i}`);
        checkbox.checked = false;
      }
    }
    if (isAdd == "add" || isAdd == "seeAvaliable")
      formFields.forEach((field) => {
        field.value = "";
      });

    form.style.display = "block";
  }
};
