import { NextResponse } from "next/server";

export async function GET() {
  return new NextResponse("Time is " + new Date().toISOString(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
