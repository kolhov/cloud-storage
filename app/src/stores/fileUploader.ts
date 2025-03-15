import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import * as fs from 'node:fs'
import { defineStore } from 'pinia'
import { mimeToIcon } from '@/lib/iconManager.ts'
import mime from 'mime';

export const useFileUploader = defineStore('file-uploader', () => {
  const isLoading = ref<boolean | null>(null);
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string + '/upload';
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
    return await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      }
    });
  }

  async function streamUpload(file: File, accessToken: string, folderId: string | null) {
    return await axios.post(url, {
      file: fs.createReadStream(file.webkitRelativePath),
      folderId: folderId ?? 'null',
      icon: mimeToIcon(file.type)
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      },
      onUploadProgress: function (progressEvent) {
        if (!progressEvent.total) return
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        //TODO loadingFiles.value.progressBar = percent;
      },
    });
  }

  async function uploadFile(file: File, folderId: string | null) {
    const {accessToken} = useAuthStore();
    if (!accessToken) return
    let response = null;
    isLoading.value = true;

    if (file.size <= 5 * 1024 * 1024) response = await simpleUpload(file, accessToken, folderId);
    else response = await streamUpload(file, accessToken, folderId);

    console.log(response);
    return response;
  }

  async function processEntry(entry: FileSystemEntry, path = '') {
    if (entry.isFile) {
      return entry as FileSystemFileEntry;
    } else {
      // TODO add folder
      const reader = (entry as FileSystemDirectoryEntry).createReader();

      const entries: FileSystemEntry[] = await new Promise(resolve =>
        reader.readEntries(resolve));
      const fileEntries: FileSystemFileEntry[] = (await Promise.all(entries.map(nestedEntry =>
        processEntry(nestedEntry, path + entry.name + "/")))).flat();
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
