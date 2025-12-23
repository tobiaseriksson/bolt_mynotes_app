import { describe, it, expect, beforeEach, vi } from 'vitest';
import { fetchNotes, fetchNoteById, createNote, updateNote, deleteNote } from '../notes';
import { supabase } from '../../lib/supabase';

vi.mock('../../lib/supabase', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('Notes Service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('fetchNotes', () => {
    it('should fetch all notes for a user', async () => {
      const mockNotes = [
        { id: '1', user_id: 'user1', title: 'Note 1', content: 'Content 1', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: '2', user_id: 'user1', title: 'Note 2', content: 'Content 2', created_at: '2024-01-02', updated_at: '2024-01-02' },
      ];

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: mockNotes, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchNotes('user1');

      expect(result).toEqual(mockNotes);
      expect(supabase.from).toHaveBeenCalledWith('notes');
      expect(mockQuery.select).toHaveBeenCalledWith('*');
      expect(mockQuery.eq).toHaveBeenCalledWith('user_id', 'user1');
    });

    it('should return empty array if no notes found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchNotes('user1');

      expect(result).toEqual([]);
    });

    it('should throw error if database query fails', async () => {
      const mockError = new Error('Database error');
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(fetchNotes('user1')).rejects.toThrow('Database error');
    });
  });

  describe('fetchNoteById', () => {
    it('should fetch a note by id', async () => {
      const mockNote = {
        id: '1',
        user_id: 'user1',
        title: 'Note 1',
        content: 'Content 1',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: mockNote, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchNoteById('1');

      expect(result).toEqual(mockNote);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
    });

    it('should return null if note not found', async () => {
      const mockQuery = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await fetchNoteById('1');

      expect(result).toBeNull();
    });
  });

  describe('createNote', () => {
    it('should create a new note', async () => {
      const mockNote = {
        id: '1',
        user_id: 'user1',
        title: 'New Note',
        content: 'New Content',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockNote, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await createNote('user1', 'New Note', 'New Content');

      expect(result).toEqual(mockNote);
      expect(mockQuery.insert).toHaveBeenCalledWith([
        { user_id: 'user1', title: 'New Note', content: 'New Content' },
      ]);
    });

    it('should throw error if creation fails', async () => {
      const mockError = new Error('Creation failed');
      const mockQuery = {
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(createNote('user1', 'New Note', 'New Content')).rejects.toThrow(
        'Creation failed'
      );
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const mockNote = {
        id: '1',
        user_id: 'user1',
        title: 'Updated Note',
        content: 'Updated Content',
        created_at: '2024-01-01',
        updated_at: '2024-01-02',
      };

      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: mockNote, error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      const result = await updateNote('1', 'Updated Note', 'Updated Content');

      expect(result).toEqual(mockNote);
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
    });

    it('should throw error if update fails', async () => {
      const mockError = new Error('Update failed');
      const mockQuery = {
        update: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(updateNote('1', 'Updated Note', 'Updated Content')).rejects.toThrow(
        'Update failed'
      );
    });
  });

  describe('deleteNote', () => {
    it('should delete a note', async () => {
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: null }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(deleteNote('1')).resolves.toBeUndefined();

      expect(mockQuery.delete).toHaveBeenCalled();
      expect(mockQuery.eq).toHaveBeenCalledWith('id', '1');
    });

    it('should throw error if deletion fails', async () => {
      const mockError = new Error('Deletion failed');
      const mockQuery = {
        delete: vi.fn().mockReturnThis(),
        eq: vi.fn().mockResolvedValue({ error: mockError }),
      };

      vi.mocked(supabase.from).mockReturnValue(mockQuery as any);

      await expect(deleteNote('1')).rejects.toThrow('Deletion failed');
    });
  });
});
