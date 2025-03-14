import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { multerUpload } from '@/lib/multerSettings';
import { insertFileQuery } from '@/lib/supabase/supabaseQueries'

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FE_URL,
  methods: ['GET', 'POST'],
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

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});