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
`;
  driverDiv.appendChild(newDriverDiv);
};

const onSubmitAddDriverForm = (e) => {
  e.preventDefault();
  const driverName = document.getElementById("driver-name").value;

  console.log(driverName);
  const driverShift = document.getElementById("driver-shift").value;
  console.log(driverShift);
  const driverRoute = document.getElementById("driver-route").value;
  console.log(driverRoute);

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
    .then((respone) => respone.json())
    .then((data) => {
      createDriver(data);
    })
    .catch((error) => console.log(error));
};
formAddDriver.addEventListener("submit", onSubmitAddDriverForm);
