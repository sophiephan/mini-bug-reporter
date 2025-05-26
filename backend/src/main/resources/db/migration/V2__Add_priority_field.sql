-- Add priority column to bugs table
ALTER TABLE bugs ADD COLUMN priority VARCHAR(20) DEFAULT 'MEDIUM' NOT NULL;

-- Add index for priority
CREATE INDEX idx_bugs_priority ON bugs(priority);

-- Add comment for documentation
COMMENT ON COLUMN bugs.priority IS 'Bug priority: LOW, MEDIUM, HIGH, CRITICAL'; 