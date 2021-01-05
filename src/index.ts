import express, { json } from 'express';
import cors from 'cors';
import routes from './routes';

const http = require('http');

const app = express();
const server = http.Server(app);

app.use(cors());
app.use(json());
app.use(routes);

server.listen(3001, () => {
    console.log('server is running ::3001');
})