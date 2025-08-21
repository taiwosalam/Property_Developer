import { NextResponse } from "next/server";
export async function POST(req: Request) {
    const { token } = await req.json();
    if (!token) {
        return NextResponse.json({ error: "Token required" }, { status: 400 });
    }
    const res = NextResponse.json({ success: true });
    // Store token in HttpOnly cookie
    res.cookies.set({
        name: "auth-token",
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return res;
}
