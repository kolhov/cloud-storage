import {supabase} from "@/lib/supabase/supabaseClient.ts";

export const filesQuery = (userid: string, folder: string | null = null) => {
  const query = supabase
    .from('files')
    .select()
    .eq('owner', userid);
  if (folder) {
    return query.eq('folder', folder)
  } else {
    return query.is('folder', null)
  }
}

export const foldersQuery = (userid: string, folder: string | null = null) => {
  const query = supabase
    .from('folders')
    .select()
    .eq('owner', userid);
  if (folder){
    return query.eq('folder', folder);
  } else {
    return query.is('folder', null);
  }
}

export const getAllFoldersQuery = (userid: string) => supabase
  .from('folders')
  .select()
  .eq('owner', userid);

export const sharedFoldersQuery = (folder: string) => {
  return supabase.from('folders')
    .select()
    .eq('public', true)
    .eq('folder', folder);
}

export const sharedFilesQuery = (folder: string) => {
  return supabase.from('files')
    .select()
    .eq('public', true)
    .eq('folder', folder);
}

export const sharedSingleFileQuery = (id: string) => {
  return supabase.from('files')
    .select(`
      id,
      name,
      mime,
      public,
      created_at,
      folder,
      size
    `)
    .eq('public', true)
    .eq('id', id)
    .single();
}
















