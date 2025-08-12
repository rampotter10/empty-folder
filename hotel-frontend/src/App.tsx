import { Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RoomsPage from './pages/RoomsPage'
import GuestsPage from './pages/GuestsPage'
import BookingsPage from './pages/BookingsPage'

export default function App() {
  return (
    <div style={{ fontFamily: 'Inter, system-ui, Avenir, Helvetica, Arial, sans-serif' }}>
      <header style={{ display: 'flex', gap: 16, padding: 16, borderBottom: '1px solid #e5e7eb' }}>
        <strong style={{ marginRight: 24 }}>Hotel Manager</strong>
        <NavLink to="/" end style={({ isActive }) => ({ color: isActive ? '#111' : '#555' })}>Dashboard</NavLink>
        <NavLink to="/rooms" style={({ isActive }) => ({ color: isActive ? '#111' : '#555' })}>Rooms</NavLink>
        <NavLink to="/guests" style={({ isActive }) => ({ color: isActive ? '#111' : '#555' })}>Guests</NavLink>
        <NavLink to="/bookings" style={({ isActive }) => ({ color: isActive ? '#111' : '#555' })}>Bookings</NavLink>
      </header>
      <main style={{ padding: 16 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/guests" element={<GuestsPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
        </Routes>
      </main>
    </div>
  )
}
