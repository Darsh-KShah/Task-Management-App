import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { FaMoon, FaSun, FaUser, FaSignOutAlt } from 'react-icons/fa';

function Header() {
  const { currentUser, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="app-header">
      <h1>To-Do List 📝</h1>
      <div className="header-controls">
        {/* Theme toggle button comes first now */}
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        {/* User menu with horizontal layout */}
        {currentUser && (
          <div className="user-menu">
            <div 
              className="username-icon" 
              title={currentUser.username}
            >
              <FaUser />
            </div>
            <button 
              onClick={handleLogout}
              className="logout-btn"
              title="Logout"
            >
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
