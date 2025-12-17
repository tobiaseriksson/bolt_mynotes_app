/*
  # Create Notes Table

  1. New Tables
    - `notes`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text, required)
      - `content` (text, required)
      - `created_at` (timestamp with timezone, default to now)
      - `updated_at` (timestamp with timezone, default to now, updates on edit)

  2. Security
    - Enable RLS on `notes` table
    - Add policy for authenticated users to select their own notes
    - Add policy for authenticated users to insert new notes
    - Add policy for authenticated users to update their own notes
    - Add policy for authenticated users to delete their own notes

  3. Indexes
    - Add index on user_id for optimal query performance
*/

CREATE TABLE IF NOT EXISTS notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS notes_user_id_idx ON notes(user_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can select their own notes"
  ON notes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own notes"
  ON notes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);