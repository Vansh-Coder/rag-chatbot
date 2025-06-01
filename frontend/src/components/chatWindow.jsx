"use client";

import { useState, useEffect, useRef } from "react";
import { TextGenerateEffect } from "./ui/textGenerateEffect";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function ChatWindow({ hasDocs, idToken }) {
  const [messages, setMessages] = useState([]); // chat history
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const messagesEndRef = useRef(null);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    if (!hasDocs) {
      setError("Please upload documents first.");
      return;
    }

    setError(null);
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(`${BACKEND_URL}/query`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ question: userMessage.content }),
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.detail || "API request failed");
      }
      const data = await response.json();
      setMessages((prev) => [...prev, { role: "bot", content: data.answer }]);
    } catch (err) {
      console.error(err);
      setError(err.message || "Chat error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col">
      <h2 className="mb-4 text-center text-lg font-semibold text-white">
        Ask EduBot
      </h2>

      <div className="mb-8 flex max-h-[75vh] flex-1 flex-col space-y-4 overflow-y-auto pr-7 scrollbar-thin scrollbar-track-gray-800 scrollbar-thumb-gray-600">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-[90%] rounded-lg p-3 text-sm tracking-wide ${
              msg.role === "user"
                ? "self-end bg-gray-600 text-white"
                : "self-start bg-gray-700 text-white"
            }`}
          >
            {msg.role === "user" ? (
              msg.content
            ) : (
              <TextGenerateEffect
                duration={0.5}
                filter={false}
                words={msg.content}
              />
            )}
          </div>
        ))}

        {isLoading && (
          <div className="italic text-gray-400">EduBot is thinking...</div>
        )}

        {error && <div className="text-red-500">{error}</div>}

        <div ref={messagesEndRef} />
      </div>

      {!hasDocs && (
        <div className="mb-2 text-center text-yellow-300">
          Please upload documents first.
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage();
            }
          }}
          placeholder={
            hasDocs ? "Type your question..." : "Upload documents to start"
          }
          disabled={!hasDocs || isLoading}
          className={`flex-1 rounded border border-gray-600 bg-gray-800 px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-500 ${
            !hasDocs ? "cursor-not-allowed opacity-50" : ""
          }`}
        />
        <button
          onClick={handleSendMessage}
          disabled={!hasDocs || isLoading || !input.trim()}
          className={`rounded px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-gray-400 ${
            !hasDocs || isLoading || !input.trim()
              ? "cursor-not-allowed bg-gray-600 opacity-50"
              : "bg-gray-600 hover:bg-gray-500"
          }`}
        >
          {isLoading ? "Sending…" : "Send"}
        </button>
      </div>
    </div>
  );
}
