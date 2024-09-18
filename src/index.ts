import express, { json, urlencoded, Request, Response, NextFunction } from 'express';

import cors from 'cors';
import connectDB from './db/config';
import apiRoutes from './routes/api.routes';
import logger from './utils/logger';
import { PORT } from './utils/config';


const app = express();
const port = PORT;


connectDB();


app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cors());


app.use('/', apiRoutes);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Error en el servidor:', err);
    res.status(500).json({
        ok: false,
        msg: 'Error en el servidor',
        error: err.message,
    });
});

app.listen(port, () => {
    logger.info(`Servidor conectado al puerto ${port}`);
});