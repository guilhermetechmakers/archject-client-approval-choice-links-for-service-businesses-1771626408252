-- landing_page table for config/content (optional CMS-style content)
CREATE TABLE IF NOT EXISTS landing_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE landing_page ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "landing_page_read_own" ON landing_page
  FOR SELECT USING (auth.uid() = user_id);

-- Users can insert their own data
CREATE POLICY "landing_page_insert_own" ON landing_page
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own data
CREATE POLICY "landing_page_update_own" ON landing_page
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own data
CREATE POLICY "landing_page_delete_own" ON landing_page
  FOR DELETE USING (auth.uid() = user_id);
