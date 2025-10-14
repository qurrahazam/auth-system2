import { NextResponse } from "next/server";
import { HTTP_STATUS, HttpStatusCode } from "./HttpStatus";

interface ApiResponseOptions {
  status?: HttpStatusCode;
  message?: string;
  data?: any;
  error?: string;
}

export function successResponse({
  data,
  message = "Success",
  status = HTTP_STATUS.OK,
}: ApiResponseOptions) {
  return NextResponse.json(
    {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}

export function errorResponse({
  error,
  message = "Error",
  status = HTTP_STATUS.SERVER_ERROR,
}: ApiResponseOptions) {
  return NextResponse.json(
    {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
    },
    { status }
  );
}
