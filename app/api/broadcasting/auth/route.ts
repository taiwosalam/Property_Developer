import api from "@/services/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const body = {
      socket_id: formData.get("socket_id"),
      channel_name: formData.get("channel_name"),
    };
    const authHeader = req.headers.get("authorization");

    console.log("Broadcast auth request:", {
      body,
      headers: { authorization: authHeader || "missing" },
      rawBody: [...formData.entries()],
    });

    const response = await api.post(
      "/broadcasting/auth",
      {
        socket_id: body.socket_id,
        channel_name: body.channel_name,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader || "",
        },
      }
    );

    console.log("Broadcast auth response:", {
      status: response.status,
      data: response.data,
    });
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Broadcast auth error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });
    return NextResponse.json(
      error.response?.data || { message: "Authentication failed" },
      { status: error.response?.status || 500 }
    );
  }
}
