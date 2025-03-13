import multer, { FileFilterCallback } from 'multer'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Request } from 'express'
import { ExtendedRequest } from '@/types/express.types'

const storage = multer.diskStorage({
  destination: function (req: ExtendedRequest, file, cb) {
    //TODO создать папку
    cb(null, `/storage/${req.userUuid}`)
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname);
  }
});

const fileFilter = (req: ExtendedRequest, file: Express.Multer.File, cb: FileFilterCallback) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return cb(new Error('Unauthorized'));
  }

  const token = authHeader.split(' ')[1];
  if (!token){
    return cb(new Error('Forbidden'));
  }

  supabase.auth.getUser(token)
    .then( ({data, error}) => {
      if (error){
        return cb(new Error(error.message));
      }
      req.userUuid = data.user?.id;
      cb(null, true);
  }).catch(err => cb(new Error(err)));
};

export const multerUpload = multer({ storage, fileFilter });