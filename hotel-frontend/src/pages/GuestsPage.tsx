import { useEffect, useState } from 'react'
import { Guest } from '../types'
import { apiGet, apiJson } from '../lib/api'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '' })
  const [error, setError] = useState<string | null>(null)

  async function load() {
    setLoading(true)
    try {
      const data = await apiGet<Guest[]>('/api/guests')
      setGuests(data)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function createGuest(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await apiJson<Guest>('/api/guests', 'POST', form)
      setForm({ firstName: '', lastName: '', email: '', phone: '' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  async function removeGuest(id: number) {
    try {
      await fetch(`/api/guests/${id}`, { method: 'DELETE' })
      await load()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h2>Guests</h2>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}

      <form onSubmit={createGuest} style={{ display: 'grid', gap: 8, maxWidth: 420, marginBottom: 24 }}>
        <input required placeholder="First name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} />
        <input required placeholder="Last name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} />
        <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input required placeholder="Phone" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        <button type="submit">Add Guest</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th align="left">Name</th>
              <th align="left">Email</th>
              <th align="left">Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {guests.map(g => (
              <tr key={g.id}>
                <td>{g.firstName} {g.lastName}</td>
                <td>{g.email}</td>
                <td>{g.phone}</td>
                <td><button onClick={() => removeGuest(g.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}