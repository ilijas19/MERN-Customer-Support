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
  profilePicture: string;
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
// USER
export type UpdateProfileArgs = {
  fullName?: string;
  email?: string;
  profilePicture?: string;
};

export type UpdatePasswordArgs = {
  oldPassword?: string;
  newPassword?: string;
  reNewPassword?: string;
};

export type UploadRes = {
  msg: string;
  url: string;
};
// OPERATOR
export type CreateChatRes = MessageRes & {
  chat: Chat;
};

export type GetMyChatsRes = {
  page: number;
  totalChats: number;
  hasNextPage: boolean;
  chats: Chat[];
};

export type getChatMessagesRes = Omit<GetMyChatsRes, "chats"> & {
  messages: Message[];
};

// USER
export type UserChatRes = {
  page: number;
  hasNextPage: boolean;
  nbHits: number;
  chat: Chat;
  chatMessages: Message[];
};

export type getMyMessagesRes = {
  page: number;
  hasNextPage: boolean;
  nbHits: number;
  chatMessages: Message[];
};

export type getMyMessagesArg = {
  page: number;
  chatId: string;
};
