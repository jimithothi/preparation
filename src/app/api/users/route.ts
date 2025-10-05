import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    return successResponse(null, "User registered successfully");
  } catch (err) {
    return errorResponse("Server error", 500, err);
  }
});
