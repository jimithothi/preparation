import { errorResponse } from "@/lib/api.response";

// Catch-all route for undefined API endpoints
export async function GET() {
  return errorResponse("API endpoint not found", 404);
}

export async function POST() {
  return errorResponse("API endpoint not found", 404);
}

export async function PUT() {
  return errorResponse("API endpoint not found", 404);
}

export async function DELETE() {
  return errorResponse("API endpoint not found", 404);
}

export async function PATCH() {
  return errorResponse("API endpoint not found", 404);
}
