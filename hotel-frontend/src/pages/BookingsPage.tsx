import { useEffect, useState } from 'react'
import { Button, DatePicker, Flex, Form, Modal, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { StopOutlined, PlusOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { Booking, BookingStatus, CreateBookingRequest, Guest, Room } from '../types'
import { apiGet, apiJson } from '../lib/api'

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [rooms, setRooms] = useState<Room[]>([])
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  async function load() {
    setLoading(true)
    try {
      const [b, r, g] = await Promise.all([
        apiGet<Booking[]>('/api/bookings').catch(() => []),
        apiGet<Room[]>('/api/rooms'),
        apiGet<Guest[]>('/api/guests'),
      ])
      setBookings(b)
      setRooms(r)
      setGuests(g)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onCreate(values: any) {
    const payload: CreateBookingRequest = {
      roomId: values.roomId,
      guestId: values.guestId,
      checkInDate: values.dates[0].format('YYYY-MM-DD'),
      checkOutDate: values.dates[1].format('YYYY-MM-DD'),
    }
    await apiJson<Booking>('/api/bookings', 'POST', payload)
    message.success('Booking created')
    setOpen(false)
    form.resetFields()
    load()
  }

  async function onCancel(booking: Booking) {
    await apiJson<Booking>(`/api/bookings/${booking.id}/cancel`, 'POST')
    message.success('Booking cancelled')
    load()
  }

  const columns: ColumnsType<Booking> = [
    { title: 'Room', key: 'room', render: (_, b) => `${b.room.number} (${b.room.type})` },
    { title: 'Guest', key: 'guest', render: (_, b) => `${b.guest.firstName} ${b.guest.lastName}` },
    { title: 'Check-in', dataIndex: 'checkInDate', key: 'checkInDate' },
    { title: 'Check-out', dataIndex: 'checkOutDate', key: 'checkOutDate' },
    { title: 'Total', dataIndex: 'totalPrice', key: 'totalPrice', align: 'right', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Status', dataIndex: 'status', key: 'status', render: (s: BookingStatus) => (
      <Tag color={s === 'ACTIVE' ? 'green' : 'red'}>{s}</Tag>
    ) },
    { title: 'Actions', key: 'actions', render: (_, b) => (
      <Space>
        {b.status === 'ACTIVE' && (
          <Button icon={<StopOutlined />} danger onClick={() => onCancel(b)}>Cancel</Button>
        )}
      </Space>
    ) },
  ]

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <h2 style={{ margin: 0 }}>Bookings</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>New Booking</Button>
      </Flex>

      <Table rowKey="id" loading={loading} columns={columns} dataSource={bookings} pagination={{ pageSize: 8 }} />

      <Modal title="Create booking" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Create">
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item label="Room" name="roomId" rules={[{ required: true }]}>
            <Select
              options={rooms.map(r => ({ label: `${r.number} - ${r.type}`, value: r.id }))}
              showSearch
              optionFilterProp="label"
              placeholder="Select room"
            />
          </Form.Item>
          <Form.Item label="Guest" name="guestId" rules={[{ required: true }]}>
            <Select
              options={guests.map(g => ({ label: `${g.firstName} ${g.lastName} (${g.email})`, value: g.id }))}
              showSearch
              optionFilterProp="label"
              placeholder="Select guest"
            />
          </Form.Item>
          <Form.Item label="Dates" name="dates" rules={[{ required: true, message: 'Select check-in and check-out' }]}>
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              disabledDate={(d) => !!d && d.isBefore(dayjs().startOf('day'))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}