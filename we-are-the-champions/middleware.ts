import { NextResponse } from 'next/server';
import { getToken, JWT } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

interface CustomJWT extends JWT {
  exp: number;
}

export async function middleware(req: NextRequest) {
  const token = (await getToken({ req })) as CustomJWT | null;

  const currentUrl = req.nextUrl.pathname;

  // Redirect to sign-in if no token is found
  if (!token) {
    const signInUrl = `${process.env.NEXT_PUBLIC_URL}/auth/signin?callbackUrl=${encodeURIComponent(currentUrl)}`;
    return NextResponse.redirect(signInUrl);
  }

  const expiryTime = token.exp;
  const currentTime = Math.floor(Date.now() / 1000);


  if (expiryTime < currentTime) {
    const signInUrl = `${process.env.NEXT_PUBLIC_URL}/auth/signin`;
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/logs/:path*"],
};
