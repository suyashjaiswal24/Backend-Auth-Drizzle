import {Request,Response} from 'express';
import { signupPayloadModel } from './models';
import { randomBytes, createHmac } from 'node:crypto'
import { db } from '../db';
import { usersTable } from '../db/schema';
import { eq } from 'drizzle-orm';

class AuthenticationController {
    public async  handleSignup(req: Request, res: Response){
        // Implement signup logic here
        const validationResult = await signupPayloadModel.safeParseAsync(req.body);
        
        if(validationResult.error) 
            return res.status(400).json({message: 'Invalid payload', errors: validationResult.error.issues});
        
        const {firstName, lastName, email, password} = validationResult.data;

        const existingUser = await db.select().from(usersTable).where(eq(usersTable.email, email));

        if (existingUser.length > 0) {
            return res.status(400).json({message: 'User already exists'});
        }

        const salt = randomBytes(16).toString('hex');
        const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

        const [result] = await db.insert(usersTable).values({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            salt,
        }).returning({id: usersTable.id});

        return res.status(201).json({message: 'User created successfully', data: {id: result?.id} });
    }
}

export default AuthenticationController;