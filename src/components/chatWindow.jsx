"use client";
import { useState } from "react";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate bot reply
    setTimeout(() => {
      const botReply = {
        role: "bot",
        content: `You said: "${userMessage.content}"`,
      };
      setMessages((prev) => [...prev, botReply]);
      setIsLoading(false);
    }, 1000);

    // Replace the above with a fetch to your chatbot backend
  };

  return (
    <>
      <h2 className="mb-4 text-center text-lg font-semibold">
        Ask the Chatbot
      </h2>
      <div className="mb-4 flex-1 space-y-2 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[80%] rounded p-2 ${
              msg.role === "user"
                ? "self-end bg-blue-100 text-right"
                : "self-start bg-gray-200 text-left"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {isLoading && (
          <div className="italic text-gray-500">Bot is thinking...</div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Type your question..."
          className="flex-1 rounded border px-3 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </>
  );
}
