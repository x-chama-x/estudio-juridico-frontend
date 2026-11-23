import { useEffect, useState } from 'react'
import {
  Alert,
  Button,
  Input,
  message,
  Popconfirm,
  Select,
  Space,
  Table,
  Tag,
  Typography,
  type TableColumnsType,
} from 'antd'
import { cambiarEstadoCliente, listarClientes } from '../services/clientesService'
import type { Cliente, TipoCliente } from '../types/cliente'
import { documentoCliente, nombreCliente } from '../utils/clientes'
import { mensajeDeError } from '../utils/errores'
import { useAuth } from '../context/AuthContext'
import ClienteFormModal from '../components/ClienteFormModal'

const LIMITE = 10

function ClientesPage() {
  const { usuario } = useAuth()
  const esAbogado = usuario?.rol === 'abogado'

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [tipo, setTipo] = useState<TipoCliente | undefined>(undefined)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [modalAbierto, setModalAbierto] = useState(false)
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null)
  const [recarga, setRecarga] = useState(0)

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
  }, [busqueda, tipo, pagina, recarga])

  function abrirNuevo() {
    setClienteEditando(null)
    setModalAbierto(true)
  }

  function abrirEdicion(cliente: Cliente) {
    setClienteEditando(cliente)
    setModalAbierto(true)
  }

  function alGuardar() {
    setModalAbierto(false)
    message.success(clienteEditando ? 'Cliente actualizado' : 'Cliente creado')
    setRecarga((r) => r + 1)
  }

  async function darDeBaja(cliente: Cliente) {
    try {
      await cambiarEstadoCliente(cliente._id, false)
      message.success('Cliente dado de baja')
      setRecarga((r) => r + 1)
    } catch (err) {
      message.error(mensajeDeError(err))
    }
  }

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
    {
      title: 'Acciones',
      key: 'acciones',
      render: (_, cliente) => (
        <Space>
          <Button size="small" onClick={() => abrirEdicion(cliente)}>
            Editar
          </Button>
          {esAbogado && (
            <Popconfirm
              title="¿Dar de baja este cliente?"
              description="Dejará de aparecer en el listado."
              okText="Dar de baja"
              cancelText="Cancelar"
              onConfirm={() => darDeBaja(cliente)}
            >
              <Button size="small" danger>
                Dar de baja
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
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
        <Button type="primary" onClick={abrirNuevo}>
          Nuevo cliente
        </Button>
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

      <ClienteFormModal
        abierto={modalAbierto}
        cliente={clienteEditando}
        onCerrar={() => setModalAbierto(false)}
        onGuardado={alGuardar}
      />
    </>
  )
}

export default ClientesPage
