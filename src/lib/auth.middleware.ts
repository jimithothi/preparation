// lib/auth.middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./jwt";
import { errorResponse } from "./api.response";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    [key: string]: unknown;
  };
}

// Generic type for route context (includes params, etc.)
type RouteContext<T = any> = {
  params: T;
};

// Updated withAuth to support params
export function withAuth<T = any>(
  handler: (
    req: AuthenticatedRequest,
    context: RouteContext<T>,
  ) => Promise<NextResponse>,
) {
  return async (req: NextRequest, context: RouteContext<T>) => {
    try {
      // 1️⃣ Check Authorization header
      const authHeader = req.headers.get("authorization");
      let token: string | null = null;

      if (authHeader?.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      } else {
        // 2️⃣ Fallback: check cookie
        token = req.cookies.get("token")?.value || null;
      }

      // No token found
      if (!token) {
        return errorResponse("Unauthorized - No token provided", 401);
      }

      // Verify JWT
      const decoded = verifyToken(token);
      if (!decoded || typeof decoded === "string") {
        return errorResponse("Invalid or expired token", 401);
      }

      // Attach user to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = decoded as any;

      // Call the actual handler with context (params)
      return await handler(authenticatedReq, context);
    } catch (err) {
      return errorResponse("Authentication error", 401, err);
    }
  };
}
