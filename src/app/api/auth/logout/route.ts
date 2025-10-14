import { successResponse, errorResponse } from "@/lib/ApiResponse";
import { HTTP_STATUS } from "@/lib/HttpStatus";

export async function POST() {
  try {
    const res = successResponse({
      data: null,
      message: "Logged out",
      status: HTTP_STATUS.OK,
    });
    res.cookies.set("token", "", { httpOnly: true, expires: new Date(0) });
    return res;
  } catch (err: any) {
    return errorResponse({
      error: err.message || "Server error. Please try again later.",
      message: "Logout failed",
      status: HTTP_STATUS.SERVER_ERROR,
    });
  }
}
