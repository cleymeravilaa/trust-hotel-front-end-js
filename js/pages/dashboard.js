async function dashboardPage() {
  main.innerHTML = `<h2>Dashboard</h2><div class="cards" id="cards"></div>`;
  const cards = document.getElementById('cards');
  const endpoints = [
    {key:'hotels',label:'Hoteles'},
    {key:'rooms',label:'Habitaciones'},
    {key:'employees',label:'Empleados'},
    {key:'customers',label:'Clientes'},
    {key:'bookings',label:'Reservas'},
    {key:'stayings',label:'Estadías'},
    {key:'invoices',label:'Facturas'}
  ];
  for (let e of endpoints) {
    try {
      const data = await apiGet(e.key);
      cards.innerHTML += `<div class="card"><h3>${e.label}</h3><p>${data.length}</p></div>`;
    } catch {
      cards.innerHTML += `<div class="card"><h3>${e.label}</h3><p>Error</p></div>`;
    }
  }
}
