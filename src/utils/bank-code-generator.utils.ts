export function bankGenerateCode(lastId: number) {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2);
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const lastIdPart = String(lastId % 10000).padStart(4, '0');

    return `${year}${month}${day}${lastIdPart}`;
}