import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.NEXT_AUTH_SECRET;

export async function middleware(req: NextRequest) {
  // Retrieve the token from the request
  const token = await getToken({ req, secret });

  // Define protected routes
  const protectedRoutes = ['/protected', '/homepage']; // Adjust based on your protected routes

  // Get the current path
  const { pathname } = req.nextUrl;

  // Check if the path is protected
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    // Redirect to sign-in page if not authenticated
    return NextResponse.redirect(new URL('/signin', req.url));
  }

  // Allow the request if authenticated or if the route is not protected
  return NextResponse.next();
}

// Adjust the matcher as needed for your routes
export const config = {
  matcher: ['/protected/:path*', '/homepage/:path*'], // Adjust this to match your protected routes
};
