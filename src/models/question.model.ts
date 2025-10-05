import { model, models, Schema } from "mongoose";

const QuestionSchema = new Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
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
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
  },
  { timestamps: true },
);

// Avoid recompiling model if already defined
const Question = models.Question || model("Question", QuestionSchema);
export default Question;
