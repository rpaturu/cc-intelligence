// React import not needed in React 17+
import { Bot } from 'lucide-react';

interface TypingIndicatorProps {
  message?: string;
}

export function TypingIndicator({ message = "AI is thinking..." }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 max-w-4xl mx-auto">
      {/* Avatar */}
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </div>
      
      {/* Typing content */}
      <div className="flex-1 max-w-2xl">
        <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 text-gray-900">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">{message}</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 