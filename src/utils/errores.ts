import { isAxiosError } from 'axios'

export function mensajeDeError(err: unknown, porDefecto = 'Ocurrió un error inesperado') {
  if (isAxiosError(err)) {
    if (err.response?.data?.error) {
      return err.response.data.error as string
    }
    if (!err.response) {
      return 'No se pudo conectar con el servidor'
    }
  }
  return porDefecto
}