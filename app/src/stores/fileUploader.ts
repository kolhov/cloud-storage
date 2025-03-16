import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import { defineStore, storeToRefs } from 'pinia'
import { mimeToIcon } from '@/lib/iconManager.ts'
import mime from 'mime';
import { folderQuery, insertFolderQuery } from '@/lib/supabase/supabaseQueries.ts'
import { useErrorStore } from '@/stores/errorStore.ts'
import { ensureFolder } from '@/lib/supabase/ensureFolder.ts'

export const useFileUploader = defineStore('file-uploader', () => {
  const isLoading = ref<boolean | null>(null);
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  // TODO add axios on upload progress
  const loadingFiles = ref<{progressBar: number}>();

  async function simpleUpload(file: File, accessToken: string, folderId: string | null) {
    let fileMime = file.type === ''
      ? mime.getType(file.name)
      : file.type;
    if (!fileMime) fileMime = '';

    let formData = new FormData();
    formData.append('file', file);
    formData.append('folderId', folderId ?? 'null');
    formData.append('icon', mimeToIcon(fileMime));
    formData.append('mime', fileMime);

    //console.log(fileMime);
    return await axios.post(url + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async function uploadFile(file: File, folderId: string | null) {
    const {accessToken} = storeToRefs(useAuthStore());
    if (!accessToken.value) return
    let response = null;
    isLoading.value = true;

    response = await simpleUpload(file, accessToken.value, folderId);

    console.log(response);
    return response;
  }

  async function processEntry(entry: FileSystemEntry, path = '', folderUuid: string | null = null) {
    if (entry.isFile) {
      //TODO вернуть фолдер id
      return entry as FileSystemFileEntry;
    } else {
      console.log('It\'s folder')
      const folder = entry as FileSystemDirectoryEntry;
      let newFolderUuid: string | null = await ensureFolder(folder, folderUuid);

      const reader = folder.createReader();

      const entries: FileSystemEntry[] = await new Promise(resolve =>
        reader.readEntries(resolve));
      const fileEntries: FileSystemFileEntry[] = (await Promise.all(entries.map(nestedEntry =>
        processEntry(nestedEntry, path + entry.name + "/", newFolderUuid)))).flat();
      return fileEntries;
    }
  }

  function getFile(fileEntry: FileSystemFileEntry): Promise<File> | null {
    try {
      return new Promise((resolve, reject) => fileEntry.file(resolve, reject))
    } catch (err) {
      console.log(err)
      return null;
    }
  }

  async function uploadFiles(data: DataTransferItemList, folderId: string | null) {
    const entries: FileSystemFileEntry[] = [];

    for (const item of [...data]) {
      const entry = item.webkitGetAsEntry();
      if (!entry) continue;

      let fileEntry = await processEntry(entry);
      if (!Array.isArray(fileEntry)) entries.push(fileEntry);
      else entries.push(...fileEntry);
    }

    const files = await Promise.all(entries.map(file => getFile(file)));
    if (files.length > 0) {
      await Promise.all(files.map((file) => {
        if (file) uploadFile(file, folderId)
      }))

      isLoading.value = false;
    }
  }

  return {
    isLoading,
    uploadFiles
  }
});
