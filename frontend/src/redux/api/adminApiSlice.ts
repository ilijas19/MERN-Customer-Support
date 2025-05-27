import type {
  Chat,
  GetAllUsersArg,
  GetAllUsersRes,
  MessageRes,
  RegisterArgs,
  User,
} from "../../types";
import { ADMIN_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const adminApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<GetAllUsersRes, GetAllUsersArg>({
      query: ({ page = 1, role = "", fullName = "" }) => ({
        url: `${ADMIN_URL}/users/?page=${page}&role=${role}&fullName=${fullName}`,
      }),
    }),
    getSingleUser: builder.query<User, string>({
      query: (userId) => ({
        url: `${ADMIN_URL}/user/${userId}`,
      }),
    }),
    createOperatorAccount: builder.mutation<MessageRes, RegisterArgs>({
      query: ({ fullName, email, password }) => ({
        url: `${ADMIN_URL}/operator`,
        method: "POST",
        body: { fullName, email, password },
      }),
    }),
    getOperatorChats: builder.query<Chat[], string>({
      query: (operatorId) => ({
        url: `${ADMIN_URL}/operatorChats/${operatorId}`,
      }),
    }),
    getSingleChat: builder.query<Chat, string>({
      query: (chatId) => ({
        url: `${ADMIN_URL}/chat/${chatId}`,
      }),
    }),
    deleteAccount: builder.mutation<MessageRes, string>({
      query: (userId) => ({
        url: `${ADMIN_URL}/user/${userId}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetSingleUserQuery,
  useCreateOperatorAccountMutation,
  useGetOperatorChatsQuery,
  useGetSingleChatQuery,
  useDeleteAccountMutation,
} = adminApiSlice;
