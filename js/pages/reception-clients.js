async function receptionPage(section) {
  if (section === 'clients') return loadClients();
  if (section === 'bookings') return loadReservations();
  if (section === 'stayings') return loadStays();
  if (section === 'invoices') return loadInvoices();
}

async function loadClients() {
  const c = document.getElementById('reception-content');
  c.innerHTML = `
    <div class="subheader">
      <h3>Clientes</h3>
      <button onclick="showClientForm()">+ Nuevo Cliente</button>
      <h4 id="title"></h4>
    </div>
    <div id="client-form" class="hidden"></div>
    <table><thead>
      <tr><th>DNI</th><th>Nombre</th><th>Phone</th><th>Direccion</th><th>Acciones</th></tr>
    </thead><tbody id="clients-tbody"></tbody></table>`;
  const cls = await apiGet('clients');
  document.getElementById('clients-tbody').innerHTML = cls.map(cl=>`
    <tr>
      <td>${cl.dni}</td><td>${cl.name}</td><td>${cl.phone}</td><td>${cl.address}</td>
      <td>
        <button class="btn edit" onclick="editClient(${cl.customerId})">✏️</button>
        <button class="btn delete" onclick="deleteClient(${cl.customerId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showClientForm(cl={}) {
  const f = document.getElementById('client-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveClient(event,${cl.id||''})">
      <input name="nombre" value="${cl.nombre||''}" placeholder="Nombre" required>
      <input name="email" value="${cl.email||''}" placeholder="Email" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

async function saveClient(ev,id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if(id) await apiPut(`clients/${id}`,data);
  else await apiPost('clients',data);
  document.getElementById('client-form').classList.add('hidden');
  loadClients();
}

async function editClient(id) {
  const cl = await apiGet(`clients/${id}`);
  showClientForm(cl);
}

async function deleteClient(id) {
  if(confirm('Eliminar cliente?')) await apiDelete(`clients/${id}`);
  loadClients();
}
