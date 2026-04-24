/**
 * Move Like Her — Service API
 * Toutes les requêtes vers le back-end Laravel passent par ici.
 */

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

/** Lit le token Sanctum depuis localStorage */
function getToken() {
  return localStorage.getItem('mlh_token')
}

/** Construction des headers communs */
function headers(extra = {}) {
  const h = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...extra,
  }
  const token = getToken()
  if (token) h['Authorization'] = `Bearer ${token}`
  return h
}

/** Requête générique */
async function request(method, path, body = null) {
  const options = { method, headers: headers() }
  if (body) options.body = JSON.stringify(body)

  const res = await fetch(`${BASE_URL}${path}`, options)
  const data = await res.json().catch(() => ({}))

  if (!res.ok) {
    const error = new Error(data.message || `Erreur ${res.status}`)
    error.status = res.status
    error.errors = data.errors || {}
    throw error
  }

  return data
}

const get  = (path)        => request('GET',    path)
const post = (path, body)  => request('POST',   path, body)
const del  = (path)        => request('DELETE', path)

// ─── Auth ────────────────────────────────────────────────────────
export const auth = {
  register:      (data)  => post('/register', data),
  login:         (data)  => post('/login',    data),
  logout:        ()      => post('/logout'),
  me:            ()      => get('/me'),
  updateProfil:  (data)  => request('PUT', '/profil', data),
}

// ─── Salles ──────────────────────────────────────────────────────
export const salles = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/salles${qs ? '?' + qs : ''}`)
  },
  show:   (slug)  => get(`/salles/${slug}`),
  villes: ()      => get('/villes'),
}

// ─── Cours & Planning ────────────────────────────────────────────
export const cours = {
  list:     (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/cours${qs ? '?' + qs : ''}`)
  },
  show:     (slug)         => get(`/cours/${slug}`),
  planning: (params = {})  => {
    const qs = new URLSearchParams(params).toString()
    return get(`/planning${qs ? '?' + qs : ''}`)
  },
}

// ─── Abonnements ─────────────────────────────────────────────────
export const abonnements = {
  list:          ()      => get('/abonnements'),
  souscrire:     (data)  => post('/abonnements/souscrire', data),
  monAbonnement: ()      => get('/mon-abonnement'),
}

// ─── Coaches ─────────────────────────────────────────────────────
export const coaches = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return get(`/coaches${qs ? '?' + qs : ''}`)
  },
  show: (id) => get(`/coaches/${id}`),
}

// ─── Contact ─────────────────────────────────────────────────────
export const contact = {
  envoyer: (data) => post('/contact', data),
}

// ─── Demandes d'inscription (formulaire Home) ─────────────────────
export const demandes = {
  envoyer: (data) => post('/demandes', data),
}

// ─── Stripe ──────────────────────────────────────────────────────
export const stripe = {
  createCheckout: (data)       => post('/stripe/checkout', data),
  confirmSession: (session_id) => get(`/stripe/confirm?session_id=${session_id}`),
}

// ─── Réservations ────────────────────────────────────────────────
export const reservations = {
  reserver:        (cours_id) => post('/reservations', { cours_id }),
  annuler:         (coursId)  => del(`/reservations/${coursId}`),
  mesReservations: ()         => get('/mes-reservations'),
}

// ─── Coach ───────────────────────────────────────────────────────
export const coachMe = {
  mesSeances: () => get('/mes-seances'),
}

// ─── Admin ───────────────────────────────────────────────────────
export const admin = {
  stats: () => get('/admin/stats'),

  // Utilisateurs
  users:      (params = {}) => get(`/admin/users?${new URLSearchParams(params)}`),
  updateUser: (id, data)    => request('PUT',    `/admin/users/${id}`, data),
  deleteUser: (id)          => request('DELETE', `/admin/users/${id}`),

  // Coaches
  coaches:      (params = {}) => get(`/admin/coaches?${new URLSearchParams(params)}`),
  createCoach:  (data)        => post('/admin/coaches', data),
  updateCoach:  (id, data)    => request('PUT',    `/admin/coaches/${id}`, data),
  deleteCoach:  (id)          => request('DELETE', `/admin/coaches/${id}`),

  // Cours
  cours:        (params = {}) => get(`/admin/cours?${new URLSearchParams(params)}`),
  createCours:  (data)        => post('/admin/cours', data),
  updateCours:  (id, data)    => request('PUT',    `/admin/cours/${id}`, data),
  deleteCours:  (id)          => request('DELETE', `/admin/cours/${id}`),

  // Salles
  salles:       (params = {}) => get(`/admin/salles?${new URLSearchParams(params)}`),
  createSalle:  (data)        => post('/admin/salles', data),
  updateSalle:  (id, data)    => request('PUT',    `/admin/salles/${id}`, data),
  deleteSalle:  (id)          => request('DELETE', `/admin/salles/${id}`),

  // Abonnements
  abonnements:       (params = {}) => get(`/admin/abonnements?${new URLSearchParams(params)}`),
  createAbonnement:  (data)        => post('/admin/abonnements', data),
  updateAbonnement:  (id, data)    => request('PUT',    `/admin/abonnements/${id}`, data),
  deleteAbonnement:  (id)          => request('DELETE', `/admin/abonnements/${id}`),

  // Inscriptions
  inscriptions: (params = {}) => get(`/admin/inscriptions?${new URLSearchParams(params)}`),

  // Contacts
  contacts:       ()           => get('/admin/contacts'),
  updateContact:  (id, data)   => request('PUT',    `/admin/contacts/${id}`, data),
  deleteContact:  (id)         => request('DELETE', `/admin/contacts/${id}`),

  // Demandes d'inscription
  demandes:       ()           => get('/admin/demandes'),
  updateDemande:  (id, data)   => request('PUT',    `/admin/demandes/${id}`, data),
  deleteDemande:  (id)         => request('DELETE', `/admin/demandes/${id}`),
}

// ─── Helpers token ───────────────────────────────────────────────
export const tokenStorage = {
  set:    (token) => localStorage.setItem('mlh_token', token),
  get:    ()      => getToken(),
  remove: ()      => localStorage.removeItem('mlh_token'),
}
