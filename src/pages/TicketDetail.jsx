import { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import Conversation from '../components/chat/Conversation';
import MessageInput from '../components/chat/MessageInput';
import Loader from '../components/common/Loader';
import { ArrowLeft, CheckCircle2, ShieldCheck, Tag, AlertCircle } from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  const [ticket, setTicket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [resolutionNote, setResolutionNote] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTicketAndMessages();
  }, [id]);

  useEffect(() => {
    if (!socket || !id) return;

    socket.emit('join_ticket', id);

    socket.on('new_message', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('ticket_updated', (updatedT) => {
      setTicket(updatedT);
    });

    return () => {
      socket.emit('leave_ticket', id);
      socket.off('new_message');
      socket.off('ticket_updated');
    };
  }, [socket, id]);

  const fetchTicketAndMessages = async () => {
    try {
      const [tRes, mRes] = await Promise.all([
        API.get(`/tickets/${id}`),
        API.get(`/messages/${id}`),
      ]);
      setTicket(tRes.data);
      setMessages(mRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (text) => {
    try {
      await API.post('/messages', { ticketId: id, text });
    } catch (err) {
      alert(err.response?.data?.message || 'Error sending message');
    }
  };

  const handleResolveTicket = async (e) => {
    e.preventDefault();
    if (!resolutionNote.trim()) return alert('Resolution note is required');

    try {
      const { data } = await API.put(`/tickets/${id}/resolve`, { resolutionNote });
      setTicket(data);
    } catch (err) {
      alert(err.response?.data?.message || 'Error resolving ticket');
    }
  };

  if (loading) return <Loader />;
  if (!ticket) return <div className="text-center text-white mt-20">Ticket not found</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Ticket Info & Resolution */}
        <div className="space-y-6">
          <div className="bg-cardBg border border-themePurple/20 rounded-2xl p-6 shadow-xl">
            <span className="text-xs font-mono text-themeBurlywood font-bold">{ticket.ticketNumber}</span>
            <h1 className="text-xl font-bold text-white mt-1 mb-3">{ticket.subject}</h1>

            <div className="space-y-2 text-xs text-gray-300 border-t border-themePurple/10 pt-4">
              <div className="flex items-center justify-between">
                <span>Status:</span>
                <b className="text-themeDeepPink">{ticket.status}</b>
              </div>
              <div className="flex items-center justify-between">
                <span>Category:</span>
                <b className="text-themePurple">{ticket.category}</b>
              </div>
              <div className="flex items-center justify-between">
                <span>Priority:</span>
                <b className="text-themeBurlywood">{ticket.priority}</b>
              </div>
            </div>

            <div className="mt-4 border-t border-themePurple/10 pt-4">
              <span className="text-xs font-semibold text-gray-400 uppercase">Original Complaint</span>
              <p className="text-xs text-gray-300 mt-1 bg-darkBg/60 p-3 rounded-lg border border-themePurple/20">
                {ticket.description}
              </p>
            </div>
          </div>

          {/* Resolution Card */}
          {ticket.status === 'Resolved' ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5">
              <div className="flex items-center space-x-2 text-emerald-400 mb-2">
                <CheckCircle2 className="w-5 h-5" />
                <h3 className="font-bold text-sm">Resolution Note</h3>
              </div>
              <p className="text-xs text-gray-300 italic">"{ticket.resolutionNote}"</p>
            </div>
          ) : (
            user.role === 'admin' && (
              <form onSubmit={handleResolveTicket} className="bg-cardBg border border-themePurple/20 rounded-2xl p-5">
                <div className="flex items-center space-x-2 text-themeBurlywood mb-3">
                  <ShieldCheck className="w-5 h-5" />
                  <h3 className="font-bold text-sm">Resolve Ticket</h3>
                </div>
                <textarea
                  required
                  rows="3"
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Mandatory resolution summary note..."
                  className="w-full bg-darkBg border border-themePurple/30 rounded-xl p-3 text-xs text-white focus:outline-none mb-3"
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 rounded-xl text-xs transition-colors"
                >
                  Mark Ticket Resolved
                </button>
              </form>
            )
          )}
        </div>

        {/* Right Column: Real-Time Chat Thread */}
        <div className="lg:col-span-2 bg-cardBg border border-themePurple/20 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Live Ticket Conversation</h2>
            <Conversation messages={messages} />
          </div>
          <MessageInput onSendMessage={handleSendMessage} disabled={ticket.status === 'Resolved'} />
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;