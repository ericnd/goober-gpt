"use client";
import { useState, FormEvent, ChangeEvent } from 'react';
import ReactMarkdown from 'react-markdown';

export default function Home() {
  // State for the password and inputs
  const [password, setPassword] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [inputValue1, setInputValue1] = useState<string>(''); // For the response
  const [inputValue2, setInputValue2] = useState<string>(''); // For the user's prompt
  const [loading, setLoading] = useState<boolean>(false);

  const correctPassword: string = process.env.NEXT_PUBLIC_PASSWORD as string; // Set your password here

  const handlePasswordSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password');
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: inputValue2 }),
      });

      const data = await res.json();

      if (res.ok) {
        setInputValue1(data.response); // Display the response in the top input box
        setInputValue2(''); // Clear the input field
      } else {
        console.error('Error:', data.error);
        setInputValue1('Error: ' + data.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setInputValue1('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-lg font-semibold mb-4">Enter Password</h1>
        <form onSubmit={handlePasswordSubmit} className="flex flex-col items-center">
          <input
            className="outline rounded-md p-2 mb-2"
            type="password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-row items-start w-full max-w-6xl">
        <img src="/profile-picture.jpg" className="w-1/6 pt-20 min-w-[150px] object-cover cursor-grab" alt="Profile" />
        <div className="px-8 py-16 flex-grow">
          <div
            className="h-[250px] w-full outline rounded-md p-2 overflow-y-auto bg-white"
          >
            <ReactMarkdown>{inputValue1}</ReactMarkdown>
          </div>
        </div>
      </div>
      <div className="w-full max-w-6xl px-8">
        <h1 className="text-lg font-semibold">Speak to gooberGPT :3</h1>
        <form onSubmit={handleSubmit} className="flex flex-row items-center space-x-2">
          <input
            className="w-full outline rounded-md p-2"
            type="text"
            value={inputValue2}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setInputValue2(e.target.value)}
            placeholder="Type your message..."
            required
          />
          <button
            type="submit"
            disabled={loading || !inputValue2.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
}
