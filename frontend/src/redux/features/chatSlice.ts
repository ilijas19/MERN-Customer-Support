import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Chat } from "../../types";

type ChatState = {
  selectedChat: Chat | null;
};

const initialState: ChatState = {
  selectedChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setSelectedChat: (state, action: PayloadAction<Chat>) => {
      state.selectedChat = action.payload;
    },
    clearSelectedChat: (state) => {
      state.selectedChat = null;
    },
  },
});

export const { setSelectedChat, clearSelectedChat } = chatSlice.actions;
export default chatSlice.reducer;
