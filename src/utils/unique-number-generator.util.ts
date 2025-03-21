import * as crypto from 'crypto';

export const generateUniqueNumber = (counter: number, key: string): string => {
    const hash = crypto.createHash('sha256').update(key.toLowerCase() + counter.toString()).digest('hex');
    const uniqueNumber = parseInt(hash.substring(0, 12), 16).toString().padStart(12, '0');

    return uniqueNumber;
};