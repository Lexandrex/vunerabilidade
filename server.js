import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/usuario.route.js';
import cors from 'cors';


const app = express();
app.use(bodyParser.json());
app.use(cors());
app.use('/usuarios', router);

app.listen(3000, () => {
    console.log('API rodando em http://localhost:3000');
});
