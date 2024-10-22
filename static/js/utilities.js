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
    errorElement.style.display = "block";
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

export const deleteEntity = (event, entityType) => {
  console.log("deleteeeee");
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
        .catch((error) => console.log(error));
      break;
    }
  }
};

export const toggleFormVisibility = (form, formFields = "") => {
  if (form.style.display == "block") {
    form.style.display = "none";
  } else form.style.display = "block";
};
