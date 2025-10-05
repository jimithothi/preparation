// lib/validations/question.validation.ts
import { z } from "zod";

// Category enum
export const CategoryEnum = z.enum([
  "Technical",
  "Behavioral",
  "HR",
  "Situational",
  "General",
  "Other",
]);

// Create Question Schema
export const createQuestionSchema = z.object({
  question: z
    .string()
    .min(10, "Question must be at least 10 characters")
    .max(1000, "Question must not exceed 1000 characters")
    .trim(),
  answer: z
    .string()
    .min(10, "Answer must be at least 10 characters")
    .max(5000, "Answer must not exceed 5000 characters")
    .trim(),
  category: CategoryEnum.nullable().optional(),
  tags: z
    .array(
      z
        .string()
        .min(2, "Tag must be at least 2 characters")
        .max(30, "Tag must not exceed 30 characters")
        .trim()
        .toLowerCase(),
    )
    .max(10, "Maximum 10 tags allowed")
    .optional()
    .default([]),
});

// Update Question Schema (all fields optional)
export const updateQuestionSchema = z
  .object({
    question: z
      .string()
      .min(10, "Question must be at least 10 characters")
      .max(1000, "Question must not exceed 1000 characters")
      .trim()
      .optional(),
    answer: z
      .string()
      .min(10, "Answer must be at least 10 characters")
      .max(5000, "Answer must not exceed 5000 characters")
      .trim()
      .optional(),
    category: CategoryEnum.nullable().optional(),
    tags: z
      .array(
        z
          .string()
          .min(2, "Tag must be at least 2 characters")
          .max(30, "Tag must not exceed 30 characters")
          .trim()
          .toLowerCase(),
      )
      .max(10, "Maximum 10 tags allowed")
      .optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

// MongoDB ObjectId Schema
export const mongoIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId");

// Bulk Create Schema
export const bulkCreateSchema = z.object({
  questions: z
    .array(createQuestionSchema)
    .min(1, "At least one question is required")
    .max(100, "Maximum 100 questions allowed in bulk create"),
});
