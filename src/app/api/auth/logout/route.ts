import { successResponse } from "@/lib/api.response";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    // Clear the HttpOnly token cookie
    const cookie = serialize("token", "", {
      httpOnly: true,
      path: "/",
      maxAge: 0, // Expire immediately
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return successResponse(
      { message: "Logged out successfully" },
      "Logout successful",
      200,
      { headers: { "Set-Cookie": cookie } }
    );
  } catch (err) {
    console.error("Logout API ERROR:", err);
    return successResponse(
      { message: "Logged out" },
      "Logout completed",
      200
    );
  }
}
