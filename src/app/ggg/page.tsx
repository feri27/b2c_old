'use client';
import React, { useState } from 'react';
import crypto from 'crypto';

function Page() {
  const [pwd, setPwd] = useState('');

  const handleClick = () => {
    const secret = 'testtesttesttesttesttesttesttest';

    const iv = Buffer.from(crypto.randomBytes(16));
    const cipher = crypto.createCipheriv(
      'aes-256-ctr',
      Buffer.from(secret),
      iv
    );

    const encryptedPassword = Buffer.concat([
      cipher.update(pwd),
      cipher.final(),
    ]);
    setPwd(encryptedPassword.toString('base64'));
  };
  return (
    <div className="flex w-full h-screen justify-center items-center">
      <div>
        <input
          type="text"
          value={pwd}
          onChange={(e) => setPwd(e.target.value)}
        />
        <button className="px-3 py-2" onClick={handleClick}>
          Encrypt
        </button>
      </div>
    </div>
  );
}

export default Page;
