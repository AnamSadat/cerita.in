import jwt from 'jsonwebtoken';

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.AUTH_SECRET!, { expiresIn: '1d' });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET!);
  } catch (error) {
    return null;
  }
}
