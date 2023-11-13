'use client'
import Image from 'next/image'
import React, { MouseEventHandler, useState } from 'react'
import QRCode from 'react-qr-code';

export default function Home() {
  const [url, setUrl] = useState('');

  function issueCrededential() {

  }

  async function authenticateQR(): Promise<void> {
    const res = await fetch('/api/didComUrl');
    const url = await res.text()
    console.log(url);
    setUrl(url);
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <p>Hello</p>
      <button className='bg-pink-500 p-3 rounded-md' onClick={() => authenticateQR()}>
        Authenticate
      </button>
      <button className='bg-blue-500 mb-4 mt-3 p-3 rounded-md' onClick={() => issueCrededential()}>
        Issue credz
      </button>
      {
        url ?
          <QRCode
              size={256}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={url}
              viewBox={`0 0 256 256`}
              />
          : null

      }
    </main>
  )
}
