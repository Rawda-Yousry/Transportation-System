import {
  checkErrorExists,
  showError,
  deleteEntity,
  toggleFormVisibility,
} from "./utilities.js";
const formAddDriver = document.getElementById("add-form");
const driversDiv = document.getElementsByClassName("drivers__wrapper")[0];
const addDriverButton = document.getElementById("add-button");
const errorParagraph = document.getElementById("paragraph-error");
const paragraphName = document.getElementById("info");

const selectedDay = document.getElementById("choose-day");
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

paragraphName.innerText = localStorage.getItem("AdminMessage");

const displayDrivers = (data, selectedDay) => {
  const tableExist = document.getElementById("table");
  if (tableExist) {
    tableExist.remove();
  }
  const table = document.createElement("table");
  table.className = "table";
  table.setAttribute("id", "table");
  const headers = `<tr class="table__header">
      <td>Name</td>
      <td>Shift</td>
      <td>Route</td>
      <td>Avaliable Seats</td>
    </tr>`;
  table.innerHTML = headers;
  for (let i = 0; i < data.length; i++) {
    table.innerHTML += `<tr data-id=${data[i].id} class="rows" >
      <td>${data[i].name}</td>
      <td>${data[i].shift}</td>
      <td>${data[i].start_point} - ${data[i].end_point}</td>
      <td>${data[i].avaliable_seats_on_days[selectedDay]}
      <td class="actions"><i class="bi bi-x delete-button" data-id=${data[i].id}></i></td>
      <td class="actions"><i class="bi-pencil-fill edit-button" data-id=${data[i].id}></i></td>
    </tr>
    `;
  }
  driversDiv.appendChild(table);
};

const createDriver = (data, selectedDaysValue) => {
  console.log(selectedDaysValue);
  console.log(selectedDaysValue.length);
  const element = `
        <tr data-id=${data.id} class="rows">
          <td>${data.name}</td>
          <td>${data.shift}</td>
          <td>${data.start_point} - ${data.end_point}</td>
          <td>${data.avaliable_seats_on_days[selectedDay.value]}
          <td class="actions"><i class="bi bi-x delete-button" data-id=${
            data.id
          } ></i></td>
          <td class="actions"><i class="bi-pencil-fill edit-buttton" data-id=${
            data.id
          }></i></td>
        </tr>
        `;
  const table = document.getElementById("table");
  for (let i = 0; i < selectedDaysValue.length; i++) {
    if (selectedDay.value == selectedDaysValue[i]) {
      if (table) {
        table.innerHTML += element;
        console.log(table);
      } else {
        displayDrivers(data, selectedDay);
      }
    }
  }
};

const viewDriversoFDay = () => {
  const selectedDayValue = selectedDay.value;
  fetch("drivers/view_drivers_of_day", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ selectedDay: selectedDayValue }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      const table = document.getElementById("table");
      if (table) {
        table.remove();
      }
      displayDrivers(data, selectedDayValue);
    })
    .catch((error) => console.log(error));
};

const getSelectedDays = () => {
  let selectedDaysValue = [];
  for (let i = 1; i < 6; i++) {
    const checkbox = document.getElementById(`checkbox-${i}`);
    if (checkbox && checkbox.checked) {
      selectedDaysValue.push(checkbox.value);
    }
  }
  return selectedDaysValue;
};

const onSubmitAddDriverForm = (e) => {
  e.preventDefault();
  const driverEmail = document.getElementById("driver-email");
  const driverName = document.getElementById("driver-name");
  const driverShift = document.getElementById("driver-shift");
  const driverStartPoint = document.getElementById("driver-start-point");
  const driverEndPoint = document.getElementById("driver-end-point");
  const driverCarCapacity = document.getElementById("car-capacity");
  const errorElements = document.getElementsByClassName("error");
  const selectedDaysValue = getSelectedDays();
  const daysCheckBox = document.getElementById("days-check-box");

  if (driverEmail.value.trim() === "") {
    showError(driverEmail, "You should enter the driver's email");
  } else if (!emailRegex.test(driverEmail.value.trim())) {
    showError(driverEmail, "You should enter the driver's email");
  } else {
    checkErrorExists(driverEmail);
  }

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
  if (Number(driverCarCapacity.value) <= 0 || driverCarCapacity.value == "") {
    showError(driverCarCapacity, "You should enter the car capacity");
  } else if (Number(driverCarCapacity.value) > 14) {
    showError(driverCarCapacity, "You should enter a reasonable car capacity");
  } else {
    checkErrorExists(driverCarCapacity);
  }

  if (driverStartPoint.value == "" || driverEndPoint == "") {
    showError(driverEndPoint, "You should choose a route");
  } else {
    checkErrorExists(driverEndPoint);
  }
  if (
    driverStartPoint.value != "Company" &&
    driverEndPoint.value != "Company"
  ) {
    showError(driverEndPoint, "One of the points must be the company");
  } else {
    checkErrorExists(driverEndPoint);
    if (driverStartPoint.value === driverEndPoint.value) {
      showError(driverEndPoint, " You should change one of the points");
    } else {
      checkErrorExists(driverEndPoint);
    }
  }
  if (selectedDaysValue.length == 0) {
    showError(daysCheckBox, " You should select at least one day");
  } else {
    checkErrorExists(daysCheckBox);
  }
  if (errorElements.length === 0) {
    const formData = {
      email: driverEmail.value.trim(),
      name: driverName.value.trim(),
      shift: driverShift.value,
      startPoint: driverStartPoint.value,
      endPoint: driverEndPoint.value,
      carCapacity: driverCarCapacity.value,
      avaliableDays: selectedDaysValue,
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
        if (data.message) {
          errorParagraph.innerText = data.message;
        } else {
          errorParagraph.innerText = "";
          createDriver(data, selectedDaysValue);
          toggleFormVisibility(formAddDriver);
        }
      })
      .catch((error) => console.log(error));
  }
};

addDriverButton.addEventListener("click", () => {
  toggleFormVisibility(formAddDriver);
});
formAddDriver.addEventListener("submit", onSubmitAddDriverForm);

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "driver");
  }
});

selectedDay.addEventListener("change", viewDriversoFDay);
