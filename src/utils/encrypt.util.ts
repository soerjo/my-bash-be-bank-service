import * as dotenv from 'dotenv';
import * as crypto from 'crypto';
dotenv.config();

const SECRET_KEY = process.env['ENCRYPT_KEY'];

export const encrypt = (text?: string): string | undefined => {
    if (!text) return undefined;
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv('aes-256-cbc', SECRET_KEY, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    return `${iv.toString('hex')}:${encrypted}`;
};

export const decrypt = (text?: string): string | undefined => {
    if (!text) return undefined;

    const [ivHex, encryptedText] = text.split(':');
    if (!ivHex || !encryptedText) return undefined;

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv('aes-256-cbc', SECRET_KEY, iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};