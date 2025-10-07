import { connectDB } from "@/lib/db";
import { errorResponse, successResponse } from "@/lib/api.response";
import type { AuthenticatedRequest } from "@/lib/auth.middleware";
import { withAuth } from "@/lib/auth.middleware";
import Question from "@/models/question.model";
type QuestionFilter = Record<string, unknown>;
export const GET = async (req: AuthenticatedRequest) => {
  try {
    await connectDB();

    // Get query parameters from URL
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const tags = searchParams.get("tags");
    const question = searchParams.get("question");

    // Build filter object
    const filter: QuestionFilter = {};

    // Filter by category (exact match)
    if (category) {
      filter.category = category;
    }

    // Filter by tags (matches any tag in array)
    if (tags) {
      const tagArray = tags.split(",").map((tag) => tag.trim().toLowerCase());
      filter.tags = { $in: tagArray };
    }

    // Filter by question (partial match, case-insensitive)
    if (question) {
      filter.question = { $regex: question, $options: "i" };
    }

    // Execute query with filters
    const questions = await Question.find(filter).sort({ createdAt: 1 });

    return successResponse(
      questions,
      `Questions retrieved successfully (${questions.length} found)`,
      200,
    );
  } catch (err) {
    console.error("Questions API ERROR:", err);
    return errorResponse("Questions API ERROR:", 500, err);
  }
};
