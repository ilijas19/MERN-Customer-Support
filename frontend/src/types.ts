export type CurrentUser = {
  fullName: string;
  email: String;
  userId: string;
  role: "admin" | "operator" | "user";
};
