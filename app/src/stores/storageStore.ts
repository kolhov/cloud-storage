import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStorageStore = defineStore('storage', () => {
  const files = ref(null)
  const folders = ref([
    {
      'id': 'fb9ad475-5622-43b5-9d92-c66e64d41dc3',
      'created_at': '2025-03-07T20:15:52.222+00:00',
      'name': 'folder1',
      'public': false,
      'folder': null,
      'owner': 'f5af5021-1e9e-4bd0-9e1c-6b3e16308042',
      'icon': 'Folder'
    },
    {
      'id': '8950ba55-a56e-4df1-8248-15a16b88d918',
      'created_at': '2025-03-07T20:15:52.222+00:00',
      'name': 'folder2',
      'public': true,
      'folder': null,
      'owner': 'f5af5021-1e9e-4bd0-9e1c-6b3e16308042',
      'icon': 'Folder'
    },
    {
      'id': '6c17e000-e006-4eb4-9de4-95f8c307b8be',
      'created_at': '2025-03-07T20:15:52.299433+00:00',
      'name': 'folder-inside-folder1',
      'public': false,
      'folder': 'fb9ad475-5622-43b5-9d92-c66e64d41dc3',
      'owner': 'f5af5021-1e9e-4bd0-9e1c-6b3e16308042',
      'icon': 'Folder'
    }
  ])
  const foldersTree = ref(null)

  return {
    files,
    folders,
    foldersTree
  }

})
