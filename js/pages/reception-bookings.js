let  selectedRooms = []; 
async function loadReservations(customerDni) {
  selectedRooms = [];
  const c = document.getElementById('reception-content');
  document.getElementById('customers-btn').classList.remove('active');
  document.getElementById('bookings-btn').classList.add('active');
  document.getElementById('stayings-btn').classList.remove('active');
  document.getElementById('invoices-btn').classList.remove('active');
  c.innerHTML = `
    <div class="subheader">
      <h3>Reservas</h3>
      <div>
        <div class="btn-title-group">
          <button id="new-booking-btn" onclick="showReservationForm()" hidden>+ Nueva Reserva</button>
          <h4 id="title"></h4>
        </div>
        <div class="search-customer">
          <label for="customerFound">ℹ️🆔📁📂🔍</label>
          <input id="input-booking-search" type="number" name="customerId" placeholder="Identificación" required>
          <button type="submit" onclick="searchCustomerForBooking()">Buscar</button>
        </div>
      </div>
    </div>
    <div id="reservation-form" class="hidden"></div>
    <table>
      <thead>
        <tr>
          <th>ID</th>
          <th>Cliente</th>
          <th>Hotel</th>
          <th>Fecha de inicio</th>
          <th>Fecha de finalización</th>
          <th>Depósito Avance</th>
          <th>ID Habitaciones</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody id="reservations-tbody"></tbody>
    </table>`;

  let rs = [];

  if (customerDni) {
    rs = await apiGet(`bookings/customerDni/${customerDni}`);
    console.log('Reservas encontradas para el cliente:', rs);
  } else {
    rs = await apiGet('bookings');
  }
  document.getElementById('reservations-tbody').innerHTML = rs.map(r=>`
    <tr>
      <td>${r.bookingId}</td>
      <td>${r.customerDni}</td>
      <td>${r.hotelName}</td>
      <td>${r.startDate}</td><td>${r.endDate}</td>
      <td>${r.advanceDeposit}</td> 
      <td>${r.rooms ? r.rooms.map(room => `<span class="room-id">${room.roomId}</span>`).join(', ') : 'N/A'}</td>
      <td>
        <button class="btn edit" onclick="editReservation(${r.bookingId})">✏️</button>
        <button class="btn delete" onclick="deleteReservation(${r.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showReservationForm(r={}) {
  const f = document.getElementById('reservation-form');
  const title = document.getElementById('title');
  title.innerText = r.bookingId ? 'Actualizar Reserva' : 'Registrar Nueva Reserva';
  document.getElementById('new-booking-btn').classList.add('active');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
      <div>
        <input name="customerId" value="${r.customerId||''}" placeholder="ID Cliente" required disabled hidden>
        <input name="customerDni" value="${r.dni || ''}" placeholder="DNI Cliente" required disabled>
        <input name="customerName"value="${r.name || ''}" placeholder="Nombre Cliente" required disabled>
      </div>
      <div class="search-room">
        <form onsubmit="searchRooms(event)">
          <select name="hotelId" required>
            <option value="" disabled selected>Seleccione un hotel</option>
            ${Object.entries(hotelsName).map(([id, name]) => `<option value="${id}" ${r.hotelId === id ? 'selected' : ''}>${name}</option>`).join('')}
          </select>
          <input name="startDate" type="date" value="${r.startDate||''}" required>
          <input name="endDate" type="date" value="${r.endDate||''}" required>
          <button type="submit">Buscar Habitaciones</button>
          <button type="button" onclick="cancelForm(this, 'null', 'bookings')">Cancelar</button>
       </form>
        <table class="hidden" id="available-rooms-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Hotel</th>
              <th>Tipo</th>
              <th>Precio Base</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody id="rooms-tbody"></tbody>
        </table>
      </div>
      <button type="button" onclick="saveBooking()">Guardar</button>
      <button type="button" onclick="cancelForm(this, 'new-booking-btn', 'bookings')">Cancelar</button>
    </div>`;
   document.getElementsByName('customerName')[0].disabled = true; // Deshabilitar el campo de nombre del cliente
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

function searchCustomerForBooking() {
  const input = document.getElementById('input-booking-search');
  const customerDni = input.value;
  if (!customerDni) {
    alert('Por favor, ingrese un DNI válido.');
    return;
  }
  apiGet(`customers/dni/${customerDni}`)
    .then(customer => {
      if (customer) {
        alert(`Cliente encontrado: ${customer.name} (ID: ${customer.customerId})`);
        input.value = ''; // Limpiar el campo de búsqueda
        showReservationForm(customer);
      } else {
        alert('Cliente no encontrado.');
      }
    })
    .catch(error => {
      console.error('Error al buscar el cliente:', error);
      alert('Error al buscar el cliente. Por favor, inténtelo de nuevo.');
    });

   loadReservations(customerDni);
}


async function searchRooms(ev) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  console.log(data.hotelId, data.startDate, data.endDate);
  document.getElementById('available-rooms-table').classList.remove('hidden'); 
  apiPost(`rooms/available`, data)
    .then(rooms => {
      const roomsTbody = document.getElementById('rooms-tbody');
      roomsTbody.innerHTML = rooms.map(r => `
        <tr>
          <td>${r.roomId}</td><td>${r.hotelId}</td><td>${r.type}</td><td>${r.basePrice}</td>
          <td>
            <button class="btn select-room" onclick="selectRoom(${r.roomId}, this.parentElement.parentElement)">✅</button>
            <button class="btn cancel-select-room" onclick="cancelSelectRoom(${r.roomId}, this.parentElement.parentElement)">❌</button>
          </td>
        </tr>`).join('');
      document.getElementById('rooms-tbody').hidden = false;
    })
    .catch(error => {
      console.error('Error al buscar habitaciones:', error);
      alert('Error al buscar habitaciones. Por favor, inténtelo de nuevo.');
    });
}

function selectRoom(roomId, tr) {
  tr.style.backgroundColor = '#74aabdff';
  selectedRooms.push(roomId);
  console.log('Habitación seleccionada:', roomId);
  console.log(selectedRooms);
  selectedRooms = [...new Set(selectedRooms)]; // Eliminar duplicados 
  console.log('Habitaciones seleccionadas sin duplicados:', selectedRooms);
}

function cancelSelectRoom(roomId, tr) {
  tr.style.backgroundColor = '';
  selectedRooms = selectedRooms.filter(id => id !== roomId);
  console.log('Habitación deseleccionada:', roomId);
  console.log('Habitaciones restantes:', selectedRooms);
}

function saveBooking() {
  if (selectedRooms.length === 0) {
    alert('Por favor, seleccione al menos una habitación.');
    return;
  }

  const inputCustomerId = document.getElementById('reservation-form').querySelector('input[name="customerId"]');
  const inputHotelId = document.getElementById('reservation-form').querySelector('select[name="hotelId"]');
  const inputStartDate = document.getElementById('reservation-form').querySelector('input[name="startDate"]');
  const inputEndDate = document.getElementById('reservation-form').querySelector('input[name="endDate"]');


  const data = {
    customerId : parseInt(inputCustomerId.value),
    hotelId : parseInt(inputHotelId.value),
    startDate : inputStartDate.value,
    endDate : inputEndDate.value,
    roomIds : selectedRooms
  };


  console.log('Datos de la reserva:', data);


  apiPost('bookings', data)
    .then(() => {
      document.getElementById('reservation-form').classList.add('hidden');
      loadReservations();
      
      selectedRooms = []; // Limpiar la lista de habitaciones seleccionadas
      alert('Reserva guardada exitosamente.');
    })
    .catch(error => {
      console.error('Error al guardar la reserva:', error);
      alert('Error al guardar la reserva. Por favor, inténtelo de nuevo.');
    });
}