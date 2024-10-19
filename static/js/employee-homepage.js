import { checkErrorExists, showError, deleteEntity } from "./utilities.js";

const formAvaliableRides = document.getElementById("see-avaliable-rides");
const rideStartPoint = document.getElementById("employee-ride-start-point");
const rideEndPoint = document.getElementById("employee-ride-end-point");
const rideShift = document.getElementById("employee-ride-shift");
const rideDay = document.getElementById("employee-ride-day");
const avaliableRidesDiv = document.getElementById("avaliable-rides-wrapper");
const errorParagraph = document.getElementById("error-message");
const paragraphName = document.getElementById("employee-name");

paragraphName.innerText = "Welcome " + localStorage.getItem("Name");

const displayAvaliableCars = (data) => {
  avaliableRidesDiv.style.display = "block";
  console.log(data);
  for (let i = 0; i < data.length; i++) {
    const avaliableRide = `
      <div class="ride__wrapper" data-id="${data[i].id}">
        <p class="ride__driver-name">Driver Name: ${data[i].name}</p>
        <p class="ride__shift">Shift: ${data[i].shift}</p>
        <button type="button" class="book-button" data-id="${data[i].id}">Book</button>
      </div>
    `;
    avaliableRidesDiv.innerHTML = avaliableRide;
  }
};

const bookRide = (event) => {
  const clickedButton = event.target;
  const bookedDriverId = clickedButton.getAttribute("data-id");
  const employeeId = formAvaliableRides.getAttribute("data-id");
  const formData = {
    id: employeeId,
    driverId: bookedDriverId,
    shift: rideShift.value,
    day: rideDay.value,
    startPoint: rideStartPoint.value,
    endPoint: rideEndPoint.value,
  };
  fetch(`/book_ride`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((response) => response.json())
    .then((data) => {
      alert(data.message);
      avaliableRidesDiv.style.display = "none";
    })
    .catch((error) => console.log(error));
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
    fetch("/see_avaliable_cars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message) {
          errorParagraph.innerText = data.message;
        } else {
          errorParagraph.innerText = "";
          console.log(data);
          displayAvaliableCars(data);
        }
      })
      .catch((error) => console.log(error));
  }
};

// employeeBookForm.addEventListener("submit", bookRide);
formAvaliableRides.addEventListener("submit", seeAvaliableRides);
document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "ride", employeeBookForm.getAttribute("data-id"));
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("book-button")) {
    bookRide(event);
  }
});
