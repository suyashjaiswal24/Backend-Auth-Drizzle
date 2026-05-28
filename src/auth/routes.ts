import express from 'express';
import type { Router } from 'express';
import AuthenticationController from './controller';
import { restrictToAuthenticatedUser } from '../app/middleware/auth-middleware';

const authController = new AuthenticationController();

export const authRouter: Router = express.Router();

authRouter.post('/sign-up', authController.handleSignup.bind(authController));
authRouter.post('/sign-in',authController.handleSignin.bind(authController));
authRouter.get('/me', restrictToAuthenticatedUser(), authController.handleMe.bind(authController));