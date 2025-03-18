import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'

export async function deleteFile(id: string) {
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string
  const { accessToken } = useAuthStore();
  await axios.delete(url + '/file', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    data: {
      source: id
    }
  })
}

export async function deleteFolder(id: string) {
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string
  const { accessToken } = useAuthStore();
  await axios.delete(url + '/folder', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    data: {
      id: id
    }
  })
}
