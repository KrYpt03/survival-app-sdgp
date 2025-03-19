-- Add indexes to frequently queried fields
-- These will improve query performance significantly

-- Team indexes
CREATE INDEX IF NOT EXISTS "team_teamCode_idx" ON "Team" ("teamCode");
CREATE INDEX IF NOT EXISTS "team_active_idx" ON "Team" ("active");

-- User indexes
CREATE INDEX IF NOT EXISTS "user_teamID_idx" ON "User" ("teamID");
CREATE INDEX IF NOT EXISTS "user_email_idx" ON "User" ("email");
CREATE INDEX IF NOT EXISTS "user_clerkID_idx" ON "User" ("clerkID");
CREATE INDEX IF NOT EXISTS "user_location_idx" ON "User" ("lastLatitude", "lastLongitude") 
  WHERE "lastLatitude" IS NOT NULL AND "lastLongitude" IS NOT NULL;

-- UserLocation indexes
CREATE INDEX IF NOT EXISTS "userLocation_userID_idx" ON "UserLocation" ("userID");
CREATE INDEX IF NOT EXISTS "userLocation_timestamp_idx" ON "UserLocation" ("timestamp");
CREATE INDEX IF NOT EXISTS "userLocation_coords_idx" ON "UserLocation" ("latitude", "longitude");
CREATE INDEX IF NOT EXISTS "userLocation_synced_idx" ON "UserLocation" ("isSynced");

-- Alert indexes
CREATE INDEX IF NOT EXISTS "alert_userID_idx" ON "Alert" ("userID");
CREATE INDEX IF NOT EXISTS "alert_teamID_idx" ON "Alert" ("teamID");
CREATE INDEX IF NOT EXISTS "alert_timestamp_idx" ON "Alert" ("timestamp");
CREATE INDEX IF NOT EXISTS "alert_resolved_idx" ON "Alert" ("resolved");
CREATE INDEX IF NOT EXISTS "alert_type_idx" ON "Alert" ("type");

-- EmergencyAlert indexes
CREATE INDEX IF NOT EXISTS "emergencyAlert_userID_idx" ON "EmergencyAlert" ("userID");
CREATE INDEX IF NOT EXISTS "emergencyAlert_teamID_idx" ON "EmergencyAlert" ("teamID");
CREATE INDEX IF NOT EXISTS "emergencyAlert_timestamp_idx" ON "EmergencyAlert" ("timestamp"); 