-- Run once to ensure PostGIS available and create simple table
CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS comps (
  id serial PRIMARY KEY,
  source VARCHAR(100),
  sale_date DATE,
  price BIGINT,
  surface REAL,
  rooms INTEGER,
  property_type VARCHAR(50),
  condition_score INTEGER,
  geom geometry(POINT, 4326)
);

-- index for fast spatial queries
CREATE INDEX IF NOT EXISTS idx_comps_geom ON comps USING GIST (geom);
