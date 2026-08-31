import { useState } from 'react';
import API from '../../services/api';
import { PlusCircle, Sparkles, X } from 'lucide-react';

const TicketForm = ({ isOpen, onClose, onTicketCreated }) => {
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/tickets', { subject, description, category });
      onTicketCreated(data);
      onClose();
      setSubject('');
      setDescription('');
      setCategory('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-teal-200 border-2 border-teal-700 rounded-2xl w-full max-w-lg p-6 shadow-2xl relative animate-slide-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-teal-700">
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 mb-6">
          <PlusCircle className="text-teal-700 w-6 h-6" />
          <h2 className="text-xl font-bold text-teal-700">Create Support Ticket</h2>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">Subject</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g. Charged twice for order "
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">Category (Optional)</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink"
            >
              <option value="">Let AI Decide Category</option>
              <option value="Billing">Billing</option>
              <option value="Technical">Technical</option>
              <option value="Account">Account</option>
              <option value="General">General</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1">Description</label>
            <textarea
              required
              rows="4"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide complete details about your issue..."
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-teal-100 font-semibold py-2.5 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center space-x-2 shadow-lg shadow-themePurple/30"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>AI Triaging Ticket...</span>
              </span>
            ) : (
              <span>Submit Ticket</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TicketForm;