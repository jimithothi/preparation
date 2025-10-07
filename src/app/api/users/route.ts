import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import User from "@/models/user.model";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    const users = await User.find();

    return successResponse(users, "Users retrieved successfully", 200);
  } catch (err) {
    console.error("Users API ERROR:", err);
    return errorResponse("Users API ERROR:", 500, err);
  }
});
