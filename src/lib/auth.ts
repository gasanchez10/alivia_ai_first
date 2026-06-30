const AUTH_KEY = 'alivia.mock.auth'
const USERS_KEY = 'alivia.mock.users'

export interface User {
  id: string
  email: string
  name: string
  specialty?: string
  year?: string
}

interface StoredUser {
  password: string
  profile: User
}

function loadUsers(): Record<string, StoredUser> {
  try {
    const raw = localStorage.getItem(USERS_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch {
    return {}
  }
}

function saveUsers(users: Record<string, StoredUser>) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function getSession(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function setSession(user: User | null) {
  if (user) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(AUTH_KEY)
  }
}

export async function mockLogin(email: string, password: string): Promise<User> {
  await delay(400)
  const users = loadUsers()
  const entry = users[email.toLowerCase()]
  if (!entry || entry.password !== password) {
    throw new Error('Credenciales inválidas')
  }
  setSession(entry.profile)
  return entry.profile
}

export async function mockRegister(data: {
  email: string
  password: string
  name: string
  specialty?: string
  year?: string
}): Promise<User> {
  await delay(500)
  const email = data.email.toLowerCase()
  const users = loadUsers()
  if (users[email]) {
    throw new Error('Este correo ya está registrado')
  }
  const profile: User = {
    id: crypto.randomUUID(),
    email,
    name: data.name,
    specialty: data.specialty,
    year: data.year,
  }
  users[email] = { password: data.password, profile }
  saveUsers(users)
  setSession(profile)
  return profile
}

export function mockLogout() {
  setSession(null)
}

function delay(ms: number) {
  return new Promise((r) => setTimeout(r, ms))
}
