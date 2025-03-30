import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { multerUpload } from '@/lib/multerSettings';
import {
  deleteFileQuery,
  deleteFolderQuery,
  fileQuery,
  filesInFolderQuery,
  folderQuery,
  insertFileQuery,
  insertTokenQuery,
  publicFileQuery,
  tokenQuery
} from '@/lib/supabase/supabaseQueries'
import { deleteToken, logError } from '@/lib/utils'
import * as fs from 'node:fs'
import path from 'node:path'
import { authorize } from '@/lib/authorization'

dotenv.config();
const app = express();
const port = process.env.PORT;
const storagePath = path.join(process.cwd(), "storage");

app.use(express.json());
app.use(cors({
  origin: process.env.FE_URL,
  methods: ['GET', 'POST', 'DELETE'],
}));

app.post('/upload', multerUpload.single('file'), async (req, res) => {
  if (!req.file) {
    res.status(400).send('Bad request')
    console.log('Can\'t make insert no file in request')
    return;
  }
  console.log('File uploaded: ', req.file?.filename);
  console.log(req.body);

  const {data, error} = await insertFileQuery(req.file, req);
  if (error) {
    res.status(Number(error.code)).send(`${error.details}\n${error.hint}`);
    return;
  }
  console.log(data);
  res.sendStatus(200);
});

app.get('/download-shared/:id', async (req, res) => {
  const {data, error} = await publicFileQuery(req.params.id);
  if (error) {
    res.status(Number(error.code)).send(`${error.details}\n${error.hint}`);
    return;
  }
  if (data === null){
    res.sendStatus(403);
    return;
  }

  const filePath = path.join(process.cwd(), 'storage', data.owner, data.id);
  res.download(filePath, data.name, (err) => {
    if (err){
      logError('Download error: ', err);
      if (!res.headersSent) res.sendStatus(500);
    }
  });
});

app.get('/download/:token', async (req, res) => {
  const {data, error} = await tokenQuery(req.params.token);
  if (error) {
    res.status(Number(error.code)).send(`${error.details}\n${error.hint}`);
    await logError('Token query error: ', error);
    return;
  }
  if (data === null){
    res.sendStatus(404);
    return;
  }
  if (new Date(data.expiration_time) < new Date()) {
    res.status(403).send('The token has expired.');
    await deleteToken(data.id);
    return;
  }

  if (data.file_id){
    const file = data.file_id;
    const filePath = path.join(process.cwd(), 'storage', file.owner, file.id);
    res.download(filePath, file.name, (err) => {
      if (err){
        logError('Download error: ', err);
        if (!res.headersSent) res.sendStatus(500);
      }
    });
  } else if (data.folder_id) {
    // TODO bulk download
    // make archive with all files
  } else {
    await logError('Bad token: ', data);
    res.sendStatus(500);
  }
  await deleteToken(data.id);
});

app.get('/download-token/file/:id', authorize, async (req, res) => {
  const userId = req.body.userId;
  const {data, error} = await fileQuery(userId, req.params.id);
  if (error) {
    res.status(Number(error.code)).send(`${error.details}\n${error.hint}`);
    return;
  }
  if (data === null){
    res.sendStatus(403);
    return;
  }

  const token = await insertTokenQuery('file', data.id);
  if (token.error) {
    res.status(Number(token.error.code)).send(`${token.error.details}\n${token.error.hint}`);
    return;
  }
  if (token.data === null){
    res.sendStatus(500);
    return;
  }
  res.send({token: token.data});
});

app.get('/download-token/folder/:id', authorize, async (req, res) => {
  const userId = req.body.userId;
  const {data, error} = await folderQuery(userId, req.params.id);
  if (error) {
    res.status(Number(error.code)).send(`${error.details}\n${error.hint}`);
    return;
  }
  if (data === null){
    res.sendStatus(403);
    return;
  }

  const token = await insertTokenQuery('folder', data.id);
  if (token.error) {
    res.status(Number(token.error.code)).send(`${token.error.details}\n${token.error.hint}`);
    return;
  }
  if (token.data === null){
    res.sendStatus(500);
    return;
  }
  res.send({token: token.data});
});

app.delete('/file', authorize, async (req, res ) => {
  const userId = req.body.userId;
  const filePath = path.join(storagePath, userId, req.body.id)
  try {
    fs.rmSync(filePath);
  } catch (err) {
    await logError('File deletion error: ', err);
  }

  const {error} = await deleteFileQuery(req.body.id, userId);
  if (error){
    res.sendStatus(500);
    await logError('Delete file query error: ', error);
    return;
  }
  res.sendStatus(200);
});

app.delete('/folder', authorize, async (req, res ) => {
  const userId = req.body.userId;
  const {data, error} = await filesInFolderQuery(userId, req.body.id);
  if (error) {
    res.sendStatus(500);
    await logError('Files query error: ', error);
    return;
  }

  if (data && data?.length > 0){
    data.forEach((file) => {
      const filePath = path.join(storagePath, userId, file.id);
      try {
        fs.rmSync(filePath);
      } catch (err) {
        logError('File deletion error: ', err);
      }
    });
  }

  const del = await deleteFolderQuery(req.body.id, userId);
  if (del.error){
    res.sendStatus(500);
    await logError('Delete folder query error: ', del.error);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});