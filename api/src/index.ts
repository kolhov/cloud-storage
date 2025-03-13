import express from "express";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";

dotenv.config();

const app = express();
const port = process.env.PORT;
const upload = multer({ dest: 'storage/' });

app.use(cors({
  origin: process.env.FE_URL, // Разрешаем запросы только с этого источника
  methods: ['GET', 'POST'], // Разрешаем методы
}));

app.post('/upload', upload.single('file'), (req, res) => {
  console.log(req.file);
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});