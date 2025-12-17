import { supabase } from '../lib/supabase';
import { Note } from '../types';

export async function fetchNotes(userId: string): Promise<Note[]> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function fetchNoteById(noteId: string): Promise<Note | null> {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', noteId)
    .maybeSingle();

  if (error) throw error;
  return data;
}

export async function createNote(
  userId: string,
  title: string,
  content: string
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .insert([{ user_id: userId, title, content }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string
): Promise<Note> {
  const { data, error } = await supabase
    .from('notes')
    .update({ title, content, updated_at: new Date().toISOString() })
    .eq('id', noteId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteNote(noteId: string): Promise<void> {
  const { error } = await supabase.from('notes').delete().eq('id', noteId);

  if (error) throw error;
}
