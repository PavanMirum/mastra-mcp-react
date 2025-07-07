import React, { createContext, useContext, useState, ReactNode } from "react";
import { v4 as uuidv4 } from "uuid";

export type Message = {
  id: string;
  sender: "user" | "agent";
  content: string;
  timestamp: number;
};

interface ChatMemoryContextType {
  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (messageId: string, updates: Partial<Message>) => void;
  conversationId: string;
  threadId: string;
  isLoading: boolean;
  setLoading: (loading: boolean) => void;
}

const ChatMemoryContext = createContext<ChatMemoryContextType | undefined>(undefined);

export const useChatMemory = () => {
  const ctx = useContext(ChatMemoryContext);
  if (!ctx) throw new Error("useChatMemory must be used within a ChatMemoryProvider");
  return ctx;
};

export const ChatMemoryProvider = ({ children }: { children: ReactNode }) => {
  const [conversationId] = useState(() => "conversation-" + uuidv4());
  const [threadId] = useState(() => "thread-" + uuidv4());
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = (message: Message) => {
    setMessages((prev) => [
      ...prev,
      {
        id: message.id,
        sender: message.sender,
        content: message.content,
        timestamp: Date.now(),
      },
    ]);
  };
  console.log({messages});
const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => 
        prev.map(msg => {
          if (msg.id === messageId) {
            // If content is being updated, append the new content
            const content = updates.content !== undefined 
              ? (typeof msg.content === 'string' && typeof updates.content === 'string'
                  ? msg.content + updates.content 
                  : updates.content)
              : msg.content;
              
            return {
              ...msg,
              ...updates,
              content
            };
          }
          return msg;
        })
      );
  };

  return (
    <ChatMemoryContext.Provider 
      value={{ 
        messages, 
        addMessage,
        updateMessage,
        conversationId, 
        threadId,
        isLoading,
        setLoading: setIsLoading
      }}
    >
      {children}
    </ChatMemoryContext.Provider>
  );
};
