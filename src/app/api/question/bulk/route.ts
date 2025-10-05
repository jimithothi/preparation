import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import Question from "@/models/question.model";
import { bulkCreateSchema } from "../question.validation";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    // Validate input
    const parsed = bulkCreateSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.format();
      return errorResponse("Validation error", 400, errors);
    }
    const questions = await Question.insertMany(parsed.data.questions);
    return successResponse(questions, "Questions created successfully");
  } catch (err) {
    console.error("Register Error:", err);
    return errorResponse("Server error", 500, err);
  }
});
