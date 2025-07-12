import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
    onSendMessage: (content: string) => void;
    disabled?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({
    onSendMessage,
    disabled = false,
}) => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Handle typing indicator
    useEffect(() => {
        if (message.length > 0 && !isTyping) {
            setIsTyping(true);
        } else if (message.length === 0 && isTyping) {
            setIsTyping(false);
        }
    }, [message, isTyping]);

    // Auto-resize textarea
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
        }
    }, [message]);

    const handleSend = () => {
        if (message.trim() && !disabled) {
            onSendMessage(message.trim());
            setMessage('');
            setIsTyping(false);

            // Reset textarea height
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex items-end gap-3">
                {/* Message input */}
                <div className="flex-1 relative">
                    <textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        disabled={disabled}
                        className="w-full resize-none rounded-2xl bg-gray-100 py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 max-h-32"
                        rows={1}
                    />
                </div>
                {/* Send button */}
                <button
                    onClick={handleSend}
                    disabled={!message.trim() || disabled}
                    className="p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Send size={18} />
                </button>
            </div>
        </div>
    );
};

export default MessageInput; 