async function loadEmployees() {
  const c = document.getElementById('admin-content');
  c.innerHTML = `
    <h3>Empleados</h3>
    <button onclick="showRegisterNewEmployeeForm()">+ Nuevo Empleado</button>
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
        <button class="btn delete" onclick="deleteEmployee(${e.employeeId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showRegisterNewEmployeeForm(e={}) {
  const f = document.getElementById('employee-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveEmployee(event,${e.employeeId||''})">
      <input name="hotelId" value="${e.hotelId||''}" placeholder="Hotel ID" required>
      <input name="dni" value="${e.dni||''}" placeholder="DNI" required>
      <input name="name" value="${e.name||''}" placeholder="Nombre" required>
      <input name="address" value="${e.address||''}" placeholder="Direccion" required>
      <input name="type" value="${e.type||''}" placeholder="Rol" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

function showEmployeeUpdateForm(e={}) {
  const f = document.getElementById('employee-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveEmployee(event,${e.employeeId||''})">
      <input name="hotelId" value="${e.hotelId||''}" placeholder="Hotel ID" required>
      <input name="name" value="${e.name||''}" placeholder="Nombre" required>
      <input name="address" value="${e.address||''}" placeholder="Direccion" required>
      <input name="type" value="${e.type||''}" placeholder="Rol" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
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
