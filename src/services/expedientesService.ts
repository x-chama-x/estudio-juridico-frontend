import api from './api'
import type { Estado, Etapa, Expediente, Fuero } from '../types/expediente'
import type { Paginado } from '../types/paginado'

export interface FiltrosExpedientes {
  q?: string
  estado?: Estado
  fuero?: Fuero
  etapa?: Etapa
  cliente?: string
  page?: number
  limit?: number
}

export async function listarExpedientes(filtros: FiltrosExpedientes) {
  const res = await api.get<Paginado<Expediente>>('/expedientes', { params: filtros })
  return res.data
}