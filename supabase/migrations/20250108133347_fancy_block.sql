/*
  # Network Scanner Database Schema

  1. New Tables
    - network_scans
      - id (uuid, primary key) 
      - user_id (uuid, references auth.users)
      - target_ip (text)
      - scan_type (text)
      - status (text)
      - results (jsonb)
      - created_at (timestamp)
      - updated_at (timestamp)
    
  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

CREATE TABLE IF NOT EXISTS network_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  target_ip text NOT NULL,
  scan_type text NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  results jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE network_scans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scans"
  ON network_scans
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create scans"
  ON network_scans
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);