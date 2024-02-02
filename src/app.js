import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerApi from './routes/index.js';

dotenv.config();
const app = express();

const port = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3000',  // Reemplaza con la URL de tu frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req,res) => {
    res.send('Backend con NodeJS - Express + CRUD API REST + MySQL');
});

routerApi(app);

app.listen(port,()=>{
    console.log("Port ==> ", port);
});