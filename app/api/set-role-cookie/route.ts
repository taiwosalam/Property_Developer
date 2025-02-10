// `/pages/api/set-role-cookie.ts`
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { role } = await req.json();

    if (!role) {
      return NextResponse.json(
        { message: 'Role is required' },
        { status: 400 }
      );
    }

    // Set the role cookie securely
    const response = NextResponse.json(
      { message: 'Role cookie set successfully' },
      { status: 200 }
    );
    response.cookies.set('role', role, {
      httpOnly: true, // Makes it inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Protects against (CSRF) attacks
      path: '/', // Makes the cookie available to the entire site
      maxAge: 60 * 60 * 168, // Cookie will expire after 7 days
    });

    return response;
  } catch (error) {
    console.error('Error setting role cookie:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
