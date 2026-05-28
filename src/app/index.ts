import express from 'express'
import type { Express } from 'express'
import { authRouter } from '../auth/routes';
import { authenticationMiddleware } from './middleware/auth-middleware';

export function createExpressApp(): Express {
    const app = express()

    // Middlewares
    app.use(express.json());
    app.use(authenticationMiddleware())


    // Routes
    app.use('/auth', authRouter);

    app.get('/', (req, res) => {
        res.json({'message': 'Hello World!'})
    })

    return app;
}