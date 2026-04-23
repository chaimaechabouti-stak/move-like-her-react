import { createContext, useContext, useEffect, useState } from 'react'
import { auth, tokenStorage } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  /* Au chargement : tenter de récupérer le profil si token existant */
  useEffect(() => {
    if (tokenStorage.get()) {
      auth.me()
        .then(setUser)
        .catch(() => tokenStorage.remove())
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const res = await auth.login({ email, password })
    tokenStorage.set(res.token)
    setUser(res.user)
    return res
  }

  const register = async (data) => {
    const res = await auth.register(data)
    tokenStorage.set(res.token)
    setUser(res.user)
    return res
  }

  const logout = async () => {
    await auth.logout().catch(() => {})
    tokenStorage.remove()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth doit être utilisé dans <AuthProvider>')
  return ctx
}
