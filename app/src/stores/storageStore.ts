import { acceptHMRUpdate, defineStore, storeToRefs } from 'pinia'
import { ref } from 'vue'
import { filesQuery, foldersQuery, getAllFoldersQuery } from '@/lib/supabase/supabaseQueries.ts'
import { useErrorStore } from '@/stores/errorStore.ts'
import { useAuthStore } from '@/stores/authStore.ts'
import type { Files, Folders } from '@/lib/supabase/supabaseQueryTypes.ts'
import type { FolderTreeNode } from '@/types/folder.tree.type.ts'
import { folderTreeConstructor } from '@/lib/folderTreeConstructor.ts'

export const useStorageStore = defineStore('storage', () => {
  const { user } = storeToRefs(useAuthStore());
  const files = ref<Files | null>(null);
  const folders = ref<Folders | null>(null);
  const currentFolderId = ref<string | null>(null);
  const foldersTree = ref<FolderTreeNode[] | null>(null);

  async function setCurrentFolderId(id: string | null) {
    currentFolderId.value = id
    refreshStorage()
  }

  async function refreshFiles() {
    if (!user.value) return
    const { data, error, status } = await filesQuery(user.value.id, currentFolderId.value)

    if (error) useErrorStore().setError({ error, customCode: status })
    files.value = data
  }

  async function fetchFolders() {
    if (!user.value) return
    const { data, error, status } = await foldersQuery(user.value.id, currentFolderId.value)

    if (error) useErrorStore().setError({ error, customCode: status })
    folders.value = data
  }

  async function refreshFolders() {
    fetchFolders();
    refreshFoldersTree();
  }

  async function refreshFoldersTree() {
    if (!user.value) return console.log('no')
    const { data, error, status } = await getAllFoldersQuery(user.value.id)

    if (error) useErrorStore().setError({ error, customCode: status })

    if (data) foldersTree.value = folderTreeConstructor(data);
  }

  function refreshStorage() {
    refreshFiles()
    fetchFolders()
  }

  return {
    files,
    folders,
    foldersTree,
    currentFolderId,
    refreshStorage,
    setCurrentFolderId,
    refreshFolders,
    refreshFiles,
    refreshFoldersTree
  }
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useStorageStore, import.meta.hot))
}
