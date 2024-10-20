import {
  checkErrorExists,
  showError,
  deleteEntity,
  toggleFormVisibility,
} from "./utilities.js";

const formButton = document.getElementById("avaliable-ride-form-button");
const formAvaliableRides = document.getElementById("see-avaliable-rides");
const rideStartPoint = document.getElementById("employee-ride-start-point");
const rideEndPoint = document.getElementById("employee-ride-end-point");
const rideShift = document.getElementById("employee-ride-shift");
const rideDay = document.getElementById("employee-ride-day");
const avaliableRidesDiv = document.getElementById("booked-rides-wrapper");
const errorParagraph = document.getElementById("error-message");
const selectedDay = document.getElementById("choose-day");
const paragraphName = document.getElementById("info");
const bookedRidesDiv = document.getElementById("booked-rides-wrapper");

paragraphName.innerText = localStorage.getItem("EmployeeMessage");
const displayAvaliableCars = (data) => {
  paragraphName.innerText = localStorage.getItem("MessageAvaliable");
  const avaliableRidesTable = document.createElement("table");
  avaliableRidesTable.className = "table";
  avaliableRidesTable.setAttribute("id", "drivers-table");
  const headers = `<tr class="table__header">
      <td>Driver Name</td>
      <td>Shift</td>
      <td>Route</td>
    </tr>
  `;
  avaliableRidesTable.innerHTML = headers;
  for (let i = 0; i < data.length; i++) {
    avaliableRidesTable.innerHTML += `
    <tr data-id=${data[i].id} class="rows" >
      <td>${data[i].name}</td>
      <td>${data[i].shift}</td>
      <td>${data[i].start_point} - ${data[i].end_point}</td>
      <td class="actions book-button" data-id=${data[i].id}> Book </td>
    </tr>
    `;
    avaliableRidesDiv.appendChild(avaliableRidesTable);
  }
};

const bookRide = (event) => {
  const clickedButton = event.target;
  console.log(clickedButton);
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
      const avaliableRidesTable = document.getElementById("drivers-table");
      if (avaliableRidesTable) {
        avaliableRidesTable.remove();
      }
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
          toggleFormVisibility(formAvaliableRides);
          const driversTable = document.getElementById("drivers-table");
          if (driversTable) {
            driversTable.remove();
          }
          displayAvaliableCars(data);
        }
      })
      .catch((error) => console.log(error));
  }
};

const viewBookedRidesOfDay = () => {
  paragraphName.innerText = localStorage.getItem("EmployeeMessage");
  const selectedDayValue = selectedDay.value;
  fetch("/view_booked_rides_of_day", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedDay: selectedDayValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const driversTable = document.getElementById("drivers-table");
      if (driversTable) {
        driversTable.remove();
      }
      if (data.message) {
        console.log(data.message);
      } else {
        displayBookedRidesOfDay(data.booked_rides);
      }
    })
    .catch((error) => console.log(error));
};

const displayBookedRidesOfDay = (data) => {
  const avaliableRidesTable = document.createElement("table");
  avaliableRidesTable.className = "table";
  avaliableRidesTable.setAttribute("id", "drivers-table");
  const headers = `<tr class="table__header">
      <td>Shift</td>
      <td>Route</td>
    </tr>
  `;
  if (data.length !== 0) {
    avaliableRidesTable.innerHTML = headers;
  }
  for (let i = 0; i < data.length; i++) {
    avaliableRidesTable.innerHTML += `
    <tr data-id=${data[i].id} class="rows" >
      <td>${data[i].shift}</td>
      <td>${data[i].start_point} - ${data[i].end_point}</td>
            <td class="actions"><i class="bi bi-x delete-button" data-id=${data[i].id} ></i></td>
            <td class="actions"><i class="bi-pencil-fill edit-button" data-id=${data[i].id} ></i></td>
    </tr>
    `;
    bookedRidesDiv.appendChild(avaliableRidesTable);
  }
};

// employeeBookForm.addEventListener("submit", bookRide);
formAvaliableRides.addEventListener("submit", seeAvaliableRides);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    console.log("Clicked");
    deleteEntity(event, "ride");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("book-button")) {
    bookRide(event);
  }
});

formButton.addEventListener("click", () => {
  toggleFormVisibility(formAvaliableRides);
});

selectedDay.addEventListener("change", viewBookedRidesOfDay);
