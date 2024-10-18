import { checkErrorExists, showError, deleteEntity } from "./utilities.js";

const employeeBookForm = document.getElementById("employee-book-form");
const employeeBookRoute = document.getElementById("employee-book-routes");
const employeeBookShift = document.getElementById("employee-book-shift");
const employeeBookDay = document.getElementById("employee-book-day");
const employeeRides = document.getElementById("rides-wrapper");

const createNewRide = (data) => {
  const newBookedRide = document.createElement("div");
  newBookedRide.className = "ride__wrapper";
  newBookedRide.innerHTML = `
  <p class= "ride__day">${data.day}</p>
  <p class= "ride__shift">${data.shift}</p>
  <p class= "ride__route">${data.route}</p>
  <button type="button" class="delete-button" data-id = ${data.id}>Delete</button>
  `;
  newBookedRide.setAttribute("data-id", data.id);
  employeeRides.appendChild(newBookedRide);
};

const bookRide = (event) => {
  event.preventDefault();
  const employeeId = employeeBookForm.getAttribute("data-id");
  if (employeeBookDay.value === "") {
    showError(employeeBookDay, "You should choose a day");
  } else {
    checkErrorExists(employeeBookDay);
  }
  if (employeeBookRoute.value === "") {
    showError(employeeBookRoute, "You should choose a route");
  } else {
    checkErrorExists(employeeBookRoute);
  }
  if (employeeBookShift.value === "") {
    showError(employeeBookShift, "You should choose a shift");
  } else {
    checkErrorExists(employeeBookShift);
  }
  const formData = {
    id: employeeId,
    shift: employeeBookShift.value,
    day: employeeBookDay.value,
    route: employeeBookRoute.value,
  };
  const errorsNumber = document.getElementsByClassName("error").length;
  if (errorsNumber === 0) {
    fetch(`/book_ride/${employeeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => createNewRide(data))
      .catch((error) => console.log(error));
  }
};

employeeBookForm.addEventListener("submit", bookRide);
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "ride", employeeBookForm.getAttribute("data-id"));
  }
});
