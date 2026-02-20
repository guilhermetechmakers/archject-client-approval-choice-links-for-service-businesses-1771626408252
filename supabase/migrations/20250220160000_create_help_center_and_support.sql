-- about_help_center table (documentation/support resources per user)
CREATE TABLE IF NOT EXISTS about_help_center (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE about_help_center ENABLE ROW LEVEL SECURITY;

CREATE POLICY "about_help_center_read_own" ON about_help_center
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "about_help_center_insert_own" ON about_help_center
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "about_help_center_update_own" ON about_help_center
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "about_help_center_delete_own" ON about_help_center
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_about_help_center_user_id ON about_help_center(user_id);
CREATE INDEX IF NOT EXISTS idx_about_help_center_status ON about_help_center(status);

-- support_requests table (contact support form submissions)
CREATE TABLE IF NOT EXISTS support_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  issue_type TEXT NOT NULL CHECK (issue_type IN ('technical', 'billing', 'feature', 'account', 'other')),
  description TEXT NOT NULL,
  email TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE support_requests ENABLE ROW LEVEL SECURITY;

-- Users can read their own support requests
CREATE POLICY "support_requests_read_own" ON support_requests
  FOR SELECT USING (auth.uid() = user_id);

-- Anyone can insert (for unauthenticated support form submissions)
CREATE POLICY "support_requests_insert" ON support_requests
  FOR INSERT WITH CHECK (true);

-- Users can update their own support requests (limited - e.g. add comments)
CREATE POLICY "support_requests_update_own" ON support_requests
  FOR UPDATE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_support_requests_user_id ON support_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_support_requests_status ON support_requests(status);
CREATE INDEX IF NOT EXISTS idx_support_requests_created_at ON support_requests(created_at);
