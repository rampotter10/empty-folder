import { Link } from 'react-router-dom'

export default function Dashboard() {
  return (
    <div>
      <h2>Welcome</h2>
      <p>Use the sections below to manage rooms, guests, and bookings.</p>
      <ul>
        <li><Link to="/rooms">Manage Rooms</Link></li>
        <li><Link to="/guests">Manage Guests</Link></li>
        <li><Link to="/bookings">Manage Bookings</Link></li>
      </ul>
    </div>
  )
}