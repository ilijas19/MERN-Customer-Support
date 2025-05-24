export type CurrentUser = {
  fullName: string;
  email: string;
  userId: string;
  role: "admin" | "operator" | "user";
};

export type MessageRes = {
  msg: string;
};

//AUTH
export type RegisterArgs = {
  fullName: string;
  email: string;
  password: string;
};

export type LoginArgs = Omit<RegisterArgs, "fullName">;

export type LoginRes = MessageRes & {
  currentUser: CurrentUser;
};
