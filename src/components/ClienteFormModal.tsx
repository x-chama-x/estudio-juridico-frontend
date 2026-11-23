import { useEffect, useState } from 'react'
import { Alert, Form, Input, Modal, Radio } from 'antd'
import type { Cliente } from '../types/cliente'
import { actualizarCliente, crearCliente, type DatosCliente } from '../services/clientesService'
import { mensajeDeError } from '../utils/errores'
import { formatearCuit } from '../utils/clientes'

interface Props {
  abierto: boolean
  cliente: Cliente | null
  onCerrar: () => void
  onGuardado: () => void
}

const soloNumeros = (valor: string) => valor.replace(/\D/g, '')

const conGuionesCuit = (valor: string) => {
  const numeros = valor.replace(/\D/g, '').slice(0, 11)
  if (numeros.length <= 2) return numeros
  if (numeros.length <= 10) return `${numeros.slice(0, 2)}-${numeros.slice(2)}`
  return `${numeros.slice(0, 2)}-${numeros.slice(2, 10)}-${numeros.slice(10)}`
}

function ClienteFormModal({ abierto, cliente, onCerrar, onGuardado }: Props) {
  const [form] = Form.useForm<DatosCliente>()
  const tipo = Form.useWatch('tipo', form)
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const editando = cliente !== null

  useEffect(() => {
    if (!abierto) return
    setError(null)
    form.resetFields()
    if (cliente) {
      form.setFieldsValue({ ...cliente, cuit: cliente.cuit ? formatearCuit(cliente.cuit) : undefined })
    } else {
      form.setFieldsValue({ tipo: 'fisica' })
    }
  }, [abierto, cliente, form])

  async function onFinish(valores: DatosCliente) {
    const datos = valores.cuit ? { ...valores, cuit: soloNumeros(valores.cuit) } : valores
    setError(null)
    setGuardando(true)
    try {
      if (cliente) {
        await actualizarCliente(cliente._id, datos)
      } else {
        await crearCliente(datos)
      }
      onGuardado()
    } catch (err) {
      setError(mensajeDeError(err))
    } finally {
      setGuardando(false)
    }
  }

  return (
    <Modal
      title={editando ? 'Editar cliente' : 'Nuevo cliente'}
      open={abierto}
      onCancel={onCerrar}
      onOk={() => form.submit()}
      okText="Guardar"
      cancelText="Cancelar"
      confirmLoading={guardando}
      forceRender
    >
      {error && <Alert type="error" message={error} showIcon style={{ marginBottom: 16 }} />}

      <Form form={form} layout="vertical" onFinish={onFinish} validateTrigger="onBlur">
        <Form.Item label="Tipo" name="tipo" rules={[{ required: true }]}>
          <Radio.Group
            disabled={editando}
            optionType="button"
            options={[
              { value: 'fisica', label: 'Persona física' },
              { value: 'juridica', label: 'Persona jurídica' },
            ]}
          />
        </Form.Item>

        {tipo === 'juridica' ? (
          <>
            <Form.Item
              label="Razón social"
              name="razonSocial"
              rules={[{ required: true, message: 'Ingresá la razón social' }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="CUIT"
              name="cuit"
              normalize={conGuionesCuit}
              rules={[
                { required: true, message: 'Ingresá el CUIT' },
                { pattern: /^\d{2}-\d{8}-\d$/, message: 'El CUIT debe tener 11 números' },
              ]}
            >
              <Input placeholder="Ej: 30-71234567-8" inputMode="numeric" />
            </Form.Item>
          </>
        ) : (
          <>
            <Form.Item label="Nombre" name="nombre" rules={[{ required: true, message: 'Ingresá el nombre' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Apellido" name="apellido" rules={[{ required: true, message: 'Ingresá el apellido' }]}>
              <Input />
            </Form.Item>
            <Form.Item
              label="DNI"
              name="dni"
              normalize={soloNumeros}
              rules={[
                { required: true, message: 'Ingresá el DNI' },
                { pattern: /^\d{7,8}$/, message: 'El DNI debe tener 7 u 8 números' },
              ]}
            >
              <Input placeholder="Solo números, sin puntos" inputMode="numeric" />
            </Form.Item>
          </>
        )}

        <Form.Item label="Email" name="email" rules={[{ type: 'email', message: 'El email no es válido' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Teléfono" name="telefono">
          <Input />
        </Form.Item>
        <Form.Item label="Domicilio" name="domicilio">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default ClienteFormModal