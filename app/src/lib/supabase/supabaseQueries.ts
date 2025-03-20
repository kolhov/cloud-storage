import {supabase} from "@/lib/supabase/supabaseClient.ts";
import type { FolderInsert } from '@/types/database.insert.types.ts'

export const filesQuery = (userid: string, folder?: string | null | undefined) => {
  const query = supabase
    .from('files')
    .select()
    .eq('owner', userid);
  if (folder) {
    return query.eq('folder', folder);
  } else if (folder === null){
    return query.is('folder', null);
  } else {
    return query;
  }
}

export const foldersQuery = (userid: string, folder: string | null | undefined) => {
  const query = supabase
    .from('folders')
    .select()
    .eq('owner', userid);
  if (folder){
    return query.eq('folder', folder);
  } else if (folder === null){
    return query.is('folder', null);
  } else {
    return query;
  }
}

export const folderQuery = (userid: string, name: string, folder: string | null = null) => {
  const query = supabase
    .from('folders')
    .select()
    .eq('owner', userid)
    .eq('name', name);
  if (folder){
    return query.eq('folder', folder)
      .maybeSingle();
  } else {
    return query.is('folder', null)
      .maybeSingle();
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

export const insertFolderQuery = (folder: FolderInsert) => {
  return supabase
    .from('folders')
    .insert({
      name: folder.name,
      folder: folder.folder,
      owner: folder.owner,
      isPublic: folder.public
    } as FolderInsert)
    .select()
    .single();
}

export const updateFilePublicQuery = (id: string, isPublic: boolean) =>
  supabase
    .from('files')
    .update({ 'public': isPublic })
    .eq('id', id);

export const updateFolderPublicQuery = (id: string, isPublic: boolean) =>
  supabase
    .from('folders')
    .update({ 'public': isPublic })
    .eq('id', id);

export const updateFileNameQuery = (id: string, name: string) =>
  supabase
    .from('files')
    .update({ 'name': name })
    .eq('id', id);

export const updateFolderNameQuery = (id: string, name: string) =>
  supabase
    .from('folders')
    .update({ 'name': name })
    .eq('id', id);

export const updateFileFolderQuery = (id: string, folderId: string) =>
  supabase
    .from('files')
    .update({ 'folder': folderId })
    .eq('id', id);

export const updateFolderFolderQuery = (id: string, folderId: string) =>
  supabase
    .from('folders')
    .update({ 'folder': folderId })
    .eq('id', id);













