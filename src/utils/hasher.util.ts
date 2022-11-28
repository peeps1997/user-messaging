import * as crypto from 'crypto';
export async function hashPassword(password) {
  return crypto.createHmac('sha256', password).digest('hex');
}
