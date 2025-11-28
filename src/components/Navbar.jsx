import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { FileText, LayoutDashboard, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="bg-slate-800/50 backdrop-blur-lg border-b border-slate-700 sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} className="flex items-center space-x-2">
              <FileText className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                SurveyHub
              </span>
            </Link>
            
            <div className="hidden md:flex space-x-4">
              <Link to={user.role === 'admin' ? '/admin' : '/dashboard'}>
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                  <LayoutDashboard className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
              </Link>
              {user.role === 'admin' && (
                <Link to="/admin/reports">
                  <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-700">
                    <FileText className="h-4 w-4 mr-2" />
                    Reports
                  </Button>
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-white">{user.email}</p>
              <p className="text-xs text-slate-400 capitalize">{user.role}</p>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;