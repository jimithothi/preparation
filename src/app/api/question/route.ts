import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import Question from "@/models/question.model";
import { createQuestionSchema } from "./question.validation";
import { revalidatePath, revalidateTag } from "next/cache";

export const POST = withAuth(async (req: AuthenticatedRequest) => {
  try {
    await connectDB();
    const body = await req.json();
    // Validate input
    const parsed = createQuestionSchema.safeParse(body);
    if (!parsed.success) {
      const errors = parsed.error.format();
      return errorResponse("Validation error", 400, errors);
    }
    const question = await Question.create(parsed.data);
    revalidateTag("questions");
    return successResponse(question, "Question created successfully");
  } catch (err) {
    console.error("Create Question API ERROR:", err);
    return errorResponse("Create Question API ERROR:", 500, err);
  }
});
