import { MessageSquareText, LogOut, Moon, Sun } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';

export function Header() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-slate-800 dark:bg-slate-800 border-b border-slate-700 dark:border-slate-700 shadow-lg light:bg-white light:border-gray-200">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquareText className="text-amber-400 dark:text-amber-400 light:text-amber-500" size={32} />
          <h1 className="text-2xl font-bold text-white dark:text-white light:text-slate-900">My Notes!</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-gray-300 dark:text-gray-300 light:text-gray-700 text-sm">{user?.email}</span>
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-300 dark:text-gray-300 light:text-gray-700 hover:bg-slate-700 dark:hover:bg-slate-700 light:hover:bg-gray-100 rounded-lg transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 bg-red-600 dark:bg-red-600 light:bg-red-500 hover:bg-red-700 dark:hover:bg-red-700 light:hover:bg-red-600 text-white rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
