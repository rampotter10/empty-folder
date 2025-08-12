import { Layout, Menu, theme } from 'antd'
import { HomeOutlined, AppstoreOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import RoomsPage from './pages/RoomsPage'
import GuestsPage from './pages/GuestsPage'
import BookingsPage from './pages/BookingsPage'

const { Header, Content } = Layout

export default function App() {
  const navigate = useNavigate()
  const location = useLocation()
  const items = [
    { key: '/', icon: <HomeOutlined />, label: 'Dashboard' },
    { key: '/rooms', icon: <AppstoreOutlined />, label: 'Rooms' },
    { key: '/guests', icon: <TeamOutlined />, label: 'Guests' },
    { key: '/bookings', icon: <BookOutlined />, label: 'Bookings' },
  ]
  const selectedKeys = items.some(i => i.key === location.pathname) ? [location.pathname] : ['/']
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ color: '#fff', fontWeight: 700, marginRight: 24 }}>Hotel Manager</div>
        <Menu
          theme="dark"
          mode="horizontal"
          selectedKeys={selectedKeys}
          items={items}
          onClick={(e) => navigate(e.key)}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>
      <Content style={{ padding: 24 }}>
        <div style={{ background: colorBgContainer, borderRadius: borderRadiusLG, padding: 24 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rooms" element={<RoomsPage />} />
            <Route path="/guests" element={<GuestsPage />} />
            <Route path="/bookings" element={<BookingsPage />} />
          </Routes>
        </div>
      </Content>
    </Layout>
  )
}
