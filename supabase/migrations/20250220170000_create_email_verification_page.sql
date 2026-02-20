-- email_verification_page table (verification page metadata per user)
CREATE TABLE IF NOT EXISTS email_verification_page (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE email_verification_page ENABLE ROW LEVEL SECURITY;

CREATE POLICY "email_verification_page_read_own" ON email_verification_page
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "email_verification_page_insert_own" ON email_verification_page
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "email_verification_page_update_own" ON email_verification_page
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "email_verification_page_delete_own" ON email_verification_page
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_email_verification_page_user_id ON email_verification_page(user_id);
CREATE INDEX IF NOT EXISTS idx_email_verification_page_status ON email_verification_page(status);
