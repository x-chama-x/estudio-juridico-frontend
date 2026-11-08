import { useEffect, useState } from 'react'
import { Typography, Tag } from 'antd'
import api from '../services/api'

function DashboardPage() {
  const [conectado, setConectado] = useState<boolean | null>(null)

  useEffect(() => {
    api
      .get('/salud')
      .then(() => setConectado(true))
      .catch(() => setConectado(false))
  }, [])

  return (
    <>
      <Typography.Title level={2}>Inicio</Typography.Title>
      {conectado === null && <Tag>Consultando backend...</Tag>}
      {conectado === true && <Tag color="green">Backend conectado</Tag>}
      {conectado === false && <Tag color="red">Backend sin conexión</Tag>}
    </>
  )
}

export default DashboardPage