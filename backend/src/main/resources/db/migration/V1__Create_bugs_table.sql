CREATE TABLE bugs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    screenshot_url VARCHAR(1024),
    created_at TIMESTAMP NOT NULL,
    status VARCHAR(20) NOT NULL
);

-- Add indexes for common queries
CREATE INDEX idx_bugs_status ON bugs(status);
CREATE INDEX idx_bugs_created_at ON bugs(created_at DESC);

-- Add comments for documentation
COMMENT ON TABLE bugs IS 'Stores bug reports submitted by users';
COMMENT ON COLUMN bugs.id IS 'Primary key';
COMMENT ON COLUMN bugs.title IS 'Bug title/summary';
COMMENT ON COLUMN bugs.description IS 'Detailed description of the bug';
COMMENT ON COLUMN bugs.screenshot_url IS 'URL to screenshot showing the bug';
COMMENT ON COLUMN bugs.created_at IS 'Timestamp when the bug was reported';
COMMENT ON COLUMN bugs.status IS 'Current status: OPEN, IN_PROGRESS, or CLOSED'; 