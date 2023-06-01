import { log } from 'console';
import { createDecipheriv, randomBytes } from 'crypto';
import { readFile } from 'fs/promises';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  const file = await readFile('./keys.txt', { encoding: 'utf-8' });
  log('data', data);
  let priKey = null;
  let storedIV = null;
  let authTag = null;
  for (const line of file.split('\n')) {
    if (line.includes(data)) {
      const splittedLine = line.split(':');
      console.log(splittedLine);
      priKey = splittedLine[0].trim();
      storedIV = splittedLine[5].trim();
      authTag = splittedLine[7].trim();
      break;
    }
  }
  if (!priKey || !storedIV || !authTag) {
    return new Response(
      JSON.stringify({ message: "Sorry, can't decrypt this data" })
    );
  }

  const key = Buffer.from(priKey, 'hex');
  const iv = Buffer.from(storedIV, 'hex');
  authTag = Buffer.from(authTag, 'hex');
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(authTag);
  const decryptedData =
    decipher.update(data, 'hex', 'utf-8') + decipher.final('utf-8');
  console.log({ decryptedData });
  return new Response(JSON.stringify({ data: decryptedData }));
}
