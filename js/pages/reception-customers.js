async function receptionPage(section) {
  if (section === 'customers') return loadCustomers();
  if (section === 'bookings') return loadReservations();
  if (section === 'stayings') return loadStays();
  if (section === 'invoices') return loadInvoices();
}

async function loadCustomers() {
  const c = document.getElementById('reception-content');
  document.getElementById('customers-btn').classList.add('active');
  document.getElementById('bookings-btn').classList.remove('active');
  document.getElementById('stayings-btn').classList.remove('active');
  document.getElementById('invoices-btn').classList.remove('active');
  
  const hotels = await apiGet('hotels');
  
  for (const h of hotels) {
    hotelsName[h.hotelId] = h.name;
  }
  c.innerHTML = `
    <div class="subheader">
      <h3>Clientes</h3>
      <div>
        <div class="btn-title-group">
          <button id="new-customer-btn" onclick="showRegisterCustomerForm()">+ Nuevo Cliente</button>
          <h4 id="title"></h4>
        </div>
        <div class="search-customer">
          <label for="customerFound">ℹ️🆔📁📂🔍</label>
          <input id="input-customer-search" type="number" name="customerId" placeholder="Identificación" required>  
          <button type="submit" onclick="searchCustomer()">Buscar</button>
        </div>
      </div>
    </div>
    <div id="client-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>DNI</th><th>Nombre</th><th>Phone</th><th>Direccion</th><th>Acciones</th></tr>
    </thead><tbody id="customers-tbody"></tbody></table>`;
  const cls = await apiGet('customers');
  document.getElementById('customers-tbody').innerHTML = cls.map(cl => `
    <tr>
      <td>${cl.customerId}</td><td>${cl.dni}</td><td>${cl.name}</td><td>${cl.phone}</td><td>${cl.address}</td>
      <td>
        <button class="btn edit" onclick="editClient(${cl.customerId})">✏️</button>
        <button class="btn make-booking" onclick="makeBooking(${cl.customerId})">📅</button>
        <button class="btn delete" onclick="deleteClient(${cl.customerId})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showRegisterCustomerForm(cl = {}) {
  const f = document.getElementById('client-form');
  document.getElementById('new-customer-btn').classList.add('active');
  const title = document.getElementById('title');
  title.innerText = 'Registrar Nuevo Cliente';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveClient(event,${cl.id || ''})">
      <input name="dni" value="${cl.dni || ''}" placeholder="DNI" required>
      <input name="name" value="${cl.nombre || ''}" placeholder="Nombre" required>
      <input name="address" value="${cl.address || ''}" placeholder="Dirección" required>
      <input name="phone" value="${cl.phone || ''}" placeholder="Teléfono" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelForm(this, 'new-customer-btn', 'customers')">Cancelar</button>
    </form>`;
}

function showUpdateCustomerForm(cl = {}) {
  const f = document.getElementById('client-form');
  document.getElementById('new-customer-btn').classList.remove('active');
  const title = document.getElementById('title');
  title.innerText = 'Actualizar Cliente';
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveClient(event,${cl.customerId || ''})">
      <input name="name" value="${cl.name || ''}" placeholder="Nombre" required>
      <input name="address" value="${cl.address|| ''}" placeholder="Dirección" required> 
      <input name="phone" value="${cl.phone || ''}" placeholder="Teléfono" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="cancelForm(this, null, 'customers')">Cancelar</button>
    </form>`;
}

async function saveClient(ev, id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  console.log('Saving client:', data);
  if (id) await apiPut(`customers/${id}`, data);
  else await apiPost('customers', data);
  document.getElementById('client-form').classList.add('hidden');
  loadCustomers();
}

async function editClient(id) {
  const cl = await apiGet(`customers/${id}`);
  showUpdateCustomerForm(cl);
}

async function deleteClient(id) {
  if (confirm('Eliminar cliente?')) await apiDelete(`customers/${id}`);
  loadCustomers();
}

function searchCustomer() {
  const input = document.getElementById('input-customer-search');
  const customerDni = input.value.trim();
  if (!customerDni) {
    alert('Por favor, ingrese un DNI válido.');
    return;
  }
  apiGet(`customers/dni/${customerDni}`) 
    .then(customer => {
      if (customer) {
        input.value = ''; // Limpiar el campo de búsqueda
        alert(`Cliente encontrado: ${customer.name} (ID: ${customer.customerId})`);
        showUpdateCustomerForm(customer);
        document.getElementById('customers-tbody').innerHTML = `
          <tr style="background-color:rgb(171, 200, 250);">
            <td>${customer.customerId}</td><td>${customer.dni}</td><td>${customer.name}</td><td>${customer.phone}</td><td>${customer.address}</td>
            <td>
              <button class="btn edit" onclick="editClient(${customer.customerId})">✏️</button>
              <button class="btn make-booking" onclick="makeBooking(${customer.customerId})">📅</button>
              <button class="btn delete" onclick="deleteClient(${customer.customerId})">🗑️</button>
            </td>
          </tr>`;
      } else {
        alert('Cliente no encontrado.');
      }
    })
    .catch(error => {
      console.error('Error al buscar cliente:', error);
      alert('Error al buscar cliente. Por favor, inténtelo de nuevo.');
    });
} 


async function makeBooking(customerId) {
  receptionPage('bookings');
  const customer = await apiGet(`customers/${customerId}`);

  if (!customer) {
    alert('Cliente no encontrado.');
    return;
  }
  loadReservations(customer.dni);
  showReservationForm();
  document.getElementById('reservation-form').querySelector('input[name="customerId"]').value = customer.customerId;
  document.getElementById('reservation-form').querySelector('input[name="customerName"]').value = customer.name;
  document.getElementById('reservation-form').querySelector('input[name="customerDni"]').value = customer.dni;
  console.log('Cliente encontrado:', customer);
}
