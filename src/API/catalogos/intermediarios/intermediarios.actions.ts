import type { Intermediario } from './intermediario.interfaces'
import { BaseAPI } from '@/API/BaseAPI'

export function IntermediariosActions () {
  const baseAPI = BaseAPI({ prefix: 'ReasegCatCnsfIntermediarioRest/' })

  const fetchIntermediarios = async (): Promise<Intermediario[]> => {
    try {
      const response = await baseAPI.post<Intermediario[]>('getAllRecords')
      return response.data
    } catch (error) {
      console.error('Error fetching intermediarios:', error)
      throw error
    }
  }

  const createIntermediario = async (
    data: Partial<Intermediario>,
  ): Promise<Intermediario> => {
    try {
      const response = await baseAPI.post<Intermediario>('create', data)
      return response.data
    } catch (error) {
      console.error('Error creating intermediario:', error)
      throw error
    }
  }

  const updateIntermediario = async (
    id: number,
    data: Partial<Intermediario>,
  ): Promise<Intermediario> => {
    try {
      const response = await baseAPI.put<Intermediario>(`update/${id}`, data)
      return response.data
    } catch (error) {
      console.error('Error updating intermediario:', error)
      throw error
    }
  }

  const deleteIntermediario = async (id: number): Promise<void> => {
    try {
      await baseAPI.delete(`delete/${id}`)
    } catch (error) {
      console.error('Error deleting intermediario:', error)
      throw error
    }
  }

  fetch('http://54.82.165.213:9080/ws_catalogos_reaseguro/api/v1/ReasegCatCnsfIntermediarioRest/getAllRecords', {
    method: 'post',
    headers: {
      'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1c2VybmFtZSIsImlhdCI6MTc2NDI1NjA0OCwiZXhwIjoxNzY0MjU3ODQ4fQ.yMCQospI8ZbqATSAZ1A469kxZ-W6QZT6CJvVa_Ctwoo`,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  }).then(resp => resp.json()).then(console.log).catch(console.log)

  return {
    fetchIntermediarios,
    createIntermediario,
    updateIntermediario,
    deleteIntermediario,
  }
}
