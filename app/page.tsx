"use client";

import { useState, useEffect, useRef, FormEvent, ChangeEvent } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import Image from "next/image";
import Wave from "./(components)/wave-bg"; // Ensure the correct import path

export default function Home() {
  const [password, setPassword] = useState<string>("");
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const correctPassword: string = process.env.NEXT_PUBLIC_PASSWORD as string;

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: inputValue }]);
    setInputValue("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: inputValue }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessages((prev) => [...prev, { role: "assistant", content: data.response }]);
      } else {
        console.error("Error:", data.error);
        setMessages((prev) => [...prev, { role: "assistant", content: "Error: " + data.error }]);
      }
    } catch (error) {
      console.error("An unexpected error occurred:", error);
      setMessages((prev) => [...prev, { role: "assistant", content: "An unexpected error occurred." }]);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="relative flex flex-col items-center justify-center h-screen w-screen bg-gray-900 text-white overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full z-0">
          <Wave />
        </div>
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-lg font-semibold mb-4 z-10">
          Enter Password
        </motion.h1>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center z-10">
          <input
            className="outline-none rounded-md p-2 mb-2 bg-gray-800 text-white"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Submit</button>
        </form>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col items-center h-screen w-screen bg-gray-900 text-white overflow-hidden p-4">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Wave />
      </div>
      <div className="w-full max-w-3xl flex flex-col space-y-4 h-full z-10 overflow-hidden">
        <div className="flex flex-col space-y-4 overflow-y-auto h-full px-6 pb-6 pt-6 scrollbar-hide">
          {messages.map((msg, index) => (
            <div key={index} className={`flex items-start space-x-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <Image src="/profile-picture.jpg" alt="Cat Avatar" width={40} height={40} className="rounded-full mr-2" />
              )}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-4 rounded-lg max-w-full bg-gray-700 self-start`}
                style={{ wordBreak: "break-word" }}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </motion.div>
            </div>
          ))}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 1 }} className="self-start text-gray-400 text-2xl">
              ...
            </motion.div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-md z-10">
          <form onSubmit={handleSubmit} className="flex items-center space-x-2">
            <input
              className="flex-grow p-3 rounded-md bg-gray-700 text-white outline-none"
              type="text"
              value={inputValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
              placeholder="Type your message..."
              required
            />
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50">
              {loading ? "Thinking..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
