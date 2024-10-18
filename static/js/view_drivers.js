import { checkErrorExists, showError, deleteEntity } from "./utilities.js";
const formAddDriver = document.getElementById("add-form");
const driverDiv = document.getElementsByClassName("drivers__wrapper")[0];
const addDriverButton = document.getElementById("add-button");

const toggleAddFormVisibility = () => {
  if (formAddDriver.style.display == "block")
    formAddDriver.style.display = "none";
  else formAddDriver.style.display = "block";
};

const createDriver = (data) => {
  const newDriverDiv = document.createElement("div");
  newDriverDiv.className = "driver__wrapper";
  newDriverDiv.innerHTML = `
    <h2 class="driver__name">${data.name}</h2>
    <p class="driver__route">${data.route}</p>
    <p class="driver__shift">${data.shift}</p>
    <p class="driver__car-capacity">${data.car_capacity}</p>
    <button type="button" class="delete-button" data-id = ${data.id}>Delete</button>
`;

  newDriverDiv.setAttribute("data-id", data.id);
  driverDiv.appendChild(newDriverDiv);
};

const onSubmitAddDriverForm = (e) => {
  e.preventDefault();
  const driverName = document.getElementById("driver-name");
  const driverShift = document.getElementById("driver-shift");
  const driverRoute = document.getElementById("driver-route");
  const driverCarCapacity = document.getElementById("car-capacity");
  const errorElements = document.getElementsByClassName("error");

  if (driverName.value.trim() === "") {
    showError(driverName, "You should enter a name");
  } else {
    checkErrorExists(driverName);
  }
  if (driverShift.value === "") {
    showError(driverShift, "You should enter a shift");
  } else {
    checkErrorExists(driverShift);
  }
  if (driverRoute.value === "") {
    showError(driverRoute, "You should enter a route");
  } else {
    checkErrorExists(driverRoute);
  }
  if (Number(driverCarCapacity.value) <= 0 || driverCarCapacity.value == "") {
    showError(driverCarCapacity, "You should enter the car capacity");
  } else if (Number(driverCarCapacity.value) > 14) {
    showError(driverCarCapacity, "You should enter a reasonable car capacity");
  } else {
    checkErrorExists(driverCarCapacity);
  }
  if (errorElements.length === 0) {
    const formData = {
      name: driverName.value,
      shift: driverShift.value,
      route: driverRoute.value,
      carCapacity: driverCarCapacity.value,
    };

    fetch("/drivers/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        createDriver(data);
      })
      .catch((error) => console.log(error));
  }
};

addDriverButton.addEventListener("click", toggleAddFormVisibility);
formAddDriver.addEventListener("submit", onSubmitAddDriverForm);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "driver");
  }
});
