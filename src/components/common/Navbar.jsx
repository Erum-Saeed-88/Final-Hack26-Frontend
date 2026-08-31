import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LogOut, Bot, Shield, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-cardBg/40 backdrop-blur-md border-b border-themePurple/50 sticky top-0 z-50 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-btn-gradient flex items-center justify-center shadow-lg shadow-themePurple/30 group-hover:scale-105 transition-transform duration-300">
              <Bot className="text-teal-100 w-6 h-6 animate-pulse" />
            </div>
            <span className="text-2xl font-extrabold bg-accent-gradient bg-clip-text text-teal-100 tracking-wide">
              SUPPORTFLOW
            </span>
          </Link>

          {user && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 bg-transparent px-3 py-1.5 rounded-full border-2 border-teal-700">
                {user.role === 'admin' ? (
                  <Shield className="w-4 h-4 text-teal-100" />
                ) : (
                  <User className="w-4 h-4 text-teal-100" />
                )}
                <span className="text-sm font-medium text-teal-100">{user.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-700 text-teal-100 uppercase font-bold">
                  {user.role}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1.5 text-red-400 hover:text-red-200 cursor-pointer transition-colors duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="text-sm font-medium hidden sm:inline">Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;