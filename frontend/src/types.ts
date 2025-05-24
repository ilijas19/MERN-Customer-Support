//REUSABLE
export type Roles = "admin" | "operator" | "user";

export type CurrentUser = {
  fullName: string;
  email: string;
  userId: string;
  role: Roles;
};

export type MessageRes = {
  msg: string;
};

export type UserInfo = {
  fullName: string;
  profilePicture: String;
  _id: string;
};

export type User = {
  _id: string;
  fullName: string;
  email: string;
  role: Roles;
  profilePicture: string;
  chats?: Chat[];
  joinedChat?: string | undefined;
  createdAt: Date;
};

export type Chat = {
  _id: string;
  operator: UserInfo;
  user: UserInfo;
  isActive: boolean;
  createdAt: Date;
  lastMessage: Message;
};

export type Message = {
  _id: string;
  chat: string;
  sender: UserInfo;
  type: "message" | "image";
  read: boolean;
  text?: string;
  imageUrl?: string;
  createdAt: Date;
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

//ADMIN
export type GetAllUsersRes = {
  page: number;
  nbHits: number;
  totalUsers: number;
  hasNextPage: boolean;
  users: User[];
};

export type GetAllUsersArg = {
  role: Roles;
  page: number;
  fullName: string;
};
