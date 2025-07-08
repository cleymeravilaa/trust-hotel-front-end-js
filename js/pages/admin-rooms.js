async function loadRooms() {
  const c = document.getElementById('admin-content');
  document.getElementById('rooms-btn').classList.add('active');
  document.getElementById('hotels-btn').classList.remove('active');
  document.getElementById('employees-btn').classList.remove('active');
  c.innerHTML = `
    <div class="subheader">
      <h3>Habitaciones</h3>
      <button id="new-room-btn" onclick="showRegisterNewRoomForm()">+ Nueva Habitación</button>
      <h4 id="title"></h4>
    </div>
    <div id="room-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>Hotel</th><th>Tipo</th><th>Estado</th><th>Precio Base</th><th>Acciones</th></tr>
    </thead><tbody id="rooms-tbody"></tbody></table>`;
  const rooms = await apiGet('rooms');
  document.getElementById('rooms-tbody').innerHTML = rooms.map(r => `
    <tr>
      <td>${r.roomId}</td><td>${r.hotelId === null ? '' : hotelsName[r.hotelId]}</td><td>${r.type}</td><td>${r.status}</td><td>${r.basePrice}</td>
      <td>
        <button class="btn edit" onclick="editRoom(${r.roomId})">✏️</button>
        <button class="btn delete" onclick="deleteRoom(${r.roomId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showRegisterNewRoomForm(r = {}) {
  const f = document.getElementById('room-form');
  const title = document.getElementById('title');
  document.getElementById('new-room-btn').classList.add('active');
  title.innerText = 'Registrar Nueva Habitación';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveRoom(event,${r.roomId || ''})">
      <select name="hotelId" required>
        <option value="" disabled selected>Seleccione un hotel</option>
        ${Object.entries(hotelsName).map(([id, name]) => `<option value="${id}" ${r.hotelId === id ? 'selected' : ''}>${name}</option>`).join('')}
      </select>
      <select name="type" required>
        <option value="" disabled selected>Seleccione un tipo</option>
        <option ${r.type === 'SINGLE' ? 'selected' : ''}>PERSONAL</option>
        <option ${r.type === 'DOUBLE' ? 'selected' : ''}>DOBLE</option>
        <option ${r.type === 'TRIPLE' ? 'selected' : ''}>TRIPLE</option>
        <option ${r.type === 'SUITE' ? 'selected' : ''}>SUITE</option>
        <option ${r.type === 'STANDAR' ? 'selected' : ''}>ESTANDAR</option>
        <option ${r.type === 'FAMILY' ? 'selected' : ''}>FAMILIAR</option>
      </select>
      <input name="basePrice" type="number" value="${r.basePrice || ''}" required placeholder="Precio Base">
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelForm(this, 'new-room-btn')" class="cancel-btn">Cancelar</button>
    </form>`;
}

function showUpdateRoomForm(r = {}) {
  const f = document.getElementById('room-form');
  const title = document.getElementById('title');
  document.getElementById('new-room-btn').classList.remove('active');
  title.innerText = 'Actualizar Habitación';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveRoom(event,${r.roomId || ''})">
      <input type="number" name="roomId" value="${r.roomId || ''}" disabled>
      <input name="hotelId" value="${r.hotelId === null ? '' : hotelsName[r.hotelId] || ''}" placeholder="HotelId" required disabled>
      <select name="type" required>
        <option ${r.type === 'PERSONAL' ? 'selected' : ''}>PERSONAL</option>
        <option ${r.type === 'DOBLE' ? 'selected' : ''}>DOBLE</option>
        <option ${r.type === 'TRIPLE' ? 'selected' : ''}>TRIPLE</option>
        <option ${r.type === 'SUITE' ? 'selected' : ''}>SUITE</option>
        <option ${r.type === 'ESTANDAR' ? 'selected' : ''}>ESTANDAR</option>
        <option ${r.type === 'FAMILIAR' ? 'selected' : ''}>FAMILIAR</option>
      </select>
      <input name="basePrice" type="number" value="${r.basePrice || ''}" required placeholder="Precio Base">
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}
async function saveRoom(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  console.log(data);
  if (id) await apiPut(`rooms/${id}`, data);
  else await apiPost('rooms', data);
  document.getElementById('room-form').classList.add('hidden');
  loadRooms();
}

async function editRoom(id) {
  const r = await apiGet(`rooms/${id}`);
  console.log(r);
  showUpdateRoomForm(r);
}

async function deleteRoom(id) {
  if (confirm('Eliminar habitación?')) await apiDelete(`rooms/${id}`);
  loadRooms();
}
