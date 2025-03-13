import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { multerUpload } from '@/lib/multerSettings';

dotenv.config();
const app = express();
const port = process.env.PORT;

app.use(cors({
  origin: process.env.FE_URL,
  methods: ['GET', 'POST'],
}));

app.post('/upload', multerUpload.single('file'), (req, res) => {
  console.log(req.file);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});