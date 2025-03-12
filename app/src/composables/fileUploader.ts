import { ref } from 'vue'

export function useFileUploader(){
  const isLoading = ref<boolean | null>(null);
  const isLoaded = ref<boolean | null>(null);
  const url = process.env.VITE_STORAGE_ENDPOINT as string + '/upload';
  // TODO add axios on upload progress

  async function simpleUpload(formData: FormData) {
    return await fetch(url, { method: 'POST', body: formData });
  }

  async function streamUpload(formData: FormData) {
    return await fetch(url, { method: 'POST', body: formData });
  }

  async function uploadFile(file: File) {
    let formData = new FormData();
    let response = null;
    formData.append('file', file);

    isLoading.value = true;

    if (file.size <= 5 * 1024 * 1024) response = await simpleUpload(formData);
    else response = await streamUpload(formData);

    if (response.ok){
      isLoaded.value = response.ok;
      isLoading.value = false;
    }

    return response;
  }

  async function processEntry(entry: FileSystemEntry, path = '') {
    if (entry.isFile) {
      return entry as FileSystemFileEntry;
    } else {
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

  async function uploadFiles(data: DataTransferItemList) {
    const entries: FileSystemFileEntry[] = [];

    for (const item of [...data]) {
      const entry = item.webkitGetAsEntry();
      if (!entry) continue;

      let fileEntry = await processEntry(entry);
      if (!Array.isArray(fileEntry)) entries.push(fileEntry);
      else entries.push(...fileEntry);
    }

    const files = await Promise.all(entries.map(file => getFile(file)));
    if (files.length > 0) files.map(async (file) => {
      if (file) await uploadFile(file)
    });
  }

  return {
    isLoaded,
    isLoading,
    uploadFiles
  }
}
