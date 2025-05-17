async function loadEmployees() {
  const c = document.getElementById('admin-content');
  c.innerHTML = `
    <h3>Empleados</h3>
    <button onclick="showEmployeeForm()">+ Nuevo Empleado</button>
    <div id="employee-form" class="hidden"></div>
    <table><thead>
      <tr><th>DNI</th><th>Nombre</th><th>Direccion</th><th>Tipo</th><th>Acciones</th></tr>
    </thead><tbody id="employees-tbody"></tbody></table>`;
  const emps = await apiGet('employees');
  document.getElementById('employees-tbody').innerHTML = emps.map(e=>`
    <tr>
      <td>${e.dni}</td><td>${e.name}</td><td>${e.address}</td><td>${e.type}</td>
      <td>
        <button class="btn edit" onclick="editEmployee(${e.id})">✏️</button>
        <button class="btn delete" onclick="deleteEmployee(${e.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showEmployeeForm(e={}) {
  const f = document.getElementById('employee-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveEmployee(event,${e.employeeId||''})">
      <input name="nombre" value="${e.name||''}" placeholder="Nombre" required>
      <input name="rol" value="${e.type||''}" placeholder="Rol" required>
      <input name="hotelId" value="${e.hotelId||''}" placeholder="HotelId" required>
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
  showEmployeeForm(e);
}

async function deleteEmployee(id) {
  if (confirm('Eliminar empleado?')) await apiDelete(`employees/${id}`);
  loadEmployees();
}
