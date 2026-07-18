import { useState } from "react";
import { Mic, Send } from "lucide-react";
import { sendMessage } from "../Features/sendMessage";
import { useDispatch, useSelector } from "react-redux";
import { setMessages } from "../Redux/messageSlice";

function ChatInput() {
  const [value, setValue] = useState("");
  const dispatch = useDispatch();
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);
  const canSend = value.trim().length > 0 && selectedConversation?._id;

  const handleSendMessage = async () => {
    const prompt = value.trim();
    const userMessage = {
      _id: `user-${Date.now()}`,
      conversationId: selectedConversation._id,
      role: "user",
      content: prompt,
    };
    const nextMessages = [...messages, userMessage];

    const payload = {
      prompt,
      conversationId: selectedConversation._id,
    };

    dispatch(setMessages(nextMessages));
    setValue("");

    const data = await sendMessage(payload);

    if (!data) return;

    const assistantContent =
      typeof data === "string" ? data : data?.content || data?.aiResponse;

    if (!assistantContent) return;

    dispatch(
      setMessages([
        ...nextMessages,
        {
          _id: `assistant-${Date.now()}`,
          conversationId: selectedConversation._id,
          role: "assistant",
          content: assistantContent,
        },
      ]),
    );
  };

  return (
    <div className="w-full overflow-hidden px-3 md:px-5 py-4 border-t border-white/[0.06] bg-[#0d0f14]">
      <div className="flex flex-col gap-2 bg-white/[0.03] border border-white/[0.07] rounded-2xl px-4 pt-3.5 pb-3">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Ask Anything..."
          className="w-full bg-transparent outline-none resize-none text-[14px] text-slate-200 placeholder:text-slate-600 leading-relaxed [scrollbar-width:none] [&::-webkit-scrollbar]:hidden disabled:opacity-50"
          rows={3}
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button className="flex items-center justify-center w-8 h-8 rounded-lg text-slate-600 hover:text-slate-400 hover:bg-white/[0.05] border border-transparent hover:border-white/[0.06] transition-all duration-150 bg-transparent cursor-pointer">
              <Mic size={16} />
            </button>
          </div>
          <button
            disabled={!canSend}
            onClick={handleSendMessage}
            className={`flex items-center justify-center w-8 h-8 rounded-lg border-none transition-all duration-150 text-white ${
              canSend
                ? "cursor-pointer bg-linear-to-br from-indigo-500 to-violet-700 hover:opacity-90"
                : "cursor-not-allowed bg-white/[0.06] text-slate-600"
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatInput;
