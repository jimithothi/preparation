import bcrypt from "bcryptjs";
import { errorResponse, successResponse } from "@/lib/api.response";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";
import { z } from "zod";
import { signToken } from "@/lib/jwt";
import { serialize } from "cookie";

// Zod schema
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();

    // Validate input
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.format();
      return errorResponse("Validation error", 400, errors);
    }
    const { email, password } = parsed.data;

    // Find user with password
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return errorResponse("Invalid email or password", 401);
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return errorResponse("Invalid email or password", 401);
    }

    const token = signToken({ userId: user._id, email: user.email });

    // Set JWT in HttpOnly cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24, // 1 day
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

    return successResponse(
      { userId: user._id, email: user.email, token: token },
      "Login successful",
      200,
      { headers: { "Set-Cookie": cookie } },
    );
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse("Server error", 500, err);
  }
}
