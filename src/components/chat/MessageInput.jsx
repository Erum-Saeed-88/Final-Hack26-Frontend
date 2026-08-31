import { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage, disabled }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || disabled) return;
    onSendMessage(text);
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mt-4">
      <input
        type="text"
        disabled={disabled}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={disabled ? "Ticket is resolved. Chat disabled." : "Type your reply..."}
        className="flex-grow bg-darkBg/90 border border-themePurple/30 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-themeDeepPink disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={disabled || !text.trim()}
        className="bg-btn-gradient text-white px-4 py-2.5 rounded-xl hover:opacity-90 disabled:opacity-50 flex items-center justify-center shadow-md shadow-themePurple/30"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};

export default MessageInput;