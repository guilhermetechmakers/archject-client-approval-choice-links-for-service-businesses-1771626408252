-- settings_preferences table (global application settings per user)
CREATE TABLE IF NOT EXISTS settings_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Settings',
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  -- Notification preferences
  email_reminders BOOLEAN DEFAULT true,
  activity_emails BOOLEAN DEFAULT true,
  webhooks_enabled BOOLEAN DEFAULT false,
  -- Brand & link settings
  branded_domain TEXT,
  default_logo_url TEXT,
  default_cta_copy TEXT DEFAULT 'Approve',
  -- Security & compliance
  data_retention_days INTEGER DEFAULT 365,
  export_enabled BOOLEAN DEFAULT true,
  consent_default TEXT DEFAULT 'opt_in',
  -- Integrations (JSONB for flexibility)
  integrations JSONB DEFAULT '{}',
  -- Template library metadata
  template_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE settings_preferences ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "settings_preferences_read_own" ON settings_preferences
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "settings_preferences_insert_own" ON settings_preferences
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "settings_preferences_update_own" ON settings_preferences
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "settings_preferences_delete_own" ON settings_preferences
  FOR DELETE USING (auth.uid() = user_id);

-- Index for user lookups
CREATE INDEX IF NOT EXISTS idx_settings_preferences_user_id ON settings_preferences(user_id);
