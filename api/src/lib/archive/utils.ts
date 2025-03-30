import { allFoldersQuery, filesInFolderQuery } from '@/lib/supabase/supabaseQueries'
import { FilesInFolder } from '@/types/db.queries.types'
import path from 'node:path'
import { logError } from '@/lib/utils'

export async function prepareFilesMetadataToArchive(userId: string, folderId: string, filePath: string = ''): Promise<Record<string, FilesInFolder>>{
  const dataToArchive: Record<string, FilesInFolder> = {};

  const {data, error} = await filesInFolderQuery(userId, folderId);
  if (error) {
    await logError('Error on all folders query while preparing archive:\n', error);
  }
  if (data !== null) {
    filePath = path.join(filePath, (data[0].folder?.name ?? ''));
    dataToArchive[filePath] = data;
  }

  const nestedFiles = await prepareNestedFilesMetadataToArchive(userId, folderId, filePath);

  return { ...dataToArchive, ...nestedFiles };
}

export async function prepareNestedFilesMetadataToArchive(userId: string, folderId: string, filePath: string = ''): Promise<Record<string, FilesInFolder>>{
  let dataToArchive: Record<string, FilesInFolder> = {};

  const {data, error} = await allFoldersQuery(userId, folderId);
  if (error) {
    await logError('Error on all folders query while preparing archive:\n', error);
  } else if (data !== null) {
    for (const item of data){
      const nestedFiles = await prepareFilesMetadataToArchive(userId, item.id, filePath);
      dataToArchive = {...dataToArchive, ...nestedFiles};
    }
  }

  return dataToArchive;
}
