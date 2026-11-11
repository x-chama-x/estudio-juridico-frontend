import { Button, Layout, Menu, Space } from 'antd'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const { Header, Sider, Content } = Layout

const items = [
  { key: '/', label: 'Inicio' },
  { key: '/clientes', label: 'Clientes' },
  { key: '/expedientes', label: 'Expedientes' },
]

function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { usuario, logout } = useAuth()

  function cerrarSesion() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider breakpoint="lg" collapsedWidth="0">
        <div style={{ color: 'white', padding: 16, fontWeight: 'bold' }}>Estudio Jurídico</div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={items}
          onClick={({ key }) => navigate(key)}
        />
      </Sider>
      <Layout>
        <Header
            style={{
              background: '#fff',
              paddingInline: 24,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Sistema de gestión</span>
            <Space>
              <span>
                {usuario?.nombre} {usuario?.apellido} ({usuario?.rol})
              </span>
              <Button onClick={cerrarSesion}>Cerrar sesión</Button>
            </Space>
        </Header>
        <Content style={{ margin: 24 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout