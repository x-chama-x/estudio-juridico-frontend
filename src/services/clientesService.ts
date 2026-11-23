import api from './api'
import type { Cliente, TipoCliente } from '../types/cliente'
import type { Paginado } from '../types/paginado'

export interface FiltrosClientes {
  q?: string
  tipo?: TipoCliente
  page?: number
  limit?: number
}

export async function listarClientes(filtros: FiltrosClientes) {
  const res = await api.get<Paginado<Cliente>>('/clientes', { params: filtros })
  return res.data
}

export interface DatosCliente {
  tipo: TipoCliente
  nombre?: string
  apellido?: string
  dni?: string
  razonSocial?: string
  cuit?: string
  email?: string
  telefono?: string
  domicilio?: string
}

export async function crearCliente(datos: DatosCliente) {
  const res = await api.post<Cliente>('/clientes', datos)
  return res.data
}

export async function actualizarCliente(id: string, datos: Partial<DatosCliente>) {
  const res = await api.put<Cliente>(`/clientes/${id}`, datos)
  return res.data
}

export async function cambiarEstadoCliente(id: string, activo: boolean) {
  const res = await api.patch<Cliente>(`/clientes/${id}/estado`, { activo })
  return res.data
}