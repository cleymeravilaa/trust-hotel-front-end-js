async function loadReservations() {
  const c = document.getElementById('reception-content');
  c.innerHTML = `
    <div class="subheader">
      <h3>Reservas</h3>
      <button onclick="showReservationForm()">+ Nueva Reserva</button>
      <h4 id="title"></h4>
    </div>
    <div id="reservation-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>Cliente</th><th>Hotel</th><th>CheckIn</th><th>CheckOut</th><th>Acciones</th></tr>
    </thead><tbody id="reservations-tbody"></tbody></table>`;
  const rs = await apiGet('bookings');
  document.getElementById('reservations-tbody').innerHTML = rs.map(r=>`
    <tr>
      <td>${r.bookingId}</td><td>${r.customerId}</td><td>${r.hotelId}</td>
      <td>${r.startDate}</td><td>${r.endDate}</td>
      <td>
        <button class="btn edit" onclick="editReservation(${r.bookingId})">✏️</button>
        <button class="btn delete" onclick="deleteReservation(${r.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showReservationForm(r={}) {
  const f = document.getElementById('reservation-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveReservation(event,${r.bookingId||''})">
      <input name="clientId" value="${r.roomIds||''}" placeholder="ClientId" required>
      <input name="hotelId" value="${r.hotelId||''}" placeholder="HotelId" required>
      <input name="checkIn" type="date" value="${r.startDate||''}" required>
      <input name="checkOut" type="date" value="${r.endDate||''}" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

async function saveReservation(ev,id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if(id) await apiPut(`bookings/${id}`,data);
  else await apiPost('bookings',data);
  document.getElementById('reservation-form').classList.add('hidden');
  loadReservations();
}

async function editReservation(id) {
  const r = await apiGet(`bookings/${id}`);
  showReservationForm(r);
}

async function deleteReservation(id) {
  if(confirm('Eliminar reserva?')) await apiDelete(`reservations/${id}`);
  loadReservations();
}
