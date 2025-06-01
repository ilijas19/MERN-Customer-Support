import { apiSlice } from "./apiSlice";
import { CHAT_URL } from "../constants";
import type {
  Chat,
  CreateChatRes,
  getChatMessagesRes,
  GetMyChatsArg,
  GetMyChatsRes,
  getMyMessagesArg,
  MessageRes,
} from "../../types";

const operatorApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createChat: builder.mutation<CreateChatRes, { userId: string }>({
      query: ({ userId }) => ({
        url: `${CHAT_URL}`,
        method: "POST",
        body: { userId },
      }),
    }),
    getMyChats: builder.query<GetMyChatsRes, GetMyChatsArg>({
      query: ({ page = 1, isActive }) => ({
        url: `${CHAT_URL}?page=${page}&isActive=${isActive}`,
      }),
    }),
    getSingleChat: builder.query<Chat, string>({
      query: (chatId) => ({
        url: `${CHAT_URL}/${chatId}`,
      }),
    }),
    deleteChat: builder.mutation<MessageRes, string>({
      query: (chatId) => ({
        url: `${CHAT_URL}/${chatId}`,
        method: "DELETE",
      }),
    }),
    closeChat: builder.mutation<MessageRes, string>({
      query: (chatId) => ({
        url: `${CHAT_URL}/close/${chatId}`,
        method: "POST",
      }),
    }),
    openChat: builder.mutation<MessageRes, string>({
      query: (chatId) => ({
        url: `${CHAT_URL}/open/${chatId}`,
        method: "POST",
      }),
    }),
    getChatMessages: builder.query<getChatMessagesRes, getMyMessagesArg>({
      query: ({ page = 1, chatId }) => ({
        url: `${CHAT_URL}/messages/${chatId}?page=${page}`,
      }),
    }),
  }),
});

export const {
  useCreateChatMutation,
  useGetMyChatsQuery,
  useGetSingleChatQuery,
  useDeleteChatMutation,
  useCloseChatMutation,
  useOpenChatMutation,
  useGetChatMessagesQuery,
} = operatorApiSlice;
