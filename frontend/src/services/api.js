// Centraliza todas las llamadas a la API
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

function getToken() {
  return localStorage.getItem('vg_token')
}

function headers(auth = false) {
  const h = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) h['Authorization'] = `Bearer ${t}`
  }
  return h
}

async function request(method, path, body, auth = false) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(auth),
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'Error en la petición')
  return data
}

export const api = {
  // Auth
  login: (email, password) => request('POST', '/auth/login', { email, password }),
  register: (body) => request('POST', '/auth/register', body, true),
  me: () => request('GET', '/auth/me', null, true),
  updateProfile: (body) => request('PATCH', '/auth/me', body, true),
  changePassword: (body) => request('PATCH', '/auth/password', body, true),
  trackRef: (code) => request('GET', `/auth/ref/${code}`),

  // Members (público)
  getMembers: () => request('GET', '/members'),

  // Dashboard
  getDashboard: () => request('GET', '/dashboard', null, true),

  // Leads
  getLeads: () => request('GET', '/leads', null, true),
  createLead: (body) => request('POST', '/leads', body, true),
  createPublicLead: (body) => request('POST', '/leads/public', body), // sin auth
  updateLead: (id, body) => request('PATCH', `/leads/${id}`, body, true),
  deleteLead: (id) => request('DELETE', `/leads/${id}`, null, true),

  // Sales
  getSales: () => request('GET', '/sales', null, true),
  createSale: (body) => request('POST', '/sales', body, true),
  updateSale: (id, body) => request('PATCH', `/sales/${id}`, body, true),
  deleteSale: (id) => request('DELETE', `/sales/${id}`, null, true),

  // Reviews (público)
  getReviews: (productoId) => request('GET', `/reviews/${productoId}`),
  createReview: (productoId, body) => request('POST', `/reviews/${productoId}`, body),
  deleteReview: (id) => request('DELETE', `/reviews/${id}`, null, true),

  // Orders (público para crear, protegido para listar)
  createOrder: (body) => request('POST', '/orders', body),
  createOrderAdmin: (body) => request('POST', '/orders/admin', body, true),
  getOrders: (params = '') => request('GET', `/orders${params}`, null, true),
  updateOrder: (id, body) => request('PATCH', `/orders/${id}`, body, true),
  deleteOrder: (id) => request('DELETE', `/orders/${id}`, null, true),
}
