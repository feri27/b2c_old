import { log } from 'console';
import { createCipheriv, randomBytes } from 'crypto';
import { open } from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { data } = await req.json();
  const file = await open('./keys.txt', 'a+');
  const buffer = Buffer.alloc((await file.stat()).size);
  const fileData = (
    await file.read(buffer, 0, buffer.byteLength, 0)
  ).buffer.toString();
  let isAlreadyThere = false;
  let priKey = null;
  let encData = null;
  for (const line of fileData.split('\n')) {
    if (line.includes(data)) {
      isAlreadyThere = true;
      const splittedLine = line.split(':');
      priKey = splittedLine[0].trim();
      encData = splittedLine[3].trim();
      break;
    }
  }
  const key = priKey !== null ? Buffer.from(priKey, 'hex') : randomBytes(32);
  if (!isAlreadyThere) {
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-gcm', key, iv);
    const encryptedData =
      cipher.update(data, 'utf-8', 'hex') + cipher.final('hex');
    const authTag = cipher.getAuthTag();
    file.appendFile(
      `${key.toString(
        'hex'
      )}:${data}:encryptedData:${encryptedData}:iv:${iv.toString(
        'hex'
      )}:authTag:${authTag.toString('hex')}\n`
    );
    file.close();
    return new Response(JSON.stringify({ data: encryptedData }));
  } else {
    file.close();
    return new Response(JSON.stringify({ data: encData }));
  }
}
