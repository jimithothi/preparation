import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import Question from "@/models/question.model";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const users = await Question.find();
    return successResponse(users, "Questions retrieved successfully", 200);
  } catch (err) {
    return errorResponse("Server error", 500, err);
  }
});
