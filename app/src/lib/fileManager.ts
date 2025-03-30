import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import {
  updateFileNameQuery,
  updateFolderNameQuery,
  updateFilePublicQuery,
  updateFolderPublicQuery,
  updateFileFolderQuery,
  updateFolderFolderQuery, insertFolderQuery, getAllFoldersQuery, getAllFilesQuery
} from '@/lib/supabase/supabaseQueries.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import { downloadFileWithIframe } from '@/lib/utils.ts'
import { useToast, ToastAction } from '@/components/ui/toast'
import { h } from 'vue'
import type { AllFiles, AllFolders } from '@/lib/supabase/supabaseQueryTypes.ts'

function logError(error: any) {
  //TODO send to db logs
  console.log(error)
  useToast().toast({
    title: 'Error',
    description: 'Something went wrong. Try again.',
    variant: 'destructive'
  });
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

  useToast().toast({
    description: isPublic ? 'Anyone with the link can view this file'
      : 'The file now is available only to you',
    action: h(ToastAction, {
      altText: 'Revert',
      onClick: () => updateFilePublic(id, !isPublic)
    }, {
      default: () => 'Revert',
    }),
  });
}

export async function updateFolderPublic(id: string, isPublic: boolean){
  const {data, error} = await updateFolderPublicQuery(id, isPublic);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFolders();

  useToast().toast({
    description: isPublic ? 'Anyone with the link can view this folder'
      : 'The folder now is available only to you',
    action: h(ToastAction, {
      altText: 'Revert',
      onClick: () => updateFilePublic(id, !isPublic)
    }, {
      default: () => 'Revert',
    }),
  });
}

export async function updateFileName(id: string, newName: string){
  const {data, error} = await updateFileNameQuery(id, newName);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFiles();

  useToast().toast({
    description: `File renamed to: ${data?.name ?? 'Home'}`,
  });
}

export async function updateFolderName(id: string, newName: string){
  const {data, error} = await updateFolderNameQuery(id, newName);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFolders();

  useToast().toast({
    description: `Folder renamed to: ${data?.name ?? 'Home'}`,
  });
}

export async function updateFIleFolder(id: string, newFolderId: string | null){
  const {data, error} = await updateFileFolderQuery(id, newFolderId);
  if (error) {
    logError(error);
  }
  await useStorageStore().refreshFiles();

  useToast().toast({
    description: `File moved to: ${data?.folder?.name ?? 'Home'}`,
  });
}

export async function updateFolderFolder(id: string, newFolderId: string | null){
  const {data, error} = await updateFolderFolderQuery(id, newFolderId);
  if (error) {
    logError(error);
    return;
  }
  await useStorageStore().refreshFolders();

  useToast().toast({
    description: `Folder moved to: ${data.folder?.name ?? 'Home'}`,
  });
}

export async function downloadSharedFile(id: string){
  const serverUrl = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  const downloadUrl = serverUrl + `/download/shared/${id}`;
  useToast().toast({
    description: 'Preparing the file.',
  });

  downloadFileWithIframe(downloadUrl);
}

export async function downloadFile(id: string){
  const serverUrl = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  const { accessToken, user } = useAuthStore();
  useToast().toast({
    description: 'Preparing the file.',
  });

  const response = await axios.get(serverUrl + `/download-token/file/${id}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  const token = response.data.token.id ?? null;
  if (!token){
    logError({error: `No token returned for \nfile: ${id} \nowner: ${user?.id}`});
    return;
  }

  downloadFileWithIframe(serverUrl + `/download/${token}`);
}

export async function createFolder(name: string){
  const { user } = useAuthStore();
  if (!user) {
    logError('Not logged in');
    return;
  }
  const { data, error} = await insertFolderQuery({ name, owner: user.id })
  if (error) {
    logError(error);
    return;
  }
  await useStorageStore().refreshFolders();

  useToast().toast({
    description: `Folder created: ${data?.name}`,
  });
}

export async function getAllFolders(): Promise<AllFolders | null>{
  const { user } = useAuthStore();
  if (!user) {
    logError('Not logged in');
    return null;
  }

  const { data, error} = await getAllFoldersQuery(user.id);
  if (error) {
    logError(error);
    return null;
  }
  return data;
}

export async function getAllFiles(): Promise<AllFiles | null>{
  const { user } = useAuthStore();
  if (!user) {
    logError('Not logged in');
    return null;
  }

  const { data, error} = await getAllFilesQuery(user.id);
  if (error) {
    logError(error);
    return null;
  }
  return data;
}
