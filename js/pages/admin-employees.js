async function loadEmployees() {
  const c = document.getElementById('admin-content');
  document.getElementById('employees-btn').classList.add('active');
  document.getElementById('hotels-btn').classList.remove('active');
  document.getElementById('rooms-btn').classList.remove('active');
  c.innerHTML = `
    <div class="subheader">
      <h3>Empleados</h3>
      <button id="new-employee-btn" onclick="showRegisterNewEmployeeForm()">+ Nuevo Empleado</button>
      <h4 id="title"></h4>
    </div>
    <div id="employee-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>DNI</th><th>Nombre</th><th>Direccion</th><th>Tipo</th><th>Hotel</th><th>Acciones</th></tr>
    </thead><tbody id="employees-tbody"></tbody></table>`;
  const emps = await apiGet('employees');
  document.getElementById('employees-tbody').innerHTML = emps.map(e=>`
    <tr>
      <td>${e.employeeId}</td><td>${e.dni}</td><td>${e.name}</td><td>${e.address}</td><td>${e.type}</td><td>${e.hotelId}</td>
      <td>
        <button class="btn edit" onclick="editEmployee(${e.employeeId})">✏️</button>
        <button class="btn change-hotel" onclick="changeEmployeeHotel(${e.employeeId})">🏨</button>
        <button class="btn delete" onclick="deleteEmployee(${e.employeeId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showRegisterNewEmployeeForm(e={}) {
  const f = document.getElementById('employee-form');
  const title = document.getElementById('title');
  document.getElementById('new-employee-btn').classList.add('active');
  title.innerText = 'Registrar Nuevo Empleado';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveEmployee(event,${e.employeeId||''})">
      <select name="hotelId" required>
        <option value="" disabled selected>Seleccione un hotel</option>
        ${Object.entries(hotelsName).map(([id, name]) => `<option value="${id}" ${e.hotelId === id ? 'selected' : ''}>${name}</option>`).join('')}
      </select>
      <input name="dni" value="${e.dni||''}" placeholder="DNI" required>
      <input name="name" value="${e.name||''}" placeholder="Nombre" required>
      <input name="address" value="${e.address||''}" placeholder="Direccion" required>
      <input name="type" value="${e.type||''}" placeholder="Rol" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelForm(this, 'new-employee-btn')">Cancelar</button>
    </form>`;
}

function showEmployeeUpdateForm(e={}) {
  const f = document.getElementById('employee-form');
  document.getElementById('new-employee-btn').classList.remove('active');
  const title = document.getElementById('title');
  title.innerText = 'Actualizar Empleado';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveEmployee(event,${e.employeeId||''})">
      <input name="name" value="${e.name||''}" placeholder="Nombre" required>
      <input name="address" value="${e.address||''}" placeholder="Direccion" required>
      <input name="type" value="${e.type||''}" placeholder="Rol" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelForm(this)">Cancelar</button>
    </form>`;
}

async function saveEmployee(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if (id) await apiPut(`employees/${id}`, data);
  else await apiPost('employees', data);
  document.getElementById('employee-form').classList.add('hidden');
  loadEmployees();
}

async function editEmployee(id) {
  const e = await apiGet(`employees/${id}`);
  showEmployeeUpdateForm(e);
}

async function deleteEmployee(id) {
  if (confirm('Eliminar empleado?')) await apiDelete(`employees/${id}`);
  loadEmployees();
}

async function changeEmployeeHotel(employeeId) {
  const e = await apiGet(`employees/${employeeId}`);
  const hotels = await apiGet('hotels');
  const f = document.getElementById('employee-form');
  const title = document.getElementById('title');
  document.getElementById('new-employee-btn').classList.remove('active');
  title.innerText = 'Cambiar Hotel del Empleado';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="setEmployeeHotel(event)">
      <input type="text" name="employeeId" value="${employeeId}" hidden>
      <input type="text" name="employeeName" value="${e.name}" disabled>
      <select name="hotelToChangeId" required>
        <option value="" disabled selected>Seleccione un hotel</option>
        ${hotels.map(h => `<option value="${h.hotelId}" ${h.hotelId === e.hotelId ? 'selected' : ''}>${h.name}</option>`).join('')}
      </select>
      <button type="submit">Cambiar Hotel</button>
      <button type="button" onclick="cancelForm(this)">Cancelar</button>
    </form>`;
}

async function setEmployeeHotel(ev) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  data.hotelToChangeId = Number(data.hotelToChangeId); // Ensure hotelId is a number
  data.employeeId = Number(data.employeeId); // Ensure employeeId is a number
  console.log('Setting employee hotel:', data);
  await apiPut(`employees/change-hotel`, data);
  document.getElementById('employee-form').classList.add('hidden');
  loadEmployees();
}
