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

    // Set the role as a cookie
    const response = NextResponse.json(
      { message: 'Role set successfully' },
      { status: 200 }
    );
    response.cookies.set('role', role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
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
