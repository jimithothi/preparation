import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import Question from "@/models/question.model";
import { mongoIdSchema, updateQuestionSchema } from "../question.validation";
import { revalidateTag } from "next/cache";

export const PUT = withAuth(
  async (
    req: AuthenticatedRequest,
    context: { params: Promise<{ id: string }> },
  ) => {
    try {
      await connectDB();
      const { id } = await context.params;

      // 1️⃣ Validate MongoDB ObjectId
      const idValidation = mongoIdSchema.safeParse(id);
      if (!idValidation.success) {
        return errorResponse(
          "Invalid question ID format",
          400,
          idValidation.error.format(),
        );
      }

      const body = await req.json();
      // Validate input
      const parsed = updateQuestionSchema.safeParse(body);
      if (!parsed.success) {
        const errors = parsed.error.format();
        return errorResponse("Validation error", 400, errors);
      }
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        parsed.data,
        { new: true, runValidators: true },
      );

      if (!updatedQuestion) {
        return errorResponse("Question not found", 404);
      }
      revalidateTag("questions");

      return successResponse(updatedQuestion, "Question updated successfully");
    } catch (err) {
      console.error("Update Question API ERROR:", err);
      return errorResponse("Update Question API ERROR:", 500, err);
    }
  },
);
