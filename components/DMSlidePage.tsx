
import React, { useState, useEffect, useRef } from 'react';
import { PageProps, ChatMessage } from '../types';
import { CHAT_SOUNDS } from '../constants';
import HomeIcon from './icons/HomeIcon';
import SendIcon from './icons/SendIcon';
import { GoogleGenAI, Chat } from "@google/genai";

const DMSlidePage: React.FC<PageProps> = ({ setCurrentPage, audioControls }) => {
  const { playClip } = audioControls;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      chatRef.current = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: "You are the 'Fudge Judge', a character from a viral video. You are confused, slightly nonsensical, and you mix up modern slang with official-sounding language. You sometimes ask 'Are you a doctor?' or talk about fudge, calling the judge, or sliding in DMs. Keep your responses very short, quirky, and in character."
        },
      });
      setMessages([{ role: 'model', text: "Call the judge... get some fudge? Are you... a doctor?" }]);
    } catch (e) {
      console.error("Gemini initialization failed:", e);
      setError("PARDON?! Couldn't connect to the Fudge Judge. Check your connection or the console.");
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading || !chatRef.current) return;

    playClip(CHAT_SOUNDS.MESSAGE_SENT);
    const newUserMessage: ChatMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoading(true);
    setError(null);

    try {
      const stream = await chatRef.current.sendMessageStream({ message: userInput });
      
      let modelResponse = '';
      let firstChunk = true;
      setMessages(prev => [...prev, { role: 'model', text: '' }]);

      for await (const chunk of stream) {
        if (firstChunk) {
          playClip(CHAT_SOUNDS.MESSAGE_RECEIVED);
          firstChunk = false;
        }
        modelResponse += chunk.text;
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].text = modelResponse;
          return newMessages;
        });
      }
    } catch (err) {
      console.error(err);
      setError("PARDON?! Something went wrong. I'm confused!");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-indigo-700 p-4 md:p-8 flex flex-col">
      <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-4xl font-bold text-white drop-shadow-md">✉️ DM Slide</h2>
          <button
            onClick={() => setCurrentPage('menu')}
            className="bg-white hover:bg-gray-100 text-blue-600 font-bold py-2 px-4 rounded-lg flex items-center gap-2 transition-transform transform hover:scale-105"
          >
            <HomeIcon size={20} />
            Menu
          </button>
        </div>

        <div className="flex-grow bg-white/20 backdrop-blur-md rounded-xl p-4 overflow-y-auto flex flex-col space-y-4 shadow-lg">
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs md:max-w-md p-3 rounded-2xl text-white shadow-md ${msg.role === 'user' ? 'bg-pink-500 rounded-br-none' : 'bg-purple-600 rounded-bl-none'}`}>
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
               <div className="max-w-xs md:max-w-md p-3 rounded-2xl bg-purple-600 rounded-bl-none text-white">
                <div className="flex items-center space-x-1">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.3s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse [animation-delay:-0.15s]"></span>
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                </div>
               </div>
            </div>
          )}
           <div ref={messagesEndRef} />
        </div>
        
        {error && <p className="text-center text-red-300 font-bold mt-2">{error}</p>}
        
        <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder={isLoading ? "The judge is thinking..." : "Slide into the DMs..."}
            className="flex-grow p-3 rounded-xl border-2 border-transparent focus:border-white focus:ring-0 bg-white/30 text-white placeholder-white/70 focus:outline-none transition"
            disabled={isLoading || !!error}
          />
          <button type="submit" disabled={isLoading || !userInput.trim() || !!error} className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl p-3 disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform enabled:hover:scale-110">
            <SendIcon size={24} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default DMSlidePage;
