import express from 'express';
import cors from 'cors';
import routerApi from './routes/index.js';
import dotenv from 'dotenv';

const app = express();
dotenv.config();
const port = process.env.PORT || 3000;

const corsOptions = {
    origin: ['https://estetica-principal.netlify.app','https://estetica-emma.netlify.app', 'http://localhost:3000', 'http://localhost:8081'],  // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };    

  app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
});
app.get('/test-db', async (req, res) => {
    try {
        const result = await sequelize.query('SELECT 1+1 as result');
        res.json({ result: result[0][0].result });
    } catch (error) {
        res.status(500).json({ error: 'Error al conectar con la base de datos' });
    }
});     
routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});
