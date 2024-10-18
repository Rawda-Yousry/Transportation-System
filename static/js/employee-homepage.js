import { checkErrorExists, showError, deleteEntity } from "./utilities.js";

const formAvaliableRides = document.getElementById("see-avaliable-rides");
const rideStartPoint = document.getElementById("employee-ride-start-point");
const rideEndPoint = document.getElementById("employee-ride-end-point");
const rideShift = document.getElementById("employee-ride-shift");
const rideDay = document.getElementById("employee-ride-day");
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

const seeAvaliableRides = (event) => {
  event.preventDefault();
  if (rideDay.value === "") {
    showError(rideDay, "You should choose a day");
  } else {
    checkErrorExists(rideDay);
  }
  if (rideStartPoint.value === "") {
    showError(rideEndPoint, "You should choose a route");
  } else {
    checkErrorExists(rideEndPoint);
  }
  if (rideStartPoint.value != "Company" && rideEndPoint.value != "Company") {
    showError(rideEndPoint, "One of the points should be the company");
  } else {
    if (rideStartPoint.value === rideEndPoint.value) {
      showError(rideEndPoint, "Can't go to the same point");
    } else {
      checkErrorExists(rideEndPoint);
    }
  }
  if (rideShift.value === "") {
    showError(rideShift, "You should choose a shift");
  } else {
    checkErrorExists(rideShift);
  }
  const formData = {
    shift: rideShift.value,
    day: rideDay.value,
    startPoint: rideStartPoint.value,
    endPoint: rideEndPoint.value,
  };
  const errorsNumber = document.getElementsByClassName("error").length;
  if (errorsNumber === 0) {
    fetch(`/see_avaliable_cars`, {
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
