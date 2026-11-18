import { useEffect, useState } from 'react'
import { Alert, Input, Select, Space, Table, Tag, Typography, type TableColumnsType } from 'antd'
import { listarClientes } from '../services/clientesService'
import type { Cliente, TipoCliente } from '../types/cliente'
import { documentoCliente, nombreCliente } from '../utils/clientes'

const LIMITE = 10

function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState<TipoCliente | undefined>(undefined)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignorar = false
    setCargando(true)
    setError(null)

    listarClientes({ q: busqueda, tipo, page: pagina, limit: LIMITE })
      .then((res) => {
        if (ignorar) return
        setClientes(res.data)
        setTotal(res.total)
      })
      .catch(() => {
        if (!ignorar) setError('No se pudieron cargar los clientes')
      })
      .finally(() => {
        if (!ignorar) setCargando(false)
      })

    return () => {
      ignorar = true
    }
  }, [busqueda, tipo, pagina])

  const columnas: TableColumnsType<Cliente> = [
    {
      title: 'Nombre / Razón social',
      key: 'nombre',
      render: (_, cliente) => nombreCliente(cliente),
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      key: 'tipo',
      render: (valor: TipoCliente) =>
        valor === 'fisica' ? <Tag color="blue">Persona física</Tag> : <Tag color="purple">Persona jurídica</Tag>,
    },
    {
      title: 'DNI / CUIT',
      key: 'documento',
      render: (_, cliente) => documentoCliente(cliente),
    },
    {
      title: 'Teléfono',
      dataIndex: 'telefono',
      key: 'telefono',
      render: (valor?: string) => valor || '—',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (valor?: string) => valor || '—',
    },
  ]

  return (
    <>
      <Typography.Title level={2}>Clientes</Typography.Title>

      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por nombre, razón social, DNI o CUIT"
          allowClear
          onSearch={(valor) => {
            setBusqueda(valor.trim())
            setPagina(1)
          }}
          style={{ width: 340, maxWidth: '100%' }}
        />
        <Select
          placeholder="Todos los tipos"
          allowClear
          value={tipo}
          onChange={(valor) => {
            setTipo(valor)
            setPagina(1)
          }}
          style={{ width: 200 }}
          options={[
            { value: 'fisica', label: 'Persona física' },
            { value: 'juridica', label: 'Persona jurídica' },
          ]}
        />
      </Space>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="_id"
        columns={columnas}
        dataSource={clientes}
        loading={cargando}
        scroll={{ x: 700 }}
        pagination={{
          current: pagina,
          pageSize: LIMITE,
          total,
          onChange: setPagina,
          showSizeChanger: false,
        }}
      />
    </>
  )
}

export default ClientesPage