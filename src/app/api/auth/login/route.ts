import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { errorResponse, successResponse } from "@/lib/api.response";
import { connectDB } from "@/lib/db";
import User from "@/models/user.model";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

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

    return successResponse(
      { userId: user._id, email: user.email },
      "Login successful",
    );
  } catch (err) {
    console.error("Login Error:", err);
    return errorResponse("Server error", 500, err);
  }
}
