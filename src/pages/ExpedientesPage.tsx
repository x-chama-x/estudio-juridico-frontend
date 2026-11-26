import { useEffect, useState } from 'react'
import { Alert, Input, Select, Space, Table, Tag, Typography, type TableColumnsType } from 'antd'
import { listarExpedientes } from '../services/expedientesService'
import type { Estado, Etapa, Expediente, Fuero } from '../types/expediente'
import { nombreCliente } from '../utils/clientes'
import {
  COLORES_ESTADO,
  formatearFecha,
  NOMBRES_ESTADO,
  NOMBRES_ETAPA,
  NOMBRES_FUERO,
  numeroExpediente,
  opciones,
} from '../utils/expedientes'
import { useAuth } from '../context/AuthContext'

const LIMITE = 10

function ExpedientesPage() {
  const { usuario } = useAuth()

  const [expedientes, setExpedientes] = useState<Expediente[]>([])
  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState<Estado | undefined>(undefined)
  const [fuero, setFuero] = useState<Fuero | undefined>(undefined)
  const [etapa, setEtapa] = useState<Etapa | undefined>(undefined)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ignorar = false
    setCargando(true)
    setError(null)

    listarExpedientes({ q: busqueda, estado, fuero, etapa, page: pagina, limit: LIMITE })
      .then((res) => {
        if (ignorar) return
        setExpedientes(res.data)
        setTotal(res.total)
      })
      .catch(() => {
        if (!ignorar) setError('No se pudieron cargar los expedientes')
      })
      .finally(() => {
        if (!ignorar) setCargando(false)
      })

    return () => {
      ignorar = true
    }
  }, [busqueda, estado, fuero, etapa, pagina])

  const columnas: TableColumnsType<Expediente> = [
    {
      title: 'Carátula',
      dataIndex: 'caratula',
      key: 'caratula',
      width: 320,
    },
    {
      title: 'Cliente',
      key: 'cliente',
      render: (_, expediente) => nombreCliente(expediente.cliente),
    },
    {
      title: 'Fuero',
      dataIndex: 'fuero',
      key: 'fuero',
      render: (valor: Fuero) => NOMBRES_FUERO[valor],
    },
    {
      title: 'Etapa',
      dataIndex: 'etapa',
      key: 'etapa',
      render: (valor: Etapa) => <Tag>{NOMBRES_ETAPA[valor]}</Tag>,
    },
    {
      title: 'N° expediente',
      key: 'numero',
      render: (_, expediente) => numeroExpediente(expediente),
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (valor: Estado) => <Tag color={COLORES_ESTADO[valor]}>{NOMBRES_ESTADO[valor]}</Tag>,
    },
    {
      title: 'Responsable',
      key: 'responsable',
      render: (_, expediente) => `${expediente.abogadoResponsable.apellido}, ${expediente.abogadoResponsable.nombre}`,
    },
    {
      title: 'Inicio',
      dataIndex: 'fechaInicio',
      key: 'fechaInicio',
      render: (valor: string) => formatearFecha(valor),
    },
  ]

  return (
    <>
      <Typography.Title level={2}>Expedientes</Typography.Title>
      <Typography.Paragraph type="secondary">
        {usuario?.rol === 'abogado'
          ? 'Expedientes en los que sos el abogado responsable.'
          : 'Todos los expedientes del estudio.'}
      </Typography.Paragraph>

      <Space wrap style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Buscar por carátula"
          allowClear
          onSearch={(valor) => {
            setBusqueda(valor.trim())
            setPagina(1)
          }}
          style={{ width: 280, maxWidth: '100%' }}
        />
        <Select
          placeholder="Estado"
          allowClear
          value={estado}
          onChange={(valor) => {
            setEstado(valor)
            setPagina(1)
          }}
          style={{ width: 150 }}
          options={opciones(NOMBRES_ESTADO)}
        />
        <Select
          placeholder="Fuero"
          allowClear
          value={fuero}
          onChange={(valor) => {
            setFuero(valor)
            setPagina(1)
          }}
          style={{ width: 220 }}
          options={opciones(NOMBRES_FUERO)}
        />
        <Select
          placeholder="Etapa"
          allowClear
          value={etapa}
          onChange={(valor) => {
            setEtapa(valor)
            setPagina(1)
          }}
          style={{ width: 150 }}
          options={opciones(NOMBRES_ETAPA)}
        />
      </Space>

      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Table
        rowKey="_id"
        columns={columnas}
        dataSource={expedientes}
        loading={cargando}
        scroll={{ x: 1100 }}
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

export default ExpedientesPage