import {
  checkErrorExists,
  showError,
  deleteEntity,
  toggleFormVisibility,
} from "./utilities.js";
const formAddDriver = document.getElementById("add-form");
const driversDiv = document.getElementsByClassName("home__div")[0];
const addDriverButton = document.getElementById("add-button");
const errorParagraph = document.getElementById("paragraph-error");
const paragraphName = document.getElementById("info");
const formCloseButton = document.getElementById("form-close");
const logoutDiv = document.getElementById("logout");
const formEditDriver = document.getElementById("edit-form");
const editFormCloseButton = document.getElementById("form-edit-close");

const driverShiftEdit = document.getElementById("driver-shift-edit");
const driverDaysEdit = document.getElementById("days-check-box-edit");
const driverStartPointEdit = document.getElementById("driver-start-point-edit");
const driverEndPointEdit = document.getElementById("driver-end-point-edit");

const driverEmail = document.getElementById("driver-email");
const driverName = document.getElementById("driver-name");
const driverShift = document.getElementById("driver-shift");
const driverStartPoint = document.getElementById("driver-start-point");
const driverEndPoint = document.getElementById("driver-end-point");
const driverCarCapacity = document.getElementById("car-capacity");

const errors = document.getElementsByClassName("error"); // Array of all errors found in the form

// To be send to reset the form data in toggle
const formFieldsAdd = [
  driverEmail,
  driverName,
  driverShift,
  driverStartPoint,
  driverEndPoint,
  driverCarCapacity,
];

const formFieldsEdit = [
  driverShiftEdit,
  driverDaysEdit,
  driverStartPoint,
  driverEndPointEdit,
];

const selectedDay = document.getElementById("choose-day");
const emailRegex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;

paragraphName.innerText = localStorage.getItem("AdminMessage");

// Used when edit buuton in table clicked
const dayToNumberMap = {
  Sunday: 1,
  Monday: 2,
  Tuesday: 3,
  Wednesday: 4,
  Thursday: 5,
};

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
      <td>Day</td>
      <td>Avaliable Seats</td>
      <td>Car Capacity </td>
    </tr>`;
  table.innerHTML = headers;
  if (selectedDay == "allDays") {
    data.forEach((driver) => {
      let daysHTML = "";
      let seatsHTML = "";

      for (let day in driver.avaliable_seats_on_days) {
        daysHTML += `${day}<br />`;
        seatsHTML += `${driver.avaliable_seats_on_days[day]}<br />`;
      }
      const rowHTML = `
        <tr data-id="${driver.id}" class="rows">
          <td>${driver.name}</td>
          <td id="shift-cell">${driver.shift}</td>
          <td id="route-cell">${driver.start_point} - ${driver.end_point}</td>
          <td id="select-days-cell" >${daysHTML}</td>
          <td id="avaliable-seats-cell">${seatsHTML}</td>
          <td>${driver.car_capacity}</td>
          <td class="actions">
            <i class="bi bi-x delete-button" data-id="${driver.id}"></i>
          </td>
          <td class="actions">
            <i class="bi-pencil-fill edit-button" data-id="${driver.id}"></i>
          </td>
        </tr>
      `;
      table.innerHTML += rowHTML;
    });
  } else {
    for (let i = 0; i < data.length; i++) {
      table.innerHTML += `<tr data-id=${data[i].id} class="rows" >
        <td>${data[i].name}</td>
        <td id="shift-cell">${data[i].shift}</td>
        <td id="route-cell">${data[i].start_point} - ${data[i].end_point}</td>
        <td id="select-days-cell">${selectedDay}</td>
        <td id="avaliable-seats-cell">${data[i].avaliable_seats_on_days[selectedDay]}
        <td>${data[i].car_capacity}
        <td class="actions"><i class="bi bi-x delete-button" data-id=${data[i].id}></i></td>
        <td class="actions"><i class="bi-pencil-fill edit-button" data-id=${data[i].id}></i></td>
      </tr>
      `;
    }
  }

  driversDiv.appendChild(table);
};

const createDriver = (data, selectedDaysValue) => {
  const element = `
        <tr data-id=${data.id} class="rows">
          <td>${data.name}</td>
          <td id="shift-cell>${data.shift}</td>
          <td id="route-cell">${data.start_point} - ${data.end_point}</td>
          <td id="select-days-cell">${selectedDay.value}</td>
          <td id="avaliable-seats-cell">${
            data.avaliable_seats_on_days[selectedDay.value]
          }</td>
          <td>${data.car_capacity}</td>
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

  if (driverName.value.trim() === "" || !isNaN(driverName.value.trim())) {
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

  if (driverStartPoint.value == "" || driverEndPoint.value == "") {
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
          toggleFormVisibility(
            formAddDriver,
            formFieldsAdd,
            "add",
            errors,
            errorParagraph
          );
          if (errorParagraph.innerText == "") {
            let daysHTML = "";
            let seatsHTML = "";
            const table = document.getElementById("table");
            selectedDaysValue.forEach((day) => {
              daysHTML += `${day}<br />`;
              seatsHTML += `${driverCarCapacity.value}<br />`;
            });
            if (selectedDay.value == "" || selectedDay.value == "allDays") {
              if (table) {
                table.innerHTML += `
                <tr data-id="${data.id}" class="rows">
                  <td>${driverName.value.trim()}</td>
                  <td id="shift-cell">${driverShift.value}</td>
                  <td id="route-cell">${driverStartPoint.value} - ${
                  driverEndPoint.value
                }</td>
                  <td id="select-days-cell">${daysHTML}</td>
                  <td id="avaliable-seats-cell">${seatsHTML}</td>
                  <td>${driverCarCapacity.value}</td>
                  <td class="actions">
                  <i class="bi bi-x delete-button" data-id="${data.id}"></i>
                  </td>
                  <td class="actions">
                    <i
                      class="bi-pencil-fill edit-button"
                      data-id="${data.id}"></i>
                  </td>
                </tr>
                  `;
              }
            }
          }
        }
      })
      .catch((error) => console.log(error));
  }
};

const editDriverInTable = (data, driverEditId) => {
  const rows = document.getElementsByClassName("rows");
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].getAttribute("data-id") == driverEditId) {
      const cells = rows[i].getElementsByTagName("td");
      cells[1].innerText = data.shift;
      cells[2].innerText = `${driverStartPointEdit.value} - ${driverEndPointEdit.value}`;
      if (selectedDay.value == "" || selected.value == "allDays") {
        let days = "";
        let seats = "";
        for (const [day, seat] of Object.entries(
          data.avaliable_seats_on_days
        )) {
          days += `${day} </br>`;
          seats += `${seat} </br>`;
        }
        cells[3].innerHTML = days;
        cells[4].innerHTML = seats;
      }
    }
  }
};

const editDriver = (event) => {
  const driverEditId = event.target.getAttribute("data-id");

  let selectedDaysValue = [];
  for (let i = 1; i < 6; i++) {
    const checkbox = document.getElementById(`checkbox-${i}-edit`);
    if (checkbox && checkbox.checked) {
      selectedDaysValue.push(checkbox.value);
    }
  }
  if (selectedDaysValue.length == 0) {
    showError(driverDaysEdit, "You should choose at least one day");
  } else {
    checkErrorExists(driverDaysEdit);
  }
  if (
    (driverStartPointEdit.value != "Company" &&
      driverEndPointEdit.value != "Company") ||
    driverStartPointEdit.value == driverEndPointEdit.value
  ) {
    showError(driverEndPointEdit, "One of the points should be the company");
  } else {
    checkErrorExists(driverEndPointEdit);
  }
  if (errors.length == 0) {
    const data = {
      driverId: driverEditId,
      driverShiftEdit: driverShiftEdit.value,
      driverDaysEdit: selectedDaysValue,
      driverStartPointEdit: driverStartPointEdit.value,
      driverEndPointEdit: driverEndPointEdit.value,
    };
    fetch("/drivers/edit_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => editDriverInTable(data, driverEditId));
    toggleFormVisibility(
      formEditDriver,
      formFieldsEdit,
      "edit",
      errors,
      errorParagraph
    );
  }
};

addDriverButton.addEventListener("click", () => {
  errorParagraph.innerText = "";
  toggleFormVisibility(
    formAddDriver,
    formFieldsAdd,
    "add",
    errors,
    errorParagraph
  );
});
formAddDriver.addEventListener("submit", onSubmitAddDriverForm);

formCloseButton.addEventListener("click", () => {
  errorParagraph.innerText = "";
  toggleFormVisibility(
    formAddDriver,
    formFieldsAdd,
    "add",
    errors,
    errorParagraph
  );
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("delete-button")) {
    deleteEntity(event, "driver");
  }
});

document.addEventListener("click", (event) => {
  if (event.target.classList.contains("edit-button")) {
    const driverId = event.target.getAttribute("data-id");
    fetch("/drivers/get_edit_driver_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ driver_id: driverId }),
    })
      .then((response) => response.json())
      .then((data) => {
        driverShiftEdit.value = data.driverShift;
        const selectedDays = data.driverDays;
        driverStartPointEdit.value = data.driverStartPoint;
        driverEndPointEdit.value = data.driverEndPoint;

        const allDays = Object.keys(dayToNumberMap);

        allDays.forEach((day) => {
          const checkbox = document.getElementById(
            `checkbox-${dayToNumberMap[day]}-edit`
          );
          if (selectedDays.includes(day)) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        });
        formEditDriver.setAttribute(
          "data-id",
          event.target.getAttribute("data-id")
        );
        toggleFormVisibility(
          formEditDriver,
          formFieldsEdit,
          "edit",
          errors,
          errorParagraph
        );
      })
      .catch((error) => console.log(error));
  }
});

editFormCloseButton.addEventListener("click", () => {
  toggleFormVisibility(
    formEditDriver,
    formFieldsEdit,
    "edit",
    errors,
    errorParagraph
  );
});

logoutDiv.addEventListener("click", () => {
  window.location.href = "/logout";
});

selectedDay.addEventListener("change", viewDriversoFDay);

formEditDriver.addEventListener("submit", (event) => {
  event.preventDefault();
  editDriver(event);
});
