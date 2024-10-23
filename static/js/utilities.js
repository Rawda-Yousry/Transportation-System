// Show error message for input fields
export const showError = (field, errorMessage) => {
  // Takes the next element after the field
  const existingError = field.nextElementSibling;
  const spanError = document.getElementById("span-error");

  // Check if there is an existing error message so empty it
  if (spanError && spanError.innerText !== "") {
    spanError.innerText = "";
  }
  // Check if the element is already created
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


// Check if there is an error message and remove it
export const checkErrorExists = (field) => {
  const errorElement = field.nextElementSibling;
  if (errorElement && errorElement.classList.contains("error")) {
    errorElement.remove();
  }
};

// Delete an entity from the page 
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
        .catch((error) => console.log(error));
      break;
    }
  }
};

// Toggle the visibility of a form
export const toggleFormVisibility = (form) => {
  if (form.style.display == "block") {
    form.style.display = "none";
  } else form.style.display = "block";
};
