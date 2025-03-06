import {supabase} from "@/lib/supabase/supabaseClient.ts";

export const filesQuery = (folder: string | null = null) => {
  const query = supabase
    .from('files')
    .select();
  if (folder) {
    return query.eq('folder', folder)
  } else {
    return query.is('folder', null)
  }
}

export const foldersQuery = (folder: string | null = null) => {
  const query = supabase
    .from('folders')
    .select();
  if (folder){
    return query.eq('folder', folder);
  } else {
    return query.is('folder', null);
  }
}


















