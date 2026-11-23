import { useState } from 'react'
import { Alert, Button, Card, Form, Input, Typography } from 'antd'
import { Navigate, useLocation, useNavigate, type Location } from 'react-router-dom'
import { isAxiosError } from 'axios'
import { useAuth } from '../context/AuthContext'

interface LoginForm {
  email: string
  password: string
}

function LoginPage() {
  const { usuario, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [error, setError] = useState<string | null>(null)
  const [enviando, setEnviando] = useState(false)

  const destino = (location.state as { from?: Location } | null)?.from?.pathname ?? '/'

  if (usuario) {
    return <Navigate to={destino} replace />
  }

  async function onFinish(values: LoginForm) {
    setError(null)
    setEnviando(true)
    try {
      await login(values.email, values.password)
      navigate(destino, { replace: true })
    } catch (err) {
      if (isAxiosError(err) && err.response?.data?.error) {
        setError(err.response.data.error)
      } else {
        setError('No se pudo conectar con el servidor')
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: '#f5f5f5',
      }}
    >
      <Card style={{ width: '100%', maxWidth: 380 }}>
        <Typography.Title level={3} style={{ textAlign: 'center' }}>
          Estudio Jurídico
        </Typography.Title>

        {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

        <Form layout="vertical" onFinish={onFinish} requiredMark={false} validateTrigger="onSubmit">
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Ingresá tu email' },
              { type: 'email', message: 'El email no es válido' },
            ]}
          >
            <Input autoComplete="username" />
          </Form.Item>

          <Form.Item label="Contraseña" name="password" rules={[{ required: true, message: 'Ingresá tu contraseña' }]}>
            <Input.Password autoComplete="current-password" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block loading={enviando}>
            Ingresar
          </Button>
        </Form>
      </Card>
    </div>
  )
}

export default LoginPage