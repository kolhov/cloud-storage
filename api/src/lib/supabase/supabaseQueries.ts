import { supabase } from '@/lib/supabase/supabaseClient'
import { Tables } from '@/types/database.types'
import { Request } from 'express'

export const insertFileQuery = (file: Express.Multer.File, req: Request, isPublic: boolean = false) => {
  const preparedFile = {
    folder: req.body.folderId === 'null' ? null : req.body.folderId,
    icon: req.body.icon,
    id: req.body.fileUuid,
    mime: req.body.mime,
    name: decodeURIComponent(file.originalname),
    owner: req.body.userUuid,
    public: isPublic,
    size: file.size
  } as Tables<'files'>

  return supabase
    .from('files')
    .insert(preparedFile)
    .select()
    .single();
}

export const deleteFileQuery = (id: string | string[], userId: string) => {
  const query = supabase
    .from('files')
    .delete()
    .eq('owner', userId);
  if (Array.isArray(id)) {
    return query.in('id', id);
  } else {
    return query.eq('id', id);
  }
}
export const deleteFolderQuery = (id: string, userId: string) =>
  supabase
    .from('folders')
    .delete()
    .eq('id', id)
    .eq('owner', userId);

export const filesQuery = (userid: string, folder: string) =>
  supabase
    .from('files')
    .select()
    .eq('owner', userid)
    .eq('folder', folder);

