-- approval_request_detail table
CREATE TABLE IF NOT EXISTS approval_request_detail (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE approval_request_detail ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "approval_request_detail_read_own" ON approval_request_detail
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "approval_request_detail_insert_own" ON approval_request_detail
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "approval_request_detail_update_own" ON approval_request_detail
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "approval_request_detail_delete_own" ON approval_request_detail
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_approval_request_detail_user_id ON approval_request_detail(user_id);
