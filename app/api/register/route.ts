import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const res = NextResponse.json({ ok: true, received: body }, { status: 200 });
    res.headers.set("x-hit-register-route", "v2");
    return res;
  } catch {
    const res = NextResponse.json({ error: "Invalid request" }, { status: 400 });
    res.headers.set("x-hit-register-route", "v2");
    return res;
  }
}
