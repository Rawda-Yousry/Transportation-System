//// ''''''

const formAddDriver = document.getElementById("drivers__add-form");
const driverDiv = document.getElementsByClassName("drivers__wrapper")[0];

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
    <button type="button" class="delete-button" onclick = "deleteDriver(event)" data-id = ${data.id}>Delete</button>
`;

  newDriverDiv.setAttribute("data-id", data.id);
  driverDiv.appendChild(newDriverDiv);
};

const onSubmitAddDriverForm = (e) => {
  e.preventDefault();
  const driverName = document.getElementById("driver-name").value;
  const driverShift = document.getElementById("driver-shift").value;
  const driverRoute = document.getElementById("driver-route").value;

  const formData = {
    name: driverName,
    shift: driverShift,
    route: driverRoute,
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
};

const deleteDriver = (event) => {
  const clickedButton = event.target;
  console.log("clickeddd " + clickedButton)
  const deletedDriverId = clickedButton.getAttribute("data-id");
  console.log("Button ID: " + deletedDriverId);
  const driverDivs = document.getElementsByClassName("driver__wrapper");
  for (let i = 0; i < driverDivs.length; i++) {
    const deletedDriverDivId = driverDivs[i].getAttribute("data-id");
    if (deletedDriverDivId == deletedDriverId) {
      console.log("hhhhhh")
      fetch(`/drivers/delete/${deletedDriverId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          driverDivs[i].remove()
        })
        .catch((error) => console.log(error));
    }
  }
};

