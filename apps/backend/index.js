import express from 'express';
import * as Minio from 'minio';
import path from 'path';
import { sequelize } from './src/model/index.js';
import { fileURLToPath } from 'url';
import { File } from './src/model/file.model.js';
import { specs, swaggerUi } from './src/swagger.js';
import fileRoutes from './src/routes/file.js';
import { initializeMinio } from './src/config/minio.js';

const app = express();
const port = 3000;

app.use(express.json());

// swagger UI 설정
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/file', fileRoutes);

// MySQL 연결
await sequelize.sync({ force: false })
  .then(() => {
    console.log('MySQL 연결 성공');
  })
  .catch((err) => {
    console.error('MySQL 연결 오류:', err);
  });

initializeMinio();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// HTML 폼 라우트
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});