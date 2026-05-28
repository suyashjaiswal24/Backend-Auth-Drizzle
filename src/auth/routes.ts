import express from 'express';
import type { Router } from 'express';
import AuthenticationController from './controller';

const authController = new AuthenticationController();

export const authRouter: Router = express.Router();

authRouter.post('/sign-up', authController.handleSignup.bind(authController));
authRouter.post('/sign-in',authController.handleSignin.bind(authController));