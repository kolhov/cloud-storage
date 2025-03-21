import { useAuthStore } from '@/stores/authStore.ts'
import { useErrorStore } from '@/stores/errorStore.ts'
import { folderQuery, insertFolderQuery } from '@/lib/supabase/supabaseQueries.ts'
import { useStorageStore } from '@/stores/storageStore.ts'

export async function ensureFolder(folderEntry: FileSystemDirectoryEntry, parentFolderUuid: string | null){
  const {user} = useAuthStore();
  let uuid: string | null = parentFolderUuid;
  if (!user){
    useErrorStore().setError({ error:'Unauthorised', customCode: 400});
  } else {
    // Check if folder exists
    const currentFolder = await folderQuery(user.id, folderEntry.name, parentFolderUuid);
    if (currentFolder.error != null){
      console.log(currentFolder.error);
    } else if (currentFolder.data === null) {
      // Create new folder
      console.log('Creating folder: ', folderEntry.name);
      const {data, error} = await insertFolderQuery({
        name: folderEntry.name,
        owner: user.id,
        folder: parentFolderUuid
      });
      if (error){
        console.log(error);
      } else {
        useStorageStore().refreshFolders();
      }
      uuid = data?.id ?? parentFolderUuid;
    } else {
      uuid = currentFolder.data.id ?? parentFolderUuid;
    }
  }
  return uuid;
}
