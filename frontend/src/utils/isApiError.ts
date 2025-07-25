export type ApiError = {
  data: {
    msg: string;
  };
};

export const isApiError = (error: unknown): error is ApiError => {
  if (
    error &&
    typeof error === "object" &&
    "data" in error &&
    typeof error.data === "object" &&
    error.data &&
    "msg" in error.data
  ) {
    return true;
  }
  return false;
};
