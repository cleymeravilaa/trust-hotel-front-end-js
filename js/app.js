const main = document.getElementById('main-content');

window.addEventListener('hashchange', router);
window.addEventListener('load', () => {
  setActiveNav();
  router();
});

function setActiveNav() {
  ['dashboard','administracion','recepcion'].forEach(id => {
    const a = document.getElementById('nav-'+id);
    a.classList.toggle('active', location.hash === '#'+id);
  });
}

function router() {
  setActiveNav();
  const hash = location.hash.replace('#','') || 'dashboard';
  main.innerHTML = '';
  if (hash === 'dashboard') dashboardPage();
  else if (hash === 'administracion') adminSubRouter();
  else if (hash === 'recepcion') receptionSubRouter();
}

// Subrutas de Administración
function adminSubRouter() {
  main.innerHTML = `
    <h2>Administración</h2>
    <nav>
      <button onclick="adminPage('hotels')">Hoteles</button>
      <button onclick="adminPage('rooms')">Habitaciones</button>
      <button onclick="adminPage('employees')">Empleados</button>
    </nav>
    <div id="admin-content"></div>`;
  adminPage('hotels');
}

// Subrutas de Recepción
function receptionSubRouter() {
  main.innerHTML = `
    <h2>Recepción</h2>
    <nav>
      <button onclick="receptionPage('customers')">Clientes</button>
      <button onclick="receptionPage('bookings')">Reservas</button>
      <button onclick="receptionPage('stayings')">Estadías</button>
      <button onclick="receptionPage('invoices')">Facturas</button>
    </nav>
    <div id="reception-content"></div>`;
  receptionPage('clients');
}

// Exponer para HTML inline
window.adminPage = adminPage;
window.receptionPage = receptionPage;
