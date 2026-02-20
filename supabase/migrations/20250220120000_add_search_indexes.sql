-- Full-text search indexes for Search & Filter functionality
-- Enables fast full-text search across projects and approval requests

-- Projects: searchable text vector for title, description, client_name
CREATE INDEX IF NOT EXISTS idx_projects_search_fts
  ON projects
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(description, '') || ' ' || coalesce(client_name, '')));

-- Approval requests: searchable text vector for title, instructions
CREATE INDEX IF NOT EXISTS idx_approval_requests_search_fts
  ON approval_requests
  USING GIN(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(instructions, '')));

-- B-tree indexes for common filter columns (status, dates)
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects (status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_approval_requests_status ON approval_requests (status);
CREATE INDEX IF NOT EXISTS idx_approval_requests_project_id ON approval_requests (project_id);
CREATE INDEX IF NOT EXISTS idx_approval_requests_created_at ON approval_requests (created_at DESC);
