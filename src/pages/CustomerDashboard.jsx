import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import TicketForm from '../components/customer/TicketForm';
import Loader from '../components/common/Loader';
import { Plus, MessageSquare, Tag, ShieldAlert } from 'lucide-react';

const CustomerDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('ticket_created', (newTicket) => {
      setTickets((prev) => [newTicket, ...prev]);
    });

    socket.on('ticket_updated', (updatedTicket) => {
      setTickets((prev) => prev.map((t) => (t._id === updatedTicket._id ? updatedTicket : t)));
    });

    return () => {
      socket.off('ticket_created');
      socket.off('ticket_updated');
    };
  }, [socket]);

  const fetchTickets = async () => {
    try {
      const { data } = await API.get('/tickets');
      setTickets(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    if (status === 'Resolved') return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    if (status === 'In Progress') return 'bg-themeBurlywood/20 text-themeBurlywood border-themeBurlywood/30';
    return 'bg-themePurple/20 text-themePurple border-themePurple/30';
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-teal-700">My Support Tickets</h1>
          <p className="text-sm text-gray-500 mt-1">Track status and chat with support admins</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-teal-100 text-teal-700 px-5 py-2.5 rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-themePurple/30 hover:opacity-90 transition-all"
        >
          <Plus className="w-5 h-5" />
          <span>New Ticket</span>
        </button>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-cardBg border border-themePurple/20 rounded-2xl p-12 text-center">
          <ShieldAlert className="w-12 h-12 text-gray-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-teal-300">No Tickets Created Yet</h3>
          <p className="text-sm text-gray-500 mt-1">Click 'New Ticket' to submit your issue for AI triage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tickets.map((t) => (
            <div
              key={t._id}
              className="bg-teal-100 border-2 border-teal-700 hover:border-themeDeepPink/40 rounded-2xl p-5 shadow-lg flex flex-col justify-between transition-all duration-300 hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono font-bold text-teal-700">{t.ticketNumber}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full border font-bold text-teal-700 ${getStatusColor(t.status)}`}>
                    {t.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-teal-700 mb-2 line-clamp-1">{t.subject}</h3>
                <p className="text-xs text-teal-700 mb-4 line-clamp-2">{t.description}</p>
              </div>

              <div className="border-t border-teal-700 pt-4 mt-2 flex items-center justify-between">
                <div className="flex items-center space-x-1 text-xs text-teal-700">
                  <Tag className="w-3.5 h-3.5 text-teal-700" />
                  <span>{t.category}</span>
                </div>
                <Link
                  to={`/ticket/${t._id}`}
                  className="text-xs font-bold text-teal-700 hover:underline flex items-center space-x-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <TicketForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onTicketCreated={(newT) => setTickets([newT, ...tickets])}
      />
    </div>
  );
};

export default CustomerDashboard;