import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import {
  updateFileNameQuery,
  updateFolderNameQuery,
  updateFilePublicQuery,
  updateFolderPublicQuery,
  updateFileFolderQuery,
  updateFolderFolderQuery
} from '@/lib/supabase/supabaseQueries.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import type { PostgrestError } from '@supabase/supabase-js'
import { downloadFileWithIframe } from '@/lib/utils.ts'

function logError(error: PostgrestError) {
  //TODO send something to user
  console.log(error)
}

export async function deleteFile(id: string) {
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string
  const { accessToken } = useAuthStore();
  const response = await axios.delete(url + '/file', {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
    data: {
      id: id
    }
  });
  await useStorageStore().refreshFiles()
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
  await useStorageStore().refreshFolders();
}

export async function updateFilePublic(id: string, isPublic: boolean){
  const {data, error} = await updateFilePublicQuery(id, isPublic);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFiles();
}

export async function updateFolderPublic(id: string, isPublic: boolean){
  const {data, error} = await updateFolderPublicQuery(id, isPublic);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFolders();
}

export async function updateFileName(id: string, newName: string){
  const {data, error} = await updateFileNameQuery(id, newName);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFiles();
}

export async function updateFolderName(id: string, newName: string){
  const {data, error} = await updateFolderNameQuery(id, newName);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFolders();
}

export async function updateFIleFolder(id: string, newFolderId: string | null){
  const {data, error} = await updateFileFolderQuery(id, newFolderId);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFiles();
}

export async function updateFolderFolder(id: string, newFolderId: string | null){
  const {data, error} = await updateFolderFolderQuery(id, newFolderId);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFolders();
}

export async function downloadSharedFile(id: string){
  const serverUrl = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  const downloadUrl = serverUrl + `/download-shared/${id}`;

  downloadFileWithIframe(downloadUrl);
}

export async function downloadFile(id: string){
  const serverUrl = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  //TODO token manager
  //window.open(downloadUrl, '_blank');
}
