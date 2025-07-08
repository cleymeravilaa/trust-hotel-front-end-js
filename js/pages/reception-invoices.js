async function loadInvoices() {
  const c = document.getElementById('reception-content');
  c.innerHTML = `
    <div class="subheader">
      <h3>Facturas</h3>
      <button onclick="showInvoiceForm()">+ Nueva Factura</button>
      <h4 id="title"></h4>
    </div>    
    <div id="invoice-form" class="hidden"></div>
    <table><thead>
      <tr><th>ID</th><th>EstadiaId</th><th>Total Habitaciones</th><th>$ Monto Total</th><th>Fecha Expedicion</th><th>Acciones</th></tr>
    </thead><tbody id="invoices-tbody"></tbody></table>`;
  const inv = await apiGet('invoices');
  document.getElementById('invoices-tbody').innerHTML = inv.map(i=>`
    <tr>
      <td>${i.stayingId}</td><td>${i.stayingId}</td><td>${i.totalOfRooms}</td><td>${i.finalTotal}</td><td>${i.issueDate}</td>
      <td>
        <button class="btn delete" onclick="deleteInvoice(${i.id})">🗑️</button>
      </td>
    </tr>`).join('');
}

function showInvoiceForm(i={}) {
  const f = document.getElementById('invoice-form');
  f.classList.toggle('hidden', false);
  f.innerHTML = `
    <form onsubmit="saveInvoice(event,${i.id||''})">
      <input name="stayId" value="${i.stayId||''}" placeholder="StayId" required>
      <input name="amount" type="number" step="0.01" value="${i.amount||''}" placeholder="Monto" required>
      <input name="date" type="date" value="${i.date||''}" required>
      <button type="submit">Guardar</button>
      <button type="button" onclick="this.parentElement.parentElement.classList.add('hidden')">Cancelar</button>
    </form>`;
}

async function saveInvoice(ev,id) {
  ev.preventDefault();
  const data = Object.fromEntries(new FormData(ev.target));
  if(id) await apiPut(`invoices/${id}`,data);
  else await apiPost('invoices',data);
  document.getElementById('invoice-form').classList.add('hidden');
  loadInvoices();
}

async function deleteInvoice(id) {
  if(confirm('Eliminar factura?')) await apiDelete(`invoices/${id}`);
  loadInvoices();
}
