import { NextResponse } from "next/server";
import connect from "@/lib/mongodb";

export async function GET() {
  await connect();
  return new NextResponse("Time is " + new Date().toISOString(), {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}
