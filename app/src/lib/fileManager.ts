import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import { updateFilePublicQuery, updateFolderPublicQuery } from '@/lib/supabase/supabaseQueries.ts'
import { useStorageStore } from '@/stores/storageStore.ts'

export async function deleteFile(id: string) {
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string
  const { accessToken } = useAuthStore();
  await axios.delete(url + '/file', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    data: {
      id: id
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

export async function updateFilePublic(id: string, isPublic: boolean){
  const {data, error} = await updateFilePublicQuery(id, isPublic);
  if (error) {
    //TODO send to user something
    console.log(error)
  }
  useStorageStore().refreshFiles();
}

export async function updateFolderPublic(id: string, isPublic: boolean){
  const {data, error} = await updateFolderPublicQuery(id, isPublic);
  if (error) {
    //TODO send to user something
    console.log(error)
  }
  useStorageStore().refreshFolders();
}

