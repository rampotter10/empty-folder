import { useEffect, useState } from 'react'
import { Button, Flex, Form, Input, Modal, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Guest } from '../types'
import { apiGet, apiJson } from '../lib/api'

export default function GuestsPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [form] = Form.useForm()

  async function load() {
    setLoading(true)
    try {
      const data = await apiGet<Guest[]>('/api/guests')
      setGuests(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function onCreate(values: any) {
    await apiJson<Guest>('/api/guests', 'POST', values)
    message.success('Guest added')
    setOpen(false)
    form.resetFields()
    load()
  }

  async function onDelete(guest: Guest) {
    Modal.confirm({
      title: `Delete ${guest.firstName} ${guest.lastName}?`,
      okType: 'danger',
      onOk: async () => {
        await fetch(`/api/guests/${guest.id}`, { method: 'DELETE' })
        message.success('Guest deleted')
        load()
      },
    })
  }

  const columns: ColumnsType<Guest> = [
    { title: 'Name', key: 'name', render: (_, g) => `${g.firstName} ${g.lastName}` },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Phone', dataIndex: 'phone', key: 'phone' },
    { title: 'Actions', key: 'actions', render: (_, g) => (
      <Space>
        <Button icon={<DeleteOutlined />} danger onClick={() => onDelete(g)}>Delete</Button>
      </Space>
    ) },
  ]

  return (
    <Flex vertical gap={16}>
      <Flex justify="space-between" align="center">
        <h2 style={{ margin: 0 }}>Guests</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>New Guest</Button>
      </Flex>

      <Table rowKey="id" loading={loading} columns={columns} dataSource={guests} pagination={{ pageSize: 8 }} />

      <Modal title="Add guest" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()} okText="Add">
        <Form form={form} layout="vertical" onFinish={onCreate}>
          <Form.Item label="First name" name="firstName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last name" name="lastName" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Email" name="email" rules={[{ required: true, type: 'email' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Phone" name="phone" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Flex>
  )
}