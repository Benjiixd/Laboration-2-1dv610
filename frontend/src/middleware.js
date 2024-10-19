import { NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';

const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Function to convert PEM to CryptoKey
async function getCryptoKey(pem) {
  try {
    const cryptoKey = await importSPKI(pem, 'RS256');
    return cryptoKey;
  } catch (error) {
    console.error("Error converting PEM to CryptoKey:", error);
    throw error;
  }
}

export default async function middleware(req) {
  if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }
  const token = req.cookies.get('token')?.value;
  if (!token) {
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'no-token');
    return response;
  }
  try {
    const cryptoKey = await getCryptoKey(PUBLIC_KEY);
    const { payload } = await jwtVerify(token, cryptoKey);
    const response = NextResponse.next();
    response.cookies.set('auth-status', JSON.stringify(payload));
    return response;
  } catch (err) {
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'invalid-token');
    return response;
  }
}
