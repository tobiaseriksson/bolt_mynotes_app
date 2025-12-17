import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import { Underline } from '@tiptap/extension-underline';
import { ChevronLeft, Bold, Italic, Underline as UnderlineIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { fetchNoteById, createNote, updateNote } from '../services/notes';
import { toast } from 'sonner';

export function EditorPage() {
  const { user } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { noteId } = useParams();
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(!!noteId);
  const [saving, setSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color.configure({
        types: ['textStyle'],
      }),
      Underline,
    ],
    content: '<p>Start typing...</p>',
  });

  useEffect(() => {
    if (noteId && user) {
      loadNote();
    }
  }, [noteId, user]);

  const loadNote = async () => {
    try {
      if (!noteId) return;
      const note = await fetchNoteById(noteId);
      if (note) {
        setTitle(note.title);
        editor?.commands.setContent(note.content);
      }
    } catch (error) {
      toast.error('Failed to load note');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !editor?.getHTML()) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setSaving(true);
      if (!user) return;

      const content = editor.getHTML();

      if (noteId) {
        await updateNote(noteId, title, content);
        toast.success('Note updated!');
      } else {
        await createNote(user.id, title, content);
        toast.success('Note saved!');
      }

      navigate('/');
    } catch (error) {
      toast.error('Failed to save note');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'
      }`}>
        <div className={theme === 'dark' ? 'text-white' : 'text-slate-900'}>
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className={`flex items-center gap-2 mb-6 font-semibold ${
            theme === 'dark'
              ? 'text-amber-400 hover:text-amber-500'
              : 'text-amber-600 hover:text-amber-700'
          }`}
        >
          <ChevronLeft size={20} />
          Back
        </button>

        <div className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note title..."
            className={`w-full text-4xl font-bold rounded-lg px-4 py-3 focus:outline-none focus:ring-1 border ${
              theme === 'dark'
                ? 'text-white bg-slate-800 border-slate-700 focus:border-amber-400 focus:ring-amber-400'
                : 'text-slate-900 bg-white border-gray-200 focus:border-amber-500 focus:ring-amber-500'
            }`}
          />

          <div className={`border rounded-lg overflow-hidden ${
            theme === 'dark'
              ? 'bg-slate-800 border-slate-700'
              : 'bg-white border-gray-200'
          }`}>
            <div className={`border-b flex gap-2 p-3 flex-wrap ${
              theme === 'dark'
                ? 'bg-slate-700 border-slate-600'
                : 'bg-gray-100 border-gray-200'
            }`}>
              <button
                onClick={() => editor?.chain().focus().toggleBold().run()}
                className={`p-2 rounded transition-colors ${
                  editor?.isActive('bold')
                    ? theme === 'dark'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-600'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Bold size={18} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleItalic().run()}
                className={`p-2 rounded transition-colors ${
                  editor?.isActive('italic')
                    ? theme === 'dark'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-600'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <Italic size={18} />
              </button>
              <button
                onClick={() => editor?.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded transition-colors ${
                  editor?.isActive('underline')
                    ? theme === 'dark'
                      ? 'bg-amber-400 text-slate-900'
                      : 'bg-amber-500 text-white'
                    : theme === 'dark'
                      ? 'text-gray-300 hover:bg-slate-600'
                      : 'text-gray-600 hover:bg-gray-200'
                }`}
              >
                <UnderlineIcon size={18} />
              </button>
              <div className={`w-px ${
                theme === 'dark' ? 'bg-slate-600' : 'bg-gray-200'
              }`}></div>
              <input
                type="color"
                onChange={(e) =>
                  editor?.chain().focus().setColor(e.currentTarget.value).run()
                }
                value={editor?.getAttributes('textStyle').color || (theme === 'dark' ? '#ffffff' : '#000000')}
                className="w-10 h-10 rounded cursor-pointer"
                title="Text color"
              />
            </div>

            <EditorContent
              editor={editor}
              className="prose max-w-none p-6 focus:outline-none min-h-96"
              style={{
                color: theme === 'dark' ? 'white' : 'rgb(15, 23, 42)',
                background: theme === 'dark' ? '#1e293b' : '#ffffff',
              }}
            />
          </div>

          <div className="flex gap-3 justify-end">
            <button
              onClick={() => navigate('/')}
              className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                theme === 'dark'
                  ? 'text-white bg-slate-700 hover:bg-slate-600'
                  : 'text-slate-900 bg-gray-200 hover:bg-gray-300'
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className={`px-6 py-3 rounded-lg transition-colors font-semibold ${
                theme === 'dark'
                  ? 'text-slate-900 bg-amber-400 hover:bg-amber-500 disabled:bg-gray-400'
                  : 'text-white bg-amber-500 hover:bg-amber-600 disabled:bg-gray-400'
              }`}
            >
              {saving ? 'Saving...' : noteId ? 'Update' : 'Submit'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
