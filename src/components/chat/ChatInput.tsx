import React, { useState, useRef } from 'react';
import { Send, Loader, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  disabled?: boolean;
}

export function ChatInput({ onSendMessage, isLoading = false, placeholder = "Type your message...", disabled = false }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-3 flex-row-reverse">
        {/* User Avatar - matches message bubble styling */}
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-medium">
          <User className="w-4 h-4" />
        </div>

        {/* Input Area - distinct styling from user message bubbles */}
        <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
          <div className="bg-white border-2 border-blue-200 hover:border-blue-300 focus-within:border-blue-400 rounded-2xl px-3 py-2 text-sm shadow-sm transition-colors ml-auto">
        <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleTextareaChange}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              className={cn(
                  "flex-1 bg-transparent text-gray-900 placeholder-gray-500 resize-none focus:outline-none text-sm leading-relaxed",
                  "min-h-[20px] max-h-20 overflow-y-auto",
                  (disabled || isLoading) && "cursor-not-allowed opacity-50"
              )}
              rows={1}
            />
          <button
            type="submit"
            disabled={!message.trim() || isLoading || disabled}
            className={cn(
                  "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center transition-colors ml-1",
                  message.trim() && !isLoading && !disabled
                    ? "bg-blue-500 text-white hover:bg-blue-600" 
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
            )}
          >
            {isLoading ? (
                  <Loader className="w-3 h-3 animate-spin" />
            ) : (
                  <Send className="w-3 h-3" />
            )}
          </button>
        </div>
          </div>
          <div className="text-xs text-gray-500 mt-1 text-right">
          Press Enter to send, Shift+Enter for new line
          </div>
        </div>
        </div>
      </form>
  );
} 