import type {
  CurrentUser,
  LoginArgs,
  LoginRes,
  MessageRes,
  RegisterArgs,
} from "../../types";
import { AUTH_URL } from "../constants";
import { apiSlice } from "./apiSlice";

const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    register: builder.mutation<MessageRes, RegisterArgs>({
      query: ({ fullName, email, password }) => ({
        url: `${AUTH_URL}/register`,
        method: "POST",
        body: { fullName, email, password },
      }),
    }),
    login: builder.mutation<LoginRes, LoginArgs>({
      query: ({ email, password }) => ({
        url: `${AUTH_URL}/login`,
        method: "POST",
        body: { email, password },
      }),
    }),
    logout: builder.mutation<MessageRes, void>({
      query: () => ({
        url: `${AUTH_URL}/logout`,
        method: "DELETE",
      }),
    }),
    getCurrentUser: builder.query<{ currentUser: CurrentUser }, void>({
      query: () => ({
        url: `${AUTH_URL}/me`,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApiSlice;
