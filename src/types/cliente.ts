export type TipoCliente = 'fisica' | 'juridica'

export interface Cliente {
  _id: string
  tipo: TipoCliente
  nombre?: string
  apellido?: string
  dni?: string
  razonSocial?: string
  cuit?: string
  email?: string
  telefono?: string
  domicilio?: string
  activo: boolean
  createdAt: string
  updatedAt: string
}

