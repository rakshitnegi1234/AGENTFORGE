import { useEffect, useRef, useState } from "react";
import { Bot, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import api from "../../Utils/axios";
import { setMessages } from "../Redux/messageSlice";

function MessageList() {
  const dispatch = useDispatch();
  const bottomRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { selectedConversation } = useSelector((state) => state.conversation);
  const { messages } = useSelector((state) => state.message);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation?._id) {
        dispatch(setMessages([]));
        return;
      }

      try {
        setLoading(true);
        setError("");

        const { data } = await api.get(
          `/api/v1/chat/get-message/${selectedConversation._id}`,
        );

        dispatch(setMessages([...data].reverse()));
      } catch (err) {
        console.log(err);
        setError("Unable to load messages.");
        dispatch(setMessages([]));
      } finally {
        setLoading(false);
      }
    };

    loadMessages();
  }, [dispatch, selectedConversation?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!selectedConversation) {
    return (
      <div className="flex-1 flex items-center justify-center px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex flex-col gap-1.5">
            <h1 className="text-[20px] font-semibold text-slate-200 tracking-tight">
              AgentForge
            </h1>
            <p className="text-[15px] font-semibold text-slate-400 tracking-tight">
              How can I help you?
            </p>
            <p className="text-[13px] text-slate-600 max-w-[260px] leading-relaxed">
              Ask me anything - code, ideas, explanations, or just a quick
              question.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mt-1">
            {["Write a Netflix clone", "Explain Redis", "Build a dashboard"].map(
              (suggestion) => (
                <button
                  key={suggestion}
                  className="text-[12px] text-slate-400 bg-white/[0.04] border border-white/[0.07] px-3 py-1.5 rounded-lg hover:bg-white/[0.08] hover:text-slate-200 transition-colors duration-150 cursor-pointer"
                >
                  {suggestion}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="max-w-3xl mx-auto flex flex-col gap-4">
        {loading && (
          <div className="text-center text-[13px] text-slate-500 py-8">
            Loading messages...
          </div>
        )}

        {!loading && error && (
          <div className="text-center text-[13px] text-rose-400 py-8">
            {error}
          </div>
        )}

        {!loading && !error && messages.length === 0 && (
          <div className="text-center text-[13px] text-slate-600 py-8">
            No messages yet.
          </div>
        )}

        {!loading &&
          !error &&
          messages.map((message) => {
            const isUser = message.role === "user";

            return (
              <div
                key={message._id}
                className={`flex gap-3 ${
                  isUser ? "justify-end" : "justify-start"
                }`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-[10px] bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 mt-1">
                    <Bot size={16} />
                  </div>
                )}

                <div
                  className={`max-w-[78%] rounded-2xl px-4 py-3 text-[14px] leading-6 whitespace-pre-wrap break-words border ${
                    isUser
                      ? "bg-indigo-500 text-white border-indigo-400/20"
                      : "bg-white/[0.04] text-slate-200 border-white/[0.07]"
                  }`}
                >
                  {message.content}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-[10px] bg-white/[0.06] border border-white/[0.08] text-slate-400 flex items-center justify-center shrink-0 mt-1">
                    <User size={15} />
                  </div>
                )}
              </div>
            );
          })}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}

export default MessageList;
