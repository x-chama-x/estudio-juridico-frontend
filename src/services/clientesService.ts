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