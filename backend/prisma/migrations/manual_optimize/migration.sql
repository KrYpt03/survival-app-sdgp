-- Add optimized indexes for location tracking
-- These will significantly improve geospatial queries and team tracking performance

-- UserLocation indexes for faster location retrieval
CREATE INDEX IF NOT EXISTS "userLocation_userID_timestamp_idx" ON "UserLocation" ("userID", "timestamp" DESC);
CREATE INDEX IF NOT EXISTS "userLocation_timestamp_idx" ON "UserLocation" ("timestamp" DESC);

-- Spatial index on coordinates to improve geospatial queries
CREATE INDEX IF NOT EXISTS "userLocation_spatial_idx" ON "UserLocation" ("latitude", "longitude");

-- Index to optimize syncing operations
CREATE INDEX IF NOT EXISTS "userLocation_isSynced_idx" ON "UserLocation" ("isSynced")
  WHERE "isSynced" = false;

-- User indexes for team-based queries
CREATE INDEX IF NOT EXISTS "user_teamID_idx" ON "User" ("teamID")
  WHERE "teamID" IS NOT NULL;

-- Index for last known position - used in team member tracking
CREATE INDEX IF NOT EXISTS "user_lastPosition_idx" ON "User" ("lastLatitude", "lastLongitude")
  WHERE "lastLatitude" IS NOT NULL AND "lastLongitude" IS NOT NULL;

-- Team indexes for team-based operations
CREATE INDEX IF NOT EXISTS "team_active_idx" ON "Team" ("active")
  WHERE "active" = true;

-- Alert indexes to improve alert listing
CREATE INDEX IF NOT EXISTS "alert_resolved_timestamp_idx" ON "Alert" ("resolved", "timestamp" DESC);
CREATE INDEX IF NOT EXISTS "alert_teamID_timestamp_idx" ON "Alert" ("teamID", "timestamp" DESC);

-- EmergencyAlert indexes
CREATE INDEX IF NOT EXISTS "emergencyAlert_teamID_timestamp_idx" ON "EmergencyAlert" ("teamID", "timestamp" DESC); 