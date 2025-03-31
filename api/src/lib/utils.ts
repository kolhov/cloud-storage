import { deleteTokenQuery } from '@/lib/supabase/supabaseQueries'
import fs from 'node:fs'
import path from 'node:path'
import { TEMP_FOLDER_PATH } from '@/lib/archive/archiver'

export async function deleteToken(id: string){
  const tokenDel = await deleteTokenQuery(id);
  if (tokenDel.error){
    console.error('Deletion error on token: ', id);
  }
}

export async function logError(text: string, object?: any){
  // TODO add to db logging table
  console.error(text, object);
}

export function deleteArchive(id: string) {
  fs.unlink(path.join(TEMP_FOLDER_PATH, id), (err) => {
    if (err) {
      logError('Archive deletion error: ', err);
      return;
    }
  });
}