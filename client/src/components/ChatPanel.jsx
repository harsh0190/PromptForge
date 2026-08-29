import React, { useEffect, useRef } from "react";
import PromptInput from "./PromptInput";

const ChatPanel = ({ messages, onSend, loading }) => {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "auto" });
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 hide-scrollbar">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-zinc-400 text-sm text-center">
              Ask AI to modify your website
            </p>
          </div>
        )}
        {messages.map((msg, i) => (
          <div key={i}>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-zinc-500 mb-1 uppercase tracking-wider">
                {msg.role === "user" ? "You" : "AI"}
              </p>
              <p className="text=[10px] text-zinc-700 leading- tracking-wider whitespace-pre-wrap wrap-break-word">
                {msg.content.split("- ` /").map((text, i) => (
                  <span key={i} className="block mt-1">
                    <span className={i === 0 ? "hidden" : ""}>- ` /</span>
                    {text}
                  </span>
                ))}
              </p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-zinc-200">
        <PromptInput
          onSubmit={onSend}
          loading={loading}
          placeholder="Ask AI to modify..."
          autoFocus
        />
      </div>
    </div>
  );
};

export default ChatPanel;
