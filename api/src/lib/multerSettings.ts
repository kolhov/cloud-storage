import multer, { FileFilterCallback } from 'multer'
import { supabase } from '@/lib/supabase/supabaseClient'
import { Request } from 'express'
import * as path from 'node:path'
import * as fs from 'node:fs'

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), "storage", req.body.userUuid as string);

    if (!fs.existsSync(uploadPath)){
      fs.mkdirSync(uploadPath, {recursive: true});
    }
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const fileUuid = crypto.randomUUID();
    req.body.fileUuid = fileUuid;
    cb(null, fileUuid);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
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
      req.body.userUuid = data.user?.id;
      cb(null, true);
  }).catch(err => cb(new Error(err)));
};

export const multerUpload = multer({
  storage,
  fileFilter,
  limits: {fileSize: 10 * 1024 * 1024 * 1024} // 10gb
});