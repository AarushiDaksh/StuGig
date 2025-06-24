'use client';
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { marked } from 'marked';
import { SendIcon } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";

interface ChatMessage {
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const SYSTEM_PROMPT = `You are StuGig's virtual assistant. Your job is to provide helpful, accurate, and relevant answers ONLY about StuGig's services and features.

ABOUT STUGIG:
- StuGig is a freelance job marketplace built for students to offer services like design, assignment help, resume building, etc.
- Students can post jobs, bid on gigs, chat in real-time, and receive payments securely.
- The platform uses an AI-powered matchmaking system to suggest best-fit jobs and freelancers based on skills, history, and feedback.

KEY FEATURES:
1. Post & Bid on Jobs: Freelancers apply with quotes; clients hire.
2. Live Chat: Real-time messaging with file sharing.
3. Secure Payments: Stripe-powered, platform takes 15% commission.
4. Ratings & Reviews: Feedback after job completion.
5. AI Matchmaker: Suggests top jobs or freelancers based on compatibility.

INSTRUCTIONS:
1. ONLY answer queries related to StuGig’s freelance platform, bidding, chat, dashboards, payments, roles, or AI features.
2. For unrelated topics, respond with: "I'm StuGig's assistant and can only help with questions about freelancing, gigs, or our platform services. Want to post a job or explore AI-matched gigs?"
3. Keep your tone student-friendly, professional, and helpful.`;

const EXAMPLE_QUESTIONS = [
  'How do I post a job on StuGig?',
  'Can I apply for multiple gigs?',
  'How does the AI Matchmaker work?',
  'Is there a commission fee?',
  'What kind of services can I offer?'
];

const ChatBot = () => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      content: "👋 Hi! I'm StuGig's assistant here to guide you through our freelance platform. Ask me anything about posting jobs, bidding, dashboards, payments, or how to use our AI Matchmaker. Ready to freelance smarter?",
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messageContainerRef = useRef<HTMLDivElement>(null);
  const userInputRef = useRef<HTMLTextAreaElement>(null);
  const generativeClient = useRef<GoogleGenerativeAI | null>(null);
  const modelRef = useRef<any>(null);
  const chatRef = useRef<any>(null);

  useEffect(() => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return;
    generativeClient.current = new GoogleGenerativeAI(apiKey);
    modelRef.current = generativeClient.current.getGenerativeModel({
      model: 'gemini-1.5-flash',
      systemInstruction: SYSTEM_PROMPT,
    });
    chatRef.current = modelRef.current.startChat({ history: [] });
  }, []);

  const sendMessage = async () => {
    const message = userInput.trim();
    if (!message) return;
    const newUserMsg: ChatMessage = { content: message, isUser: true, timestamp: new Date() };
    setChatHistory(prev => [...prev, newUserMsg]);
    setUserInput('');
    setIsTyping(true);

    try {
      const result = await chatRef.current.sendMessageStream(message);
      let fullResponse = "";
      for await (const chunk of result.stream) {
        const text = chunk.text ? chunk.text() : "";
        fullResponse += text;
        setChatHistory(prev => {
          const lastMsg = prev[prev.length - 1];
          if (!lastMsg.isUser) {
            const updated = [...prev];
            updated[prev.length - 1] = { ...lastMsg, content: marked(fullResponse) };
            return updated;
          }
          return [...prev, { content: marked(fullResponse), isUser: false, timestamp: new Date() }];
        });
      }
    } catch (err) {
      setChatHistory(prev => [...prev, { content: "Oops! Something went wrong. Please try again.", isUser: false, timestamp: new Date() }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div ref={messageContainerRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatHistory.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.isUser ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${msg.isUser ? 'bg-primary text-white' : 'bg-muted text-foreground'}`}>
              <div dangerouslySetInnerHTML={{ __html: marked(msg.content) }} />
            </div>
          </div>
        ))}
        {isTyping && <Skeleton className="w-16 h-4" />}
      </div>

      <div className="p-3 bg-background border-t border-border">
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
          <Textarea
            ref={userInputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Ask something about StuGig..."
            className="flex-1 text-sm"
          />
          <Button type="submit" disabled={isTyping || !userInput.trim()} size="icon">
            <SendIcon className="w-4 h-4" />
          </Button>
        </form>
        <div className="flex flex-wrap gap-2 mt-2">
          {EXAMPLE_QUESTIONS.map((q, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => { setUserInput(q); sendMessage(); }}
            >
              {q}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
