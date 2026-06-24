CREATE TABLE scans (
  id SERIAL PRIMARY KEY ,
  target VARCHAR (255) NOT NULL ,
  status VARCHAR (20) NOT NULL DEFAULT 'pending' ,
  raw_result JSONB,
  scanned_at TIMESTAMP NOT NULL DEFAULT NOW ()
);
