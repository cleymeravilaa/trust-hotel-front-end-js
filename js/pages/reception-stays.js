async function loadStays() {
  const c = document.getElementById('reception-content');
  c.innerHTML = `
    <div class="subheader">
      <h3>Estadías</h3>
      <button onclick="showStayForm()">+ Nueva Estadía</button>
      <h4 id="title"></h4>
    </div>
    <div id="stay-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>ReservaId</th><th>Fecha Inicio</th><th>Fecha Fin</th><th>Acciones</th></tr>
    </thead><tbody id="stays-tbody"></tbody></table>`;
  const ss = await apiGet('stayings');
  document.getElementById('stays-tbody').innerHTML = ss.map(s=>`
    <tr>
      <td>${s.stayingId}</td><td>${s.bookingId}</td><td>${s.startDate}</td><td>${s.endDate}</td>
      <td>
        <button class="btn delete" onclick="deleteStay(${s.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showStayForm(s={}) {
  const f = document.getElementById('stay-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveStay(event,${s.id||''})">
      <input name="reservationId" value="${s.reservationId||''}" placeholder="ReservationId" required>
      <input name="checkIn" type="date" value="${s.checkIn||''}" required>
      <input name="checkOut" type="date" value="${s.checkOut||''}" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

async function saveStay(ev,id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if(id) await apiPut(`stayings/${id}`,data);
  else await apiPost('stayings',data);
  document.getElementById('stay-form').classList.add('hidden');
  loadStays();
}

async function deleteStay(id) {
  if(confirm('Eliminar estadía?')) await apiDelete(`stayings/${id}`);
  loadStays();
}
