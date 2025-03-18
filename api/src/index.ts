import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { multerUpload } from '@/lib/multerSettings';
import { deleteFileQuery, deleteFolderQuery, filesQuery, insertFileQuery } from '@/lib/supabase/supabaseQueries'
import { headerToUser } from '@/lib/utils'
import * as fs from 'node:fs'
import path from 'node:path'


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
  }
  console.log(data);
  res.sendStatus(200);
});

app.get('/download', (req, res) => {

})

app.delete('/file', async (req, res ) => {
  const userId = await headerToUser(req);
  if (!userId){
    res.sendStatus(403);
    return;
  }

  const filePath = path.join(storagePath, userId, req.body.id)
  try {
    fs.rmSync(filePath);
  } catch (err) {
    console.error('File deletion error: ', err);
  }

  const {error} = await deleteFileQuery(req.body.id, userId);
  if (error){
    res.sendStatus(500);
    console.error('Delete file query error: ', error);
    return;
  }
  res.sendStatus(200);
});

app.delete('/folder', async (req, res ) => {
  const userId = await headerToUser(req);
  if (!userId){
    res.sendStatus(403);
    return;
  }

  const {data, error} = await filesQuery(userId, req.body.id);
  if (error) {
    res.sendStatus(500);
    console.error('Files query error: ', error);
    return;
  }

  if (data && data?.length > 0){
    data.forEach((file) => {
      const filePath = path.join(storagePath, userId, file.id);
      try {
        fs.rmSync(filePath);
      } catch (err) {
        console.error('File deletion error: ', err);
      }
    });
  }

  const del = await deleteFolderQuery(req.body.id, userId);
  if (del.error){
    res.sendStatus(500);
    console.error('Delete folder query error: ', del.error);
    return;
  }
  res.sendStatus(200);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});