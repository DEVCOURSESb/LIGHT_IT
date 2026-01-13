import type { Moneda } from './moneda.interfaces'
import { BaseAPI } from '@/API/BaseAPI'

export function MonedaActions () {
  const baseAPI = BaseAPI({ prefix: 'ws_catalogos_reaseguro/api/v1/ReasegCatCnsfRr6MonedaRest/' })

  const fetchMonedas = async (): Promise<Moneda[]> => {
    try {
      const response = await baseAPI.post<Moneda[]>('getAllRecords')
      return response.data
    } catch (error) {
      console.error('Error fetching Monedas:', error)
      throw error
    }
  }

  const createMoneda = async (data: Partial<Moneda>): Promise<Moneda[]> => {
    try {
      const response = await baseAPI.post<Moneda[]>('insertRecord', data)
      return response.data
    } catch (error) {
      console.error('Error creating Moneda:', error)
      throw error
    }
  }

  const updateMoneda = async (data: Partial<Moneda>): Promise<Moneda[]> => {
    try {
      const response = await baseAPI.put<Moneda[]>("updateRecord", data)
      return response.data
    } catch (error) {
      console.error('Error updating Moneda:', error)
      throw error
    }
  }

  const deleteMoneda = async (id: number): Promise<Moneda[]> => {
    try {
      const data = await baseAPI.delete<Moneda[]>(`deleteRecord/${id}`)
      return data.data
    } catch (error) {
      console.error('Error deleting Moneda:', error)
      throw error
    }
  }

  return {
    fetchMonedas,
    createMoneda,
    updateMoneda,
    deleteMoneda,
  }
}
