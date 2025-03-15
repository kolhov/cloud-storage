import { supabase } from '@/lib/supabase/supabaseClient'
import { Tables } from '@/types/database.types'
import { Request } from 'express'

export const insertFileQuery = (file: Express.Multer.File, req: Request, isPublic: boolean = false) => {
  const preparedFile = {
    folder: req.body.folderId === 'null' ? null : req.body.folderId,
    icon: req.body.icon,
    id: req.body.fileUuid,
    mime: req.body.mime,
    name: file.originalname,
    owner: req.body.userUuid,
    public: isPublic,
    size: file.size
  } as Tables<'files'>

  return supabase
    .from('files')
    .insert(preparedFile)
    .select()
    .single()
}