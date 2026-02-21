-- approval_selections: stores client selections for approval options
CREATE TABLE IF NOT EXISTS approval_selections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  option_id TEXT NOT NULL,
  option_title TEXT NOT NULL,
  option_description TEXT,
  selected_by TEXT NOT NULL,
  selected_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  cost TEXT
);

CREATE INDEX IF NOT EXISTS idx_approval_selections_request ON approval_selections(approval_request_id);

-- approval_audit_trail: chronological log with IP, user-agent, timestamp
CREATE TABLE IF NOT EXISTS approval_audit_trail (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ip_address TEXT,
  user_agent TEXT,
  actor TEXT,
  details TEXT
);

CREATE INDEX IF NOT EXISTS idx_approval_audit_request ON approval_audit_trail(approval_request_id);

-- approval_comments: inline replies, resolve/flag
CREATE TABLE IF NOT EXISTS approval_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  approval_request_id UUID NOT NULL REFERENCES approval_requests(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES approval_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  author TEXT NOT NULL,
  author_email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  resolved BOOLEAN DEFAULT false,
  flagged BOOLEAN DEFAULT false
);

CREATE INDEX IF NOT EXISTS idx_approval_comments_request ON approval_comments(approval_request_id);
CREATE INDEX IF NOT EXISTS idx_approval_comments_parent ON approval_comments(parent_id);

-- RLS for approval_selections (users see via approval_requests ownership)
ALTER TABLE approval_selections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approval_selections_read_via_request" ON approval_selections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM approval_requests ar
      WHERE ar.id = approval_selections.approval_request_id AND ar.user_id = auth.uid()
    )
  );

-- RLS for approval_audit_trail
ALTER TABLE approval_audit_trail ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approval_audit_read_via_request" ON approval_audit_trail
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM approval_requests ar
      WHERE ar.id = approval_audit_trail.approval_request_id AND ar.user_id = auth.uid()
    )
  );

-- RLS for approval_comments
ALTER TABLE approval_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "approval_comments_read_via_request" ON approval_comments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM approval_requests ar
      WHERE ar.id = approval_comments.approval_request_id AND ar.user_id = auth.uid()
    )
  );
CREATE POLICY "approval_comments_insert_via_request" ON approval_comments
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM approval_requests ar
      WHERE ar.id = approval_comments.approval_request_id AND ar.user_id = auth.uid()
    )
  );
CREATE POLICY "approval_comments_update_via_request" ON approval_comments
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM approval_requests ar
      WHERE ar.id = approval_comments.approval_request_id AND ar.user_id = auth.uid()
    )
  );
