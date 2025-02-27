import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { company_status } = await req.json();

    if (!company_status) {
      return NextResponse.json(
        { message: 'Company status is required' },
        { status: 400 }
      );
    }

    // Set the company_status cookie securely
    const response = NextResponse.json(
      { message: 'Company status cookie set successfully' },
      { status: 200 }
    );
    response.cookies.set('company_status', company_status, {
      httpOnly: true, // Makes it inaccessible to JavaScript
      secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
      sameSite: 'strict', // Protects against (CSRF) attacks
      path: '/', // Makes the cookie available to the entire site
      maxAge: 60 * 60 * 168, // Cookie will expire after 7 days
    });

    return response;
  } catch (error) {
    console.error('Error setting company status cookie:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
