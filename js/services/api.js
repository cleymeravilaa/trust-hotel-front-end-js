const API_BASE = 'http://localhost:8080/api/v1';

async function apiGet(path) {
  const res = await fetch(`${API_BASE}/${path}`);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

async function apiPost(path, data) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

async function apiPut(path, data) {
  const res = await fetch(`${API_BASE}/${path}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

async function apiDelete(path) {
  const res = await fetch(`${API_BASE}/${path}`, { method:'DELETE' });
  if (!res.ok) throw new Error(res.statusText);
  return res;
}
