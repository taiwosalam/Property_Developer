import { NextRequest, NextResponse } from "next/server";
import api from "@/services/api";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const response = await api.post("/broadcasting/auth", body, {
      headers: { "Content-Type": "application/json" },
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    return NextResponse.json(
      error.response?.data || { message: "Authentication failed" },
      { status: error.response?.status || 500 }
    );
  }
}
