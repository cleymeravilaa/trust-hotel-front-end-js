const hotelsName = {};
const directors = {};
async function adminPage(section) {
  if (section === 'hotels') return loadHotels();
  if (section === 'rooms') return loadRooms();
  if (section === 'employees') return loadEmployees();
}

async function loadHotels() {
  const c = document.getElementById('admin-content');
  document.getElementById('hotels-btn').classList.add('active');
  document.getElementById('rooms-btn').classList.remove('active');
  document.getElementById('employees-btn').classList.remove('active');
  c.innerHTML = `
    <div class="subheader">
      <h3>Hoteles</h3>
      <button id="new-hotel-btn" onclick="showRegisterNewHotelForm()">+ Nuevo Hotel</button>
      <h4 id="title"></h4>
    </div>
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
  const employees = await apiGet('employees');
  const directorsList = employees.filter(e => e.type === 'DIRECTOR');
  for (const h of hotels) {
    directors[h.directorId] = directorsList.find(e => e.employeeId === h.directorId).name;
  }
  for(const h of hotels) {
    hotelsName[h.hotelId] = h.name; 
  }
  tbody.innerHTML = hotels.map(h => `
    <tr>
      <td>${h.hotelId}</td>
      <td>${h.name}</td>
      <td>${h.category}</td>
      <td>${h.phone}</td>
      <td>${h.address}</td>
      <td>${h.directorId === null ? '' : directors[h.directorId]}</td>  
      <td>
        <button class="btn edit" onclick="editHotel(${h.hotelId})">✏️</button>
        <button class="btn change-director" onclick="changeHotelDirector(${h.hotelId})">👤</button>
        <button class="btn delete" onclick="deleteHotel(${h.hotelId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showUpdateHotelForm(h = {}) {
  const f = document.getElementById('hotel-form');
  document.getElementById('new-hotel-btn').classList.remove('active');
  const title = document.getElementById('title');
  title.innerText = 'Actualizar Hotel';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveHotel(event, ${h.hotelId || ''})">
      <input name="hotelId" value="${h.hotelId || ''}" type="number" hidden>
      <input name="name" value="${h.name || ''}" placeholder="Nombre" required>
      <input name="address" value="${h.address || ''}" placeholder="Ubicación" required>
      <input name="category" value="${h.category || ''}" placeholder="Categoria" required>
      <input name="phone" value="${h.phone || ''}" placeholder="Telefono" required>
      <button type="submit">Guardar</button>
      <button 
        class="cancel-btn"
        onclick="cancelForm(this, null, 'hotels')"
        type="button"
      </button>
    </form>`;
}

function showRegisterNewHotelForm(h = {}) {
  const f = document.getElementById('hotel-form');
  const title = document.getElementById('title');
  document.getElementById('new-hotel-btn').classList.add('active');
  title.innerText = 'Registrar Nuevo Hotel';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveHotel(event, ${h.hotelId || ''})">
      <input name="name" value="${h.name || ''}" placeholder="Nombre" required>
      <input name="address" value="${h.address || ''}" placeholder="Ubicación" required>
      <input name="category" value="${h.category || ''}" placeholder="Categoria" required>
      <input name="phone" value="${h.phone || ''}" placeholder="Telefono" required>
      <button type="submit">Guardar</button>
      <button class="cancel-btn" type="button" onclick="cancelForm(this, 'new-hotel-btn', 'hotels')">Cancelar</button>
    </form>`;
}

async function saveHotel(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));

  // Convert to numbers if necessary
  data['hotelId'] = Number(data.hotelId);
  data['category'] = Number(data.category);


  console.log(data);
  if (id) await apiPut(`hotels/${id}`, data);
  else await apiPost('hotels', data) ;

  document.getElementById('hotel-form').classList.add('hidden');
  loadHotels();
}

async function editHotel(id) {
  const h = (await apiGet(`hotels/${id}`));
  showUpdateHotelForm(h);
}

async function deleteHotel(id) {
  if (confirm('Eliminar hotel?')) await apiDelete(`hotels/${id}`);
  loadHotels();
}

async function changeHotelDirector(hotelId){
  const title = document.getElementById('title');
  document.getElementById('new-hotel-btn').classList.remove('active');
  title.innerText = 'Cambiar Director';
  const employees = await apiGet('employees');
  const hotel = await apiGet(`hotels/${hotelId}`);
  const currentDirector = employees.find(e => e.employeeId === hotel.directorId);
  
  const employeesDirector = employees.filter(e => e.type === 'DIRECTOR');
  const options = employeesDirector.map(e => `<option value="${e.employeeId}" ${e.employeeId === currentDirector?.employeeId ? 'selected' : ''}>${e.employeeId +'  '+ e.name}</option>`).join(''); 
  
  const formHtml = `
    <form onsubmit="setHotelDirector(event)">
      <input type="text" name="hotelId" value="${hotelId}" hidden>
      <input type="text" name="hotelName" value="${hotel.name}" disabled>
      <select name="directorId" required>
        <option value="" disabled>Seleccione un director</option>
        ${options}
      </select>
      <button type="submit">Guardar</button>
      <button type="button" class="cancel-btn" onclick="cancelForm(this, null, 'hotels')">Cancelar</button>
    </form>`;
  
  const f = document.getElementById('hotel-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = formHtml;
}

async function setHotelDirector(ev) {
  console.log('se esta seteando al director');
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  data['hotelId'] = Number(data.hotelId);
  data['directorId'] = Number(data.directorId);
  
  await apiPut(`hotels/change-director`, data);
  
  document.getElementById('hotel-form').classList.add('hidden');
  loadHotels();
}


function cancelForm(button, id, section) {
  console.log('cancelar formulario');
  button.parentElement.classList.add('hidden');
  document.getElementById('title').innerText = '';
  if (id) document.getElementById(id).classList.remove('active');
  if (section) adminPage(section) && receptionPage(section);
}