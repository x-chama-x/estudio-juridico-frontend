import { Button, Result } from 'antd'
import { useNavigate } from 'react-router-dom'

function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <Result
      status="404"
      title="404"
      subTitle="La página que buscás no existe."
      extra={<Button type="primary" onClick={() => navigate('/')}>Volver al inicio</Button>}
    />
  )
}

export default NotFoundPage