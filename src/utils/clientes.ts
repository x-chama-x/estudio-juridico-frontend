import type { Cliente } from '../types/cliente'

export function nombreCliente(cliente: Cliente) {
  if (cliente.tipo === 'fisica') {
    return `${cliente.apellido}, ${cliente.nombre}`
  }
  return cliente.razonSocial ?? ''
}

export function formatearCuit(cuit: string) {
  return `${cuit.slice(0, 2)}-${cuit.slice(2, 10)}-${cuit.slice(10)}`
}

export function documentoCliente(cliente: Cliente) {
  if (cliente.tipo === 'fisica') {
    return `DNI ${cliente.dni}`
  }
  return `CUIT ${formatearCuit(cliente.cuit ?? '')}`
}