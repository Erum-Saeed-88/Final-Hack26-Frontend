import { useState } from 'react';
import API from '../../services/api';
import { Bot, Check, X } from 'lucide-react';

const AdminTriageModal = ({ ticket, isOpen, onClose, onUpdate }) => {
  const [category, setCategory] = useState(ticket?.category || 'General');
  const [priority, setPriority] = useState(ticket?.priority || 'Medium');
  const [status, setStatus] = useState(ticket?.status || 'In Progress');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !ticket) return null;

  const handleSave = async () => {
    setLoading(true);
    try {
      const { data } = await API.put(`/tickets/${ticket._id}/triage`, { category, priority, status });
      onUpdate(data);
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-cardBg border border-themePurple/40 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-4">
          <Bot className="text-themeDeepPink w-6 h-6 animate-bounce" />
          <h2 className="text-xl font-bold text-white">Review AI Triage Insights</h2>
        </div>

        {/* AI Suggested Box */}
        <div className="bg-darkBg/80 border border-themeBurlywood/30 rounded-xl p-4 mb-6 space-y-2">
          <div className="text-xs text-themeBurlywood font-bold uppercase tracking-wider">AI Suggested Summary</div>
          <p className="text-sm text-gray-300 italic">"{ticket.aiSuggested?.summary || 'No AI summary'}"</p>
          <div className="flex space-x-4 text-xs pt-1">
            <span className="text-gray-400">AI Cat: <b className="text-white">{ticket.aiSuggested?.category}</b></span>
            <span className="text-gray-400">AI Priority: <b className="text-white">{ticket.aiSuggested?.priority}</b></span>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Final Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-darkBg border border-themePurple/30 rounded-lg px-3 py-2 text-white focus:outline-none"
            >
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Final Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-darkBg border border-themePurple/30 rounded-lg px-3 py-2 text-white focus:outline-none"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase mb-1">Update Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-darkBg border border-themePurple/30 rounded-lg px-3 py-2 text-white focus:outline-none"
            >
              <option value="New">New</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleSave}
          disabled={loading}
          className="w-full mt-6 bg-btn-gradient text-white font-semibold py-2.5 rounded-lg hover:opacity-90 flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>{loading ? 'Saving Changes...' : 'Approve & Save'}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminTriageModal;