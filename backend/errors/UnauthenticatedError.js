import CustomApiError from "./CustomApiError.js";
import { StatusCodes } from "http-status-codes";

class UnauthenticatedError extends CustomApiError {
  constructor(message) {
    super(message);
    this.statusCode = StatusCodes.UNAUTHORIZED;
  }
}

export default UnauthenticatedError;
