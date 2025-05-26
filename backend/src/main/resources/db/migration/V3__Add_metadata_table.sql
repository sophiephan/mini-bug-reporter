-- Create a table for bug metadata
CREATE TABLE bug_metadata (
    bug_id BIGINT NOT NULL,
    metadata_value VARCHAR(1024),
    metadata_key VARCHAR(255) NOT NULL,
    PRIMARY KEY (bug_id, metadata_key),
    CONSTRAINT fk_bug_metadata_bug FOREIGN KEY (bug_id) REFERENCES bugs(id) ON DELETE CASCADE
);

-- Add index for faster lookups
CREATE INDEX idx_bug_metadata_key ON bug_metadata(metadata_key);

-- Add comments
COMMENT ON TABLE bug_metadata IS 'Stores custom metadata for bug reports';
COMMENT ON COLUMN bug_metadata.bug_id IS 'Foreign key to bugs table';
COMMENT ON COLUMN bug_metadata.metadata_key IS 'Metadata field name';
COMMENT ON COLUMN bug_metadata.metadata_value IS 'Metadata field value'; 