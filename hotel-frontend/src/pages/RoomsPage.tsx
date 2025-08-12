import { useEffect, useState } from 'react'
import { Room, RoomType } from '../types'
import { apiGet, apiJson } from '../lib/api'

const roomTypes: RoomType[] = ['SINGLE', 'DOUBLE', 'SUITE']

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ number: '', type: 'SINGLE' as RoomType, pricePerNight: 100, description: '' })
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await apiGet<Room[]>('/api/rooms')
      setRooms(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createRoom(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await apiJson<Room>('/api/rooms', 'POST', form)
      setForm({ number: '', type: 'SINGLE', pricePerNight: 100, description: '' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function removeRoom(id: number) {
    try {
      await fetch(`/api/rooms/${id}`, { method: 'DELETE' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Rooms</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <form onSubmit={createRoom} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input required placeholder="Room number" value={form.number} onChange={e => setForm({ ...form, number: e.target.value })} />
        <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as RoomType })}>
          {roomTypes.map(rt => <option key={rt} value={rt}>{rt}</option>)}
        </select>
        <input required type="number" min={1} step={0.01} placeholder="Price per night" value={form.pricePerNight} onChange={e => setForm({ ...form, pricePerNight: Number(e.target.value) })} />
        <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
        <button type="submit">Add Room</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Number</th>
              <th align="left">Type</th>
              <th align="right">Price</th>
              <th align="left">Description</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rooms.map(r => (
              <tr key={r.id}>
                <td>{r.number}</td>
                <td>{r.type}</td>
                <td align="right">${r.pricePerNight.toFixed(2)}</td>
                <td>{r.description}</td>
                <td><button onClick={() => removeRoom(r.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}