const hotelList = document.getElementById("hotel-list");
const guestList = document.getElementById("guest-list");
const reservationList = document.getElementById("reservation-list");

let hotels = [];
let guests = [];
let reservations = [];

function showSection(id) {
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.add("hidden");
  });
  document.getElementById(id).classList.remove("hidden");
}

function addHotel() {
  const name = document.getElementById("hotel-name").value.trim();
  if (name) {
    hotels.push(name);
    updateHotelList();
    document.getElementById("hotel-name").value = "";
  }
}

function updateHotelList() {
  hotelList.innerHTML = "";
  hotels.forEach((hotel) => {
    const li = document.createElement("li");
    li.textContent = hotel;
    hotelList.appendChild(li);
  });
}

function addGuest() {
  const name = document.getElementById("guest-name").value.trim();
  if (name) {
    guests.push(name);
    updateGuestList();
    document.getElementById("guest-name").value = "";
  }
}

function updateGuestList() {
  guestList.innerHTML = "";
  guests.forEach((guest) => {
    const li = document.createElement("li");
    li.textContent = guest;
    guestList.appendChild(li);
  });
}

function addReservation() {
  const hotel = document.getElementById("reservation-hotel").value.trim();
  const guest = document.getElementById("reservation-guest").value.trim();
  const date = document.getElementById("reservation-date").value;

  if (hotel && guest && date) {
    reservations.push({ hotel, guest, date });
    updateReservationList();
    document.getElementById("reservation-hotel").value = "";
    document.getElementById("reservation-guest").value = "";
    document.getElementById("reservation-date").value = "";
  }
}

function updateReservationList() {
  reservationList.innerHTML = "";
  reservations.forEach((res) => {
    const li = document.createElement("li");
    li.textContent = `${res.guest} reservó en ${res.hotel} para el ${res.date}`;
    reservationList.appendChild(li);
  });
}


