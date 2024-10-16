import { NextResponse } from 'next/server';
import { jwtVerify, importSPKI } from 'jose';

const PUBLIC_KEY = process.env.PUBLIC_KEY;

// Function to convert PEM to CryptoKey
async function getCryptoKey(pem) {
  try {
    console.log("Public Key PEM:", pem); // Log the PEM
    const cryptoKey = await importSPKI(pem, 'RS256');
    console.log("Converted CryptoKey:", cryptoKey); // Log the CryptoKey
    return cryptoKey;
  } catch (error) {
    console.error("Error converting PEM to CryptoKey:", error);
    throw error;
  }
}

export default async function middleware(req) {
  console.log("Middleware is called for:", req.nextUrl.pathname);

  // Only apply middleware to HTML requests for specific paths
  if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.includes('.')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('token')?.value;

  console.log("Token:", token);

  if (!token) {
    console.log("No token found, setting auth-status to no-token");
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'no-token');
    return response;
  }

  try {
    // Convert the PEM public key to CryptoKey
    const cryptoKey = await getCryptoKey(PUBLIC_KEY);
    console.log("CryptoKey created:", cryptoKey);

    // Verify the token
    const { payload } = await jwtVerify(token, cryptoKey);
    console.log("Token verified:", payload);

    // Set the payload in a cookie
    const response = NextResponse.next();
    response.cookies.set('auth-status', JSON.stringify(payload));
    return response;
  } catch (err) {
    // Log the reason for the invalid token
    console.log("Token verification failed:", err.message);

    // If verification fails, set auth-status to invalid-token
    const response = NextResponse.next();
    response.cookies.set('auth-status', 'invalid-token');
    return response;
  }
}
