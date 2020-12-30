import express from 'express';
import path from 'path';
import routes from './routes';
const { createEngine } = require('express-react-views');

const http = require('http');

const app = express();
const server = http.Server(app);



app.set('views', __dirname + '/views');
app.set('view engine', 'tsx');
app.engine('tsx', createEngine());
app.use(routes);

server.listen(3000, () => {
    console.log('server is running ::3000');
})