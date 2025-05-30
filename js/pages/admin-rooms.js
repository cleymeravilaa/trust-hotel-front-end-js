async function loadRooms() {
  const c = document.getElementById('admin-content');
  c.innerHTML = `
    <h3>Habitaciones</h3>
    <button onclick="showRegisterNewRoomForm()">+ Nueva Habitación</button>
    <div id="room-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>HotelId</th><th>Tipo</th><th>Estado</th><th>Precio Base</th><th>Acciones</th></tr>
    </thead><tbody id="rooms-tbody"></tbody></table>`;
  const rooms = await apiGet('rooms');
  document.getElementById('rooms-tbody').innerHTML = rooms.map(r=>`
    <tr>
      <td>${r.roomId}</td><td>${r.hotelId}</td><td>${r.type}</td><td>${r.status}</td><td>${r.basePrice}</td>
      <td>
        <button class="btn edit" onclick="editRoom(${r.roomId})">✏️</button>
        <button class="btn delete" onclick="deleteRoom(${r.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showRegisterNewRoomForm(r = {}) {
  const f = document.getElementById('room-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveRoom(event,${r.roomId||''})">
      <input name="hotelId" value="${r.hotelId||''}" placeholder="Hotel ID" required>
      <select name="type" required>
        <option ${r.type==='SINGLE'?'selected':''}>PERSONAL</option>
        <option ${r.type==='DOUBLE'?'selected':''}>DOBLE</option>
        <option ${r.type==='TRIPLE'?'selected':''}>TRIPLE</option>
        <option ${r.type==='SUITE'?'selected':''}>SUITE</option>
        <option ${r.type==='STANDAR'?'selected':''}>ESTANDAR</option>
        <option ${r.type==='FAMILY'?'selected':''}>FAMILIAR</option>
      </select>
      <input name="basePrice" type="number" value="${r.basePrice||''}" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

function showUpdateRoomForm(r = {}) {
  const f = document.getElementById('room-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveRoom(event,${r.roomId||''})">
      <input name="hotelId" value="${r.hotelId||''}" placeholder="HotelId" required>
      <input name="tipo" value="${r.status||''}" placeholder="Tipo" required>
      <select name="estado" required>
        <option ${r.status==='FREE'?'selected':''}>DISPONIBLE</option>
        <option ${r.status==='OCCUPIED'?'selected':''}>OCUPADO</option>
      </select>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}
async function saveRoom(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if (id) await apiPut(`rooms/${id}`, data);
  else await apiPost('rooms', data);
  document.getElementById('room-form').classList.add('hidden');
  loadRooms();
}

async function editRoom(id) {
  const r = await apiGet(`rooms/${id}`);
  showRoomForm(r);
}

async function deleteRoom(id) {
  if (confirm('Eliminar habitación?')) await apiDelete(`rooms/${id}`);
  loadRooms();
}
