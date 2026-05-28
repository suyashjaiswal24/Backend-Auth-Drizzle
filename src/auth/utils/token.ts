import JWT from 'jsonwebtoken'

export interface UserTokenPayload {
    id: string
}

const JWT_SECRET = 'myjwtsecret'

export function createUSerToken(payload: UserTokenPayload) {
    const token = JWT.sign(payload, JWT_SECRET)
    return token
}

export function verifyUSerToken(token: string) {
    try {
        const payload = JWT.verify(token, JWT_SECRET) as UserTokenPayload
        return payload
    } catch (error) {
        return null
    }
}

