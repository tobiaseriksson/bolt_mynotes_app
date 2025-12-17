import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchNotes, deleteNote } from '../services/notes';
import { Note } from '../types';
import { toast } from 'sonner';

export function DashboardPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; note: Note | null }>({
    open: false,
    note: null,
  });

  useEffect(() => {
    if (user) {
      loadNotes();
    }
  }, [user]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      if (!user) return;
      const data = await fetchNotes(user.id);
      setNotes(data);
    } catch (error) {
      toast.error('Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.note) return;
    try {
      await deleteNote(deleteModal.note.id);
      setNotes(notes.filter((n) => n.id !== deleteModal.note!.id));
      toast.success('Note deleted!');
      setDeleteModal({ open: false, note: null });
    } catch (error) {
      toast.error('Failed to delete note');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            Your Notes
          </h2>
          <button
            onClick={() => navigate('/notes/new')}
            className={`flex items-center gap-2 px-6 py-3 font-semibold rounded-lg transition-colors shadow-lg ${
              theme === 'dark'
                ? 'bg-amber-400 hover:bg-amber-500 text-slate-900'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
            }`}
          >
            <Plus size={20} />
            Add Note
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>
              Loading your notes...
            </div>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-16">
            <div className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>
              No notes yet
            </div>
            <button
              onClick={() => navigate('/notes/new')}
              className={`font-semibold ${
                theme === 'dark'
                  ? 'text-amber-400 hover:text-amber-500'
                  : 'text-amber-600 hover:text-amber-700'
              }`}
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {notes.map((note) => (
              <div
                key={note.id}
                className={`border rounded-lg p-6 hover:border-amber-400 transition-colors group ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700'
                    : 'bg-white border-gray-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => navigate(`/notes/${note.id}`)}
                  >
                    <h3 className={`text-xl font-semibold mb-2 transition-colors ${
                      theme === 'dark'
                        ? 'text-white hover:text-amber-400'
                        : 'text-slate-900 hover:text-amber-600'
                    }`}>
                      {note.title}
                    </h3>
                    <div className={`flex items-center gap-2 text-sm ${
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                      <Clock size={16} />
                      {formatDate(note.updated_at)}
                    </div>
                  </div>
                  <button
                    onClick={() => setDeleteModal({ open: true, note })}
                    className={`p-2 rounded-lg transition-colors opacity-0 group-hover:opacity-100 ${
                      theme === 'dark'
                        ? 'text-gray-400 hover:text-red-500 hover:bg-red-500/10'
                        : 'text-gray-600 hover:text-red-600 hover:bg-red-100'
                    }`}
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {deleteModal.open && deleteModal.note && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className={`border rounded-lg max-w-sm p-6 ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${
              theme === 'dark' ? 'text-white' : 'text-slate-900'
            }`}>
              Delete Note?
            </h3>
            <p className={`mb-6 ${
              theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Are you sure you want to delete "{deleteModal.note.title}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ open: false, note: null })}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'text-white bg-slate-700 hover:bg-slate-600'
                    : 'text-slate-900 bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  theme === 'dark'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
