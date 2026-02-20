-- Projects table (project_detail)
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'completed')),
  client_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Approval requests table
CREATE TABLE IF NOT EXISTS approval_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  instructions TEXT,
  options JSONB DEFAULT '[]',
  media JSONB DEFAULT '[]',
  recipients TEXT[] DEFAULT '{}',
  deadline TIMESTAMPTZ,
  allow_comments BOOLEAN DEFAULT true,
  token TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'sent' CHECK (status IN ('sent', 'pending', 'approved', 'declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects_read_own" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "projects_insert_own" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "projects_update_own" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "projects_delete_own" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- Enable RLS on approval_requests
ALTER TABLE approval_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "approval_requests_read_own" ON approval_requests
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "approval_requests_insert_own" ON approval_requests
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "approval_requests_update_own" ON approval_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "approval_requests_delete_own" ON approval_requests
  FOR DELETE USING (auth.uid() = user_id);

-- Note: Client review page fetches approval by token via Edge Function or RPC
