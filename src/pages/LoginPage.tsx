import { MessageSquareText } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const { signInWithGoogle, user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  return (
    <div className={`min-h-screen flex items-center justify-center px-4 ${
      theme === 'dark'
        ? 'bg-gradient-to-br from-slate-900 to-slate-800'
        : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      <div className="w-full max-w-md">
        <div className={`rounded-xl shadow-2xl p-8 border ${
          theme === 'dark'
            ? 'bg-slate-800 border-slate-700'
            : 'bg-white border-gray-200'
        }`}>
          <div className="flex justify-center mb-8">
            <div className={`p-4 rounded-full ${
              theme === 'dark'
                ? 'bg-amber-400'
                : 'bg-amber-100'
            }`}>
              <MessageSquareText size={40} className={
                theme === 'dark' ? 'text-slate-900' : 'text-amber-600'
              } />
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-center mb-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-900'
          }`}>
            My Notes!
          </h1>
          <p className={`text-center mb-8 ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Keep your thoughts organized and accessible
          </p>

          <button
            onClick={signInWithGoogle}
            className={`w-full flex items-center justify-center gap-3 px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg ${
              theme === 'dark'
                ? 'bg-white hover:bg-gray-100 text-slate-900'
                : 'bg-slate-900 hover:bg-slate-800 text-white'
            }`}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>

          <div className={`mt-8 pt-8 border-t ${
            theme === 'dark' ? 'border-slate-700' : 'border-gray-200'
          }`}>
            <p className={`text-sm text-center ${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              Your notes are encrypted and stored securely. Sign in with Google to get started.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
