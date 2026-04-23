import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Concept from './pages/Concept'
import CoursCollectifs from './pages/CoursCollectifs'
import Salles from './pages/Salles'
import Coaching from './pages/Coaching'
import Abonnements from './pages/Abonnements'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import DashboardCoach from './pages/DashboardCoach'
import Profil from './pages/Profil'
import Stats from './pages/Stats'
import PaiementSucces from './pages/PaiementSucces'
import NotFound from './pages/NotFound'

// Admin
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminAbonnements from './admin/AdminAbonnements'
import AdminCoaches from './admin/AdminCoaches'
import AdminSalles from './admin/AdminSalles'
import AdminCours from './admin/AdminCours'
import AdminUtilisateurs from './admin/AdminUtilisateurs'
import AdminInscriptions from './admin/AdminInscriptions'

import ScrollToTop, { ScrollReset } from './components/ScrollToTop'
import useReveal from './hooks/useReveal'
import './index.css'

/* Pages sans Navbar ni Footer */
const AUTH_PAGES  = ['/login', '/register']
const ADMIN_PAGES = ['/admin']

function RequireAdmin({ children }) {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user)           return <Navigate to="/login" replace />
  if (user.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function DashboardRouter() {
  const { user, loading } = useAuth()
  if (loading) return null
  if (!user) return <Navigate to="/login" replace />
  if (user.role === 'admin') return <Navigate to="/admin" replace />
  if (user.role === 'coach') return <DashboardCoach />
  return <Dashboard />
}

function AppRoutes() {
  const { pathname } = useLocation()
  const isAuth  = AUTH_PAGES.includes(pathname)
  const isAdmin = pathname.startsWith('/admin')
  useReveal()

  return (
    <>
      <ScrollReset />
      {!isAuth && !isAdmin && <Navbar />}
      <Routes>
        {/* Public */}
        <Route path="/"                 element={<Home />} />
        <Route path="/concept"          element={<Concept />} />
        <Route path="/cours-collectifs" element={<CoursCollectifs />} />
        <Route path="/salles"           element={<Salles />} />
        <Route path="/coaching"         element={<Coaching />} />
        <Route path="/abonnements"      element={<Abonnements />} />
        <Route path="/contact"          element={<Contact />} />
        <Route path="/login"            element={<Login />} />
        <Route path="/register"         element={<Register />} />
        <Route path="/dashboard"        element={<DashboardRouter />} />
        <Route path="/profil"           element={<Profil />} />
        <Route path="/stats"            element={<Stats />} />

        {/* Admin — layout imbriqué */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index           element={<AdminDashboard />} />
          <Route path="abonnements"   element={<AdminAbonnements />} />
          <Route path="coaches"       element={<AdminCoaches />} />
          <Route path="salles"        element={<AdminSalles />} />
          <Route path="cours"         element={<AdminCours />} />
          <Route path="utilisateurs"  element={<AdminUtilisateurs />} />
          <Route path="inscriptions"  element={<AdminInscriptions />} />
        </Route>

        <Route path="/paiement/succes" element={<PaiementSucces />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAuth && !isAdmin && <Footer />}
      {!isAuth && !isAdmin && <ScrollToTop />}
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  )
}
