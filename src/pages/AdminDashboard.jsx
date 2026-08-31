import { useEffect, useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { SocketContext } from '../context/SocketContext';
import StatsOverview from '../components/admin/StatsOverview';
import AdminTriageModal from '../components/admin/AdminTriageModal';
import Loader from '../components/common/Loader';
import { Bot, Trash2, Eye } from 'lucide-react';

const AdminDashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const socket = useContext(SocketContext);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on('ticket_created', () => fetchData());
    socket.on('dashboard_status_change', () => fetchData());
    socket.on('ticket_deleted', (id) => {
      setTickets((prev) => prev.filter((t) => t._id !== id));
      fetchData();
    });

    return () => {
      socket.off('ticket_created');
      socket.off('dashboard_status_change');
      socket.off('ticket_deleted');
    };
  }, [socket]);

  const fetchData = async () => {
    try {
      const [ticketsRes, statsRes] = await Promise.all([
        API.get('/tickets'),
        API.get('/tickets/stats'),
      ]);
      setTickets(ticketsRes.data);
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this ticket?')) return;
    try {
      await API.delete(`/tickets/${id}`);
    } catch (err) {
      alert('Failed to delete ticket');
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-teal-700">Admin Control Desk</h1>
        <p className="text-sm text-gray-500 mt-1">Review AI triaged tickets, execute CRUD and resolve issues</p>
      </div>

      <StatsOverview stats={stats} />

      <div className="bg-teal-100 border-2 border-teal-700 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="bg-teal-700 text-xs uppercase text-teal-100 border-b border-teal-700/20">
              <tr>
                <th className="px-6 py-4">Ticket ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Subject</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Priority</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-teal-100/20">
              {tickets.map((t) => (
                <tr key={t._id} className="hover:bg-darkBg/40 transition-colors">
                  <td className="px-6 py-4 font-mono font-bold text-teal-700">{t.ticketNumber}</td>
                  <td className="px-6 py-4 text-teal-700">{t.customer?.name}</td>
                  <td className="px-6 py-4 font-medium text-teal-700 max-w-xs truncate">{t.subject}</td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-themePurple/10 border-2 border-teal-700 text-teal-700 text-xs">
                      {t.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                        t.priority === 'High'
                          ? 'bg-red-500/20 text-red-400'
                          : t.priority === 'Medium'
                          ? 'bg-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-1 rounded-full bg-darkBg border-2 border-teal-700 text-teal-700 text-xs">{t.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center space-x-3">
                      <button
                        onClick={() => setSelectedTicket(t)}
                        title="Review AI Triage"
                        className="p-1.5 rounded-lg text-teal-700 hover:bg-teal-700 hover:text-teal-100 cursor-pointer transition-colors"
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                      <Link
                        to={`/ticket/${t._id}`}
                        title="Open Ticket Thread"
                        className="p-1.5 rounded-lg bg-teal-100 text-teal-700 hover:bg-teal-700 hover:text-teal-100 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(t._id)}
                        title="Delete Ticket"
                        className="p-1.5 rounded-lg bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500 hover:text-white transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AdminTriageModal
        ticket={selectedTicket}
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        onUpdate={() => fetchData()}
      />
    </div>
  );
};

export default AdminDashboard;