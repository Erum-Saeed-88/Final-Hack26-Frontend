import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { Bot, LogIn } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data } = await API.post('/auth/login', { email, password });
      login(data);
      navigate(data.role === 'admin' ? '/admin' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4">
      <div className="bg-teal-100 border-2 border-teal-700 rounded-2xl w-full max-w-md p-8 shadow-2xl relative animate-fade-In">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-btn-gradient mx-auto flex items-center justify-center shadow-lg shadow-themePurple/40 mb-3">
            <Bot className="text-teal-700 w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-teal-700 tracking-wide">Welcome Back</h1>
          <p className="text-xs text-gray-500 mt-1">Sign in to your SupportFlow account</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg text-xs mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-teal-100 border border-teal-700 rounded-lg px-4 py-2.5 text-teal-700 focus:outline-none focus:border-themeDeepPink text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-teal-700 uppercase mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-teal-100 border border-teal-700 rounded-lg px-4 py-2.5 text-teal-700 focus:outline-none focus:border-themeDeepPink text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-teal-100 font-bold py-2.5 rounded-lg hover:opacity-90 flex items-center justify-center space-x-2 shadow-lg shadow-themePurple/30"
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-teal-700 hover:underline font-bold">
            Register Here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;