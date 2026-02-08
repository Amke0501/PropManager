-- Migration: Create notices and notice_reads tables
-- Description: Adds support for announcements/notices system

-- Notices table - stores announcements created by admins
CREATE TABLE IF NOT EXISTS notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT CHECK (priority IN ('normal', 'high', 'urgent')) DEFAULT 'normal',
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notice reads table - tracks which users have read which notices
CREATE TABLE IF NOT EXISTS notice_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notice_id UUID REFERENCES notices(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  read_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(notice_id, user_id) -- Prevent duplicate read entries
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_notices_created_at ON notices(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notice_reads_user_id ON notice_reads(user_id);
CREATE INDEX IF NOT EXISTS idx_notice_reads_notice_id ON notice_reads(notice_id);

-- Add comments for documentation
COMMENT ON TABLE notices IS 'Stores announcements and notices posted by admins for all tenants';
COMMENT ON TABLE notice_reads IS 'Tracks which users have read which notices';
COMMENT ON COLUMN notices.priority IS 'Priority level: normal, high, or urgent';
