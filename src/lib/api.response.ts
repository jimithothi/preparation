import { NextResponse } from "next/server";

interface ResponseOptions {
  status?: number;
  headers?: Record<string, string>;
}

export function successResponse<T>(
  data: T,
  message = "Success",
  status = 200,
  options?: ResponseOptions,
) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
    },
    {
      status,
      headers: options?.headers,
    },
  );
}

export function errorResponse(
  message = "Something went wrong",
  status = 500,
  details?: unknown,
  options?: ResponseOptions,
) {
  return NextResponse.json(
    {
      success: false,
      message,
      ...(details ? { details } : {}),
    },
    {
      status,
      headers: options?.headers,
    },
  );
}
