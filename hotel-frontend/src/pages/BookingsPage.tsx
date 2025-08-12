import { useEffect, useState } from 'react'
import { Booking, CreateBookingRequest, Guest, Room } from '../types'
import { apiGet, apiJson } from '../lib/api'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<CreateBookingRequest>({ roomId: 0, guestId: 0, checkInDate: '', checkOutDate: '' })

  async function load() {
    setLoading(true)
    try {
      const [b, r, g] = await Promise.all([
        apiGet<Booking[]>('/api/bookings'),
        apiGet<Room[]>('/api/rooms'),
        apiGet<Guest[]>('/api/guests'),
      ])
      setBookings(b)
      setRooms(r)
      setGuests(g)
      if (r.length && g.length) {
        setForm(f => ({ ...f, roomId: f.roomId || r[0].id, guestId: f.guestId || g[0].id }))
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createBooking(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      if (!form.roomId || !form.guestId) throw new Error('Select room and guest')
      await apiJson<Booking>('/api/bookings', 'POST', form)
      setForm({ roomId: rooms[0]?.id ?? 0, guestId: guests[0]?.id ?? 0, checkInDate: '', checkOutDate: '' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function cancelBooking(id: number) {
    try {
      await apiJson<Booking>(`/api/bookings/${id}/cancel`, 'POST')
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Bookings</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <form onSubmit={createBooking} style={{ display: 'grid', gap: 8, maxWidth: 520, marginBottom: 24 }}>
        <select value={form.roomId} onChange={e => setForm({ ...form, roomId: Number(e.target.value) })}>
          {rooms.map(r => <option key={r.id} value={r.id}>{r.number} - {r.type} (${r.pricePerNight.toFixed(2)})</option>)}
        </select>
        <select value={form.guestId} onChange={e => setForm({ ...form, guestId: Number(e.target.value) })}>
          {guests.map(g => <option key={g.id} value={g.id}>{g.firstName} {g.lastName} ({g.email})</option>)}
        </select>
        <div style={{ display: 'flex', gap: 8 }}>
          <input required type="date" value={form.checkInDate} onChange={e => setForm({ ...form, checkInDate: e.target.value })} />
          <input required type="date" value={form.checkOutDate} onChange={e => setForm({ ...form, checkOutDate: e.target.value })} />
        </div>
        <button type="submit">Create Booking</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Room</th>
              <th align="left">Guest</th>
              <th align="left">Check-in</th>
              <th align="left">Check-out</th>
              <th align="right">Total</th>
              <th align="left">Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(b => (
              <tr key={b.id}>
                <td>{b.room.number}</td>
                <td>{b.guest.firstName} {b.guest.lastName}</td>
                <td>{b.checkInDate}</td>
                <td>{b.checkOutDate}</td>
                <td align="right">${b.totalPrice.toFixed(2)}</td>
                <td>{b.status}</td>
                <td>{b.status === 'ACTIVE' && <button onClick={() => cancelBooking(b.id)}>Cancel</button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}