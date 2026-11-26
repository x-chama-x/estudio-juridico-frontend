import type { Cliente } from './cliente'

export type Fuero =
  | 'civil'
  | 'comercial'
  | 'laboral'
  | 'penal'
  | 'familia'
  | 'contencioso_administrativo'
  | 'seguridad_social'
export type Etapa = 'extrajudicial' | 'mediacion' | 'judicial'
export type Estado = 'en_tramite' | 'en_espera' | 'archivado'
export type Jurisdiccion = 'nacion' | 'caba' | 'pba'

export type ClienteResumen = Pick<Cliente, '_id' | 'tipo' | 'nombre' | 'apellido' | 'razonSocial' | 'dni' | 'cuit'>

export interface AbogadoResumen {
  _id: string
  nombre: string
  apellido: string
}

export interface DatosJudiciales {
  jurisdiccion?: Jurisdiccion
  numero?: string
  anio?: number
  juzgado?: string
  secretaria?: string
}

export interface Expediente {
  _id: string
  caratula: string
  cliente: ClienteResumen
  abogadoResponsable: AbogadoResumen
  fuero: Fuero
  etapa: Etapa
  estado: Estado
  fechaInicio: string
  datosJudiciales?: DatosJudiciales
  createdAt: string
  updatedAt: string
}