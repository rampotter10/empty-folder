import { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, InputNumber, Modal, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Room, RoomType } from '../types'
import { apiGet, apiJson } from '../lib/api'

const roomTypeOptions = [
  { value: 'SINGLE', label: 'Single' },
  { value: 'DOUBLE', label: 'Double' },
  { value: 'SUITE', label: 'Suite' },
] as const

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  async function load() {
    setLoading(true)
    try {
      const data = await apiGet<Room[]>('/api/rooms')
      setRooms(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onCreate(values: any) {
    await apiJson<Room>('/api/rooms', 'POST', values)
    message.success('Room created')
    setOpen(false)
    form.resetFields()
    load()
  }

  async function onDelete(room: Room) {
    Modal.confirm({
      title: `Delete room ${room.number}?`,
      content: 'This action cannot be undone.',
      okType: 'danger',
      onOk: async () => {
        await fetch(`/api/rooms/${room.id}`, { method: 'DELETE' })
        message.success('Room deleted')
        load()
      },
    })
  }

  const columns: ColumnsType<Room> = [
    { title: 'Number', dataIndex: 'number', key: 'number' },
    { title: 'Type', dataIndex: 'type', key: 'type', render: (t: RoomType) => <Tag color={t === 'SINGLE' ? 'blue' : t === 'DOUBLE' ? 'green' : 'gold'}>{t}</Tag> },
    { title: 'Price / night', dataIndex: 'pricePerNight', key: 'pricePerNight', align: 'right', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Description', dataIndex: 'description', key: 'description' },
    { title: 'Actions', key: 'actions', render: (_, r) => (
      <Space>
        <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(r)}>Delete</Button>
      </Space>
    ) },
  ]

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <h2 style={{ margin: 0 }}>Rooms</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>New Room</Button>
      </Flex>

      <Table rowKey="id" loading={loading} columns={columns} dataSource={rooms} pagination={{ pageSize: 8 }} />

      <Modal title="Create room" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Create">
        <Form form={form} layout="vertical" onFinish={onCreate} initialValues={{ type: 'SINGLE', pricePerNight: 100 }}>
          <Form.Item label="Number" name="number" rules={[{ required: true, message: 'Room number is required' }]}>
            <Input placeholder="e.g. 101" />
          </Form.Item>
          <Form.Item label="Type" name="type" rules={[{ required: true }]}>
            <Select options={roomTypeOptions as any} />
          </Form.Item>
          <Form.Item label="Price per night" name="pricePerNight" rules={[{ required: true }]}>
            <InputNumber min={1} step={0.01} prefix="$" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="Description" name="description">
            <Input placeholder="Optional" />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}