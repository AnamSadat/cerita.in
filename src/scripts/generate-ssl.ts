import { randomBytes } from 'crypto';

const secret = randomBytes(32).toString('base64');

/**
 * To running:
 * pnpm generate:ssl
 */

console.log('✅ Generate SSL Success');
console.log('-----------------------------------------------');
console.log(secret);
