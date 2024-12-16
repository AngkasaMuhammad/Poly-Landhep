-- Create the table
CREATE TABLE IF NOT EXISTS pipe_list (
    id INT4 PRIMARY KEY UNIQUE GENERATED ALWAYS AS IDENTITY,
    waktu_edit TEXT,
    attrarr TEXT,-- format format format .....
    bindarr TEXT,-- ref ref ref .....
    draw INT4,-- ref
    index INT4,-- ref
    vertex INT4,-- ref
    wgsl TEXT
);

-- Enable Row-Level Security (RLS)
ALTER TABLE pipe_list ENABLE ROW LEVEL SECURITY;
-- Grant replication role for realtime updates
ALTER TABLE pipe_list REPLICA IDENTITY FULL;

-- Create a ALL policy for the public role
CREATE POLICY all_pipe_list ON pipe_list
    FOR ALL
    TO PUBLIC
    USING (true);

-- Grant ALL permissions to the public role
GRANT ALL ON TABLE pipe_list TO PUBLIC;




-- Create the table
CREATE TABLE IF NOT EXISTS buffer_list (
    id INT4 PRIMARY KEY UNIQUE GENERATED ALWAYS AS IDENTITY,
    waktu_edit TEXT,
    usage TEXT,
    buffer TEXT
);

-- Enable Row-Level Security (RLS)
ALTER TABLE buffer_list ENABLE ROW LEVEL SECURITY;
-- Grant replication role for realtime updates
ALTER TABLE buffer_list REPLICA IDENTITY FULL;

-- Create a ALL policy for the public role
CREATE POLICY all_pipe_list ON buffer_list
    FOR ALL
    TO PUBLIC
    USING (true);

-- Grant ALL permissions to the public role
GRANT ALL ON TABLE buffer_list TO PUBLIC;




