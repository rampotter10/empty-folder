import { Card, Col, Row, Statistic } from 'antd'
import { useEffect, useState } from 'react'
import { apiGet } from '../lib/api'
import { Room, Guest, Booking } from '../types'

export default function Dashboard() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])

  useEffect(() => {
    Promise.all([
      apiGet<Room[]>('/api/rooms'),
      apiGet<Guest[]>('/api/guests'),
      apiGet<Booking[]>('/api/bookings').catch(() => []),
    ]).then(([r, g, b]) => {
      setRooms(r)
      setGuests(g)
      setBookings(b)
    })
  }, [])

  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Rooms" value={rooms.length} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Guests" value={guests.length} />
        </Card>
      </Col>
      <Col xs={24} md={8}>
        <Card>
          <Statistic title="Bookings" value={bookings.length} />
        </Card>
      </Col>
    </Row>
  )
}