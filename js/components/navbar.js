function renderNavbar() {
  return `
    <nav class="navbar header">
      <div class="logo">HotelChain</div>
      <ul>
        <li><a href="#dashboard" id="nav-dashboard">Dashboard</a></li>
        <li><a href="#administracion" id="nav-administracion">Administración</a></li>
        <li><a href="#recepcion" id="nav-recepcion">Recepción</a></li>
      </ul>
    </nav>`;
}

document.getElementById('navbar').innerHTML = renderNavbar();
