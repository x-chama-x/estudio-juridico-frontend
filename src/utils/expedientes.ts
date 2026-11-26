import type { Estado, Etapa, Expediente, Fuero, Jurisdiccion } from '../types/expediente'

export const NOMBRES_FUERO: Record<Fuero, string> = {
  civil: 'Civil',
  comercial: 'Comercial',
  laboral: 'Laboral',
  penal: 'Penal',
  familia: 'Familia',
  contencioso_administrativo: 'Contencioso administrativo',
  seguridad_social: 'Seguridad social',
}

export const NOMBRES_ETAPA: Record<Etapa, string> = {
  extrajudicial: 'Extrajudicial',
  mediacion: 'Mediación',
  judicial: 'Judicial',
}

export const NOMBRES_ESTADO: Record<Estado, string> = {
  en_tramite: 'En trámite',
  en_espera: 'En espera',
  archivado: 'Archivado',
}

export const COLORES_ESTADO: Record<Estado, string> = {
  en_tramite: 'green',
  en_espera: 'gold',
  archivado: 'default',
}

export const NOMBRES_JURISDICCION: Record<Jurisdiccion, string> = {
  nacion: 'Nación',
  caba: 'CABA',
  pba: 'Provincia de Buenos Aires',
}

export function opciones<T extends string>(nombres: Record<T, string>) {
  return (Object.keys(nombres) as T[]).map((valor) => ({ value: valor, label: nombres[valor] }))
}

export function numeroExpediente(expediente: Expediente) {
  const datos = expediente.datosJudiciales
  return datos?.numero && datos?.anio ? `${datos.numero}/${datos.anio}` : '—'
}

export function formatearFecha(fecha: string) {
  return new Date(fecha).toLocaleDateString('es-AR', { timeZone: 'UTC' })
}