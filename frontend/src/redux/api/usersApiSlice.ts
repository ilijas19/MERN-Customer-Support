import type {
  getMyMessagesArg,
  getMyMessagesRes,
  MessageRes,
  UpdatePasswordArgs,
  UpdateProfileArgs,
  User,
  UserChatRes,
} from "../../types";
import { USER_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getMyProfile: builder.query<User, void>({
      query: () => ({
        url: `${USER_URL}`,
      }),
    }),
    updateProfile: builder.mutation<MessageRes, UpdateProfileArgs>({
      query: (data) => ({
        url: `${USER_URL}`,
        method: "PATCH",
        body: data,
      }),
    }),
    deleteProfile: builder.mutation<MessageRes, { password: string }>({
      query: ({ password }) => ({
        url: `${USER_URL}`,
        method: "DELETE",
        body: { password },
      }),
    }),
    updatePassword: builder.mutation<MessageRes, UpdatePasswordArgs>({
      query: ({ oldPassword, newPassword, reNewPassword }) => ({
        url: `${USER_URL}/updatePassword`,
        method: "PATCH",
        body: { oldPassword, newPassword, reNewPassword },
      }),
    }),
    getMyChat: builder.query<UserChatRes, { page: number }>({
      query: ({ page = 1 }) => ({
        url: `${USER_URL}/myChat?page=${page}`,
      }),
    }),
    getMyMessages: builder.query<getMyMessagesRes, getMyMessagesArg>({
      query: ({ page = 1, chatId }) => ({
        url: `${USER_URL}/myMessages/${chatId}?page=${page}`,
      }),
    }),
  }),
});

export const {
  useGetMyProfileQuery,
  useUpdateProfileMutation,
  useDeleteProfileMutation,
  useUpdatePasswordMutation,
  useGetMyChatQuery,
  useGetMyMessagesQuery,
} = usersApiSlice;
