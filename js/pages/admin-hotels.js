async function adminPage(section) {
  if (section === 'hotels') return loadHotels();
  if (section === 'rooms') return loadRooms();
  if (section === 'employees') return loadEmployees();
}

async function loadHotels() {
  const c = document.getElementById('admin-content');
  c.innerHTML = `
    <h3>Hoteles</h3>
    <button onclick="showHotelForm()">+ Nuevo Hotel</button>
    <div id="hotel-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th>
      <th>Nombre</th>
      <th>Categoria</th>
      <th>Telefono</th>
      <th>Direccion</th>
      <th>Director</th>
      <th>Acciones</th></tr>
    </thead><tbody id="hotels-tbody"></tbody></table>`;
  const tbody = document.getElementById('hotels-tbody');
  const hotels = await apiGet('hotels');
  tbody.innerHTML = hotels.map(h=>`
    <tr>
      <td>${h.hotelId}</td>
      <td>${h.name}</td>
      <td>${h.category}</td>
      <td>${h.phone}</td>
      <td>${h.address}</td>
      <td>${h.directorId}</td>
      <td>
        <button class="btn edit" onclick="editHotel(${h.hotelId})">✏️</button>
        <button class="btn delete" onclick="deleteHotel(${h.hotelId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showHotelForm(h = {}) {
  const f = document.getElementById('hotel-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveHotel(event,${h.hotelId||''})">
      <input name="name" value="${h.name||''}" placeholder="Nombre" required>
      <input name="address" value="${h.address||''}" placeholder="Ubicación" required>
      <input name="category" value="${h.category||''}" placeholder="Categoria" required>
      <input name="phone" value="${h.phone||''}" placeholder="Telefono" required>
      <input name="directorId" value="${h.directorId||''}" placeholder="Director" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
    console.log(h.category)
}

async function saveHotel(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if (id) await apiPut(`hotels/${id}`, data);
  else await apiPost('hotels', data);
  document.getElementById('hotel-form').classList.add('hidden');
  loadHotels();
}

async function editHotel(id) {
  const h = (await apiGet(`hotels/${id}`));
  showHotelForm(h);
}

async function deleteHotel(id) {
  if (confirm('Eliminar hotel?')) await apiDelete(`hotels/${id}`);
  loadHotels();
}
