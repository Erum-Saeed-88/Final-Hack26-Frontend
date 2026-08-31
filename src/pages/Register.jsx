import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Bot, UserPlus } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/register', { name, email, password, role });
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-teal-100 border-2 border-teal-700 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-slide-up">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-xl bg-btn-gradient mx-auto flex items-center justify-center shadow-lg shadow-themePurple/40 mb-3">
            <Bot className="text-teal-700 w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-teal-700 tracking-wide">Create Your Account</h1>
          <p className="text-xs text-gray-500 mt-1">Join SupportFlow Workspace</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 focus:outline-none focus:border-themeDeepPink text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Select Account Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-teal-100 border-2 border-teal-700 rounded-lg px-4 py-2 text-teal-700 text-sm focus:outline-none"
            >
              <option value="customer">Customer Portal</option>
              <option value="admin">Admin Portal</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-teal-100 font-bold py-2.5 rounded-lg cursor-pointer hover:opacity-90 flex items-center justify-center space-x-2 shadow-lg shadow-themePurple/30 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating...' : 'Register'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Already registered?{' '}
          <Link to="/login" className="text-teal-700 hover:underline font-bold">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;