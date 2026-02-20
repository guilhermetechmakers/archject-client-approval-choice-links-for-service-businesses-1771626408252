-- admin_analytics table (organization-level analytics)
CREATE TABLE IF NOT EXISTS admin_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_analytics ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "admin_analytics_read_own" ON admin_analytics
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "admin_analytics_insert_own" ON admin_analytics
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "admin_analytics_update_own" ON admin_analytics
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "admin_analytics_delete_own" ON admin_analytics
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for user_id lookups
CREATE INDEX IF NOT EXISTS idx_admin_analytics_user_id ON admin_analytics(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_analytics_created_at ON admin_analytics(created_at);

-- admin_audit_logs table (admin actions audit trail)
CREATE TABLE IF NOT EXISTS admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admins can read audit logs (users read their own)
CREATE POLICY "admin_audit_logs_read_own" ON admin_audit_logs
  FOR SELECT USING (auth.uid() = user_id);

-- Authenticated users can insert their own audit log entries
CREATE POLICY "admin_audit_logs_insert" ON admin_audit_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Create index for audit log queries
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_user_id ON admin_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_created_at ON admin_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_admin_audit_logs_action ON admin_audit_logs(action);
