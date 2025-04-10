import { ref } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore.ts'
import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { mimeToIcon } from '@/lib/iconManager.ts'
import mime from 'mime';
import { ensureFolder } from '@/lib/supabase/ensureFolder.ts'
import { useStorageStore } from '@/stores/storageStore.ts'
import type { FileSystemEntryWithId, FileWithFolderId } from '@/types/expanded.file.system.types.ts'
import type { UploadProgress } from '@/types/upload.progress.ts'
import { bytesToString, secondsToString } from '@/lib/utils.ts'

export const useFileUploader = defineStore('file-uploader', () => {
  const isLoading = ref<boolean | null>(null);
  const url = import.meta.env.VITE_STORAGE_ENDPOINT as string;
  const loadingFiles = ref<Record<string, UploadProgress>>({});

  function addToLoadingFiles(file: File, mime: string){
    const id = crypto.randomUUID();
    loadingFiles.value[id] = {
      name: file.name,
      icon: mimeToIcon(mime),
      progressBar: 0,
      complete: false
    } as UploadProgress;

    return id;
  }

  function delFromLoadingFiles(id: string){
    let msTillDeletion = 3 * 1000;
    loadingFiles.value[id].complete = true;

    setTimeout(() => {
      delete loadingFiles.value[id];
    }, msTillDeletion);
  }

  async function simpleUpload(file: File, accessToken: string, folderId: string | null) {
    let fileMime = file.type === ''
      ? mime.getType(file.name)
      : file.type;
    if (!fileMime) fileMime = '';

    let trackerIndex = addToLoadingFiles(file, fileMime);

    let formData = new FormData();
    formData.append('file', file, encodeURIComponent(file.name));
    formData.append('folderId', folderId ?? 'null');
    formData.append('icon', mimeToIcon(fileMime));
    formData.append('mime', fileMime);

    const response = await axios.post(url + '/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${accessToken}`
      },
      onUploadProgress: (progressEvent) => {
        const file = loadingFiles.value[trackerIndex];
        file.total = progressEvent.total ? bytesToString(progressEvent.total) : undefined;
        file.progressBar = (progressEvent.progress ?? 0.02) * 100;
        file.loaded = bytesToString(progressEvent.loaded);
        file.rate = bytesToString(progressEvent.rate);
        file.duration = secondsToString(progressEvent.estimated);
      }
    });

    delFromLoadingFiles(trackerIndex);
    return response;
  }

  async function uploadFile(file: File, folderId: string | null) {
    const {accessToken} = storeToRefs(useAuthStore());
    if (!accessToken.value) return
    let response = null;
    isLoading.value = true;

    response = await simpleUpload(file, accessToken.value, folderId);

    return response;
  }

  async function processEntry(entry: FileSystemEntry, folderUuid: string | null, path = '') {
    if (entry.isFile) {
      //TODO вернуть фолдер id
      return { entry: entry as FileSystemFileEntry, folderId: folderUuid };
    } else {
      const folder = entry as FileSystemDirectoryEntry;
      let newFolderUuid: string | null = await ensureFolder(folder, folderUuid);

      const reader = folder.createReader();

      const entries: FileSystemEntry[] = await new Promise(resolve =>
        reader.readEntries(resolve));
      const fileEntries: FileSystemEntryWithId[] = (await Promise.all(entries.map(nestedEntry =>
        processEntry(nestedEntry, newFolderUuid, path + entry.name + "/")))).flat();
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

  async function dataTransferToFilesWithFolderId(data: DataTransferItemList, folderId: string | null) {
    const entries: FileSystemEntryWithId[] = []

    for (const item of [...data]) {
      const entry = item.webkitGetAsEntry()
      if (!entry) continue

      let fileEntry = await processEntry(entry, folderId)
      if (!Array.isArray(fileEntry)) entries.push(fileEntry)
      else entries.push(...fileEntry)
    }

    const files: FileWithFolderId[] = await Promise.all(entries.map(async (entry) => {
      return {
        file: await getFile(entry.entry),
        folderId: entry.folderId
      } as FileWithFolderId
    }))
    return files
  }

  async function uploadFiles(data: DataTransferItemList | FileWithFolderId[], folderId: string | null) {
    let files: FileWithFolderId[];

    if (data instanceof DataTransferItemList)
    files = await dataTransferToFilesWithFolderId(data, folderId)
    else files = data;

    if (files.length > 0) {
      await Promise.all(files.map((file) => {
        if (file.file) return uploadFile(file.file, file.folderId);
        return Promise.resolve();
      }))

      isLoading.value = false;
      await useStorageStore().refreshFiles();
    }
  }

  return {
    isLoading,
    loadingFiles,
    uploadFiles
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useFileUploader, import.meta.hot))
}
