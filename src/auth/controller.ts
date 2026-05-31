import type { Request, Response } from 'express';
import { signinPayloadModel, signupPayloadModel } from './models';
import { randomBytes, createHmac } from 'node:crypto'
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';
import { createUSerToken, UserTokenPayload } from './utils/token';

class AuthenticationController {
    public async handleSignup(req: Request, res: Response) {
        // Implement signup logic here
        const validationResult = await signupPayloadModel.safeParseAsync(req.body);

        if (validationResult.error)
            return res.status(400).json({ message: 'Invalid payload', errors: validationResult.error.issues });

        const { firstName, lastName, email, password } = validationResult.data;

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (existingUser.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt,
        }).returning({ id: usersTable.id });

        return res.status(201).json({ message: 'User created successfully', data: { id: result?.id } });
    }

    public async handleSignin(req: Request, res: Response) {
        const validationResult = await signinPayloadModel.safeParseAsync(req.body);

        if (validationResult.error)
            return res.status(400).json({ message: 'Invalid payload', errors: validationResult.error.issues });

        const { email, password } = validationResult.data;

        const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (!user) {
            return res.status(404).json({ message: 'User with this email does not exist' });
        }

        const salt = user.salt!;
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

        if (user.password !== hashedPassword)
            return res.status(400).json({ message: `email or password is incorrect` })

        // TOKEN banao
        const token = createUSerToken({id: user.id})

        return res.json({ message: `SignIn Success`, data: { token: token } })
    }

    public async handleMe(req: Request, res: Response){
        //@ts-ignore
        const {id} = req.user! as UserTokenPayload

        const [userResult] = await db.select().from(usersTable).where(eq(usersTable.id, id))

        return res.json({
            firstName: userResult?.firstName,
            lastName: userResult?.lastName,
            email: userResult?.email
        })
    }
}

export default AuthenticationController;