import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { expired_company_subscription } = body;

    if (expired_company_subscription === undefined) {
      return NextResponse.json(
        { message: "expired_company_subscription is required" },
        { status: 400 }
      );
    }

    if (typeof expired_company_subscription !== "boolean") {
      return NextResponse.json(
        { message: "expired_company_subscription must be a boolean" },
        { status: 400 }
      );
    }

    const response = NextResponse.json(
      { message: "Company subscription status cookie set successfully" },
      { status: 200 }
    );

    response.cookies.set(
      "expired_company_subscription",
      String(expired_company_subscription),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 168, // 7 days
      }
    );

    return response;
  } catch (error) {
    console.error("Error setting company subscription status cookie:", error);
    return NextResponse.json(
      {
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
