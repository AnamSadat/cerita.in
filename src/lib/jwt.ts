import jwt from 'jsonwebtoken';

export function signJwt(payload: object) {
  return jwt.sign(payload, process.env.AUTH_SECRET!, { expiresIn: '1d' });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, process.env.AUTH_SECRET!);
  } catch (error) {
    // Di sini kita bisa menggunakan objek 'error'
    if (error instanceof jwt.TokenExpiredError) {
      // Token sudah kadaluarsa
      console.error('JWT Error: Token kadaluarsa.', error.message);
      return { status: 'expired' }; // Mengembalikan objek dengan status spesifik
    } else if (error instanceof jwt.JsonWebTokenError) {
      // Error JWT lainnya (misalnya: invalid signature, malformed token)
      console.error('JWT Error: Token tidak valid.', error.message);
      return { status: 'invalid' }; // Mengembalikan objek dengan status spesifik
    } else {
      // Error tak terduga
      console.error(
        'JWT Error: Terjadi kesalahan yang tidak diketahui.',
        error
      );
      return { status: 'unknown_error' }; // Mengembalikan objek dengan status spesifik
    }
  }
}
