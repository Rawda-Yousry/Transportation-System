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
const closeButton = document.getElementById("form-close");
const logout = document.getElementById("logout");
const errors = document.getElementsByClassName("error");

// Array to be send to when toggle the form to reset the values
const formFields = [rideStartPoint, rideEndPoint, rideShift, rideDay];

// This message changes depending on request from login
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
    <tr data-id=${data[i].id}  class="ride__wrapper" >
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
        avaliableRidesTable.remove(); // Remove the table after booking
      }
      window.location.href = "/view_booked_rides";
    })
    .catch((error) => {});
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
  const errorsNumber = errors.length;
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
          toggleFormVisibility(
            formAvaliableRides,
            formFields,
            "seeAvaliable",
            errors,
            errorParagraph
          );
          const driversTable = document.getElementById("drivers-table");
          if (driversTable) {
            driversTable.remove();
          }
          displayAvaliableCars(data);
        }
      })
      .catch((error) => {});
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
      const driversTable = document.getElementById("drivers-table");
      if (driversTable) {
        driversTable.remove();
      }
      if (data.message) {
      } else {
        displayBookedRidesOfDay(data.booked_rides);
      }
    })
    .catch((error) => {});
};

const displayBookedRidesOfDay = (data) => {
  const avaliableRidesTable = document.createElement("table");
  avaliableRidesTable.className = "table";
  avaliableRidesTable.setAttribute("id", "drivers-table");
  const headers = `<tr class="table__header">
      <td>Day</td>
      <td>Shift</td>
      <td>Route</td>
    </tr>
  `;
  if (data.length !== 0) {
    avaliableRidesTable.innerHTML = headers;
  }

  for (let i = 0; i < data.length; i++) {
    avaliableRidesTable.innerHTML += `
    <tr data-id=${data[i].id}  class="ride__wrapper" >
      <td>${data[i].day}</td>
      <td>${data[i].shift}</td>
      <td>${data[i].start_point} - ${data[i].end_point}</td>
            <td class="actions"><i class="bi bi-x delete-button" data-id=${data[i].id} ></i></td>
    </tr>
    `;
    avaliableRidesDiv.appendChild(avaliableRidesTable);
  }
};

formAvaliableRides.addEventListener("submit", seeAvaliableRides);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "ride");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("book-button")) {
    bookRide(event);
  }
});

formButton.addEventListener("click", () => {
  toggleFormVisibility(
    formAvaliableRides,
    formFields,
    "seeAvaliable",
    errors,
    errorParagraph
  );
});

closeButton.addEventListener("click", () => {
  toggleFormVisibility(
    formAvaliableRides,
    formFields,
    "seeAvaliable",
    errors,
    errorParagraph
  );
});

selectedDay.addEventListener("change", viewBookedRidesOfDay);

logout.addEventListener("click", () => {
  window.location.href = "/logout";
});
