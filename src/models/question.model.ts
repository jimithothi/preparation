import { model, models, Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true, index: true },
    category: {
      type: String,
      trim: true,
      enum: [
        "Technical",
        "Behavioral",
        "HR",
        "Situational",
        "General",
        "Other",
      ],
      default: null,
      required: false,
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
        index: true,
      },
    ],
  },
  { timestamps: true },
);

// Add individual indexes
QuestionSchema.index({ createdAt: 1 });
QuestionSchema.index({ updatedAt: 1 });

// Avoid recompiling model if already defined
const Question = models.Question || model("Question", QuestionSchema);
export default Question;
