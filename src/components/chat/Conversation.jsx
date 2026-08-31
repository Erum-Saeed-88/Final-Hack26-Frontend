import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Conversation = ({ messages }) => {
  const { user } = useContext(AuthContext);

  return (
    <div className="space-y-4 max-h-[400px] overflow-y-auto p-4 bg-teal-700 rounded-xl border-2 border-teal-700">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500 text-sm py-8">No messages yet. Start the conversation!</p>
      ) : (
        messages.map((msg) => {
          const isMe = msg.sender?._id === user?._id;
          return (
            <div key={msg._id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} animate-slide-up`}>
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-xs font-semibold text-gray-400">{msg.sender?.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-700 text-teal-100 uppercase">
                  {msg.sender?.role}
                </span>
              </div>
              <div
                className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm shadow-md ${
                  isMe
                    ? 'bg-btn-gradient text-white rounded-tr-none'
                    : 'bg-cardBg border border-themePurple/30 text-gray-200 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
              <span className="text-[10px] text-gray-500 mt-1">
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          );
        })
      )}
    </div>
  );
};

export default Conversation;