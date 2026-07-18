import { createSlice } from "@reduxjs/toolkit";

const conversationSlice = createSlice({
  name: "conversation",
  initialState: {
    conversations: [],
    selectedConversation : null
  },
  reducers: {
    setconversations: (state, action) => {
      state.conversations = action.payload;
    },
    addconversation : (state,action) =>
    {
      state.conversations.unshift(action.payload);
    },

    setSelectedConversation : (state,action) =>
    {
       state.selectedConversation = action.payload;
    }
  },
});

export const { setconversations,addconversation ,setSelectedConversation }= conversationSlice.actions;
export default conversationSlice.reducer;