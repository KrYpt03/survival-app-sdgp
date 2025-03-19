/**
 * Database Optimization Script
 * 
 * This script applies performance optimizations to the database
 * including creating indexes for frequently queried fields.
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to migration file
const MIGRATION_FILE = path.join(__dirname, '../prisma/migrations/optimize_indexes/migration.sql');

// Check if migration file exists
if (!fs.existsSync(MIGRATION_FILE)) {
  console.error(`Migration file not found: ${MIGRATION_FILE}`);
  process.exit(1);
}

console.log('Starting database optimization...');

try {
  // Read the migration SQL
  const sql = fs.readFileSync(MIGRATION_FILE, 'utf8');

  // Create temporary migration file for Prisma to execute
  const tempMigrationDir = path.join(__dirname, '../prisma/migrations/manual_optimize');
  
  if (!fs.existsSync(tempMigrationDir)) {
    fs.mkdirSync(tempMigrationDir, { recursive: true });
  }

  // Write migration.sql
  fs.writeFileSync(path.join(tempMigrationDir, 'migration.sql'), sql);

  // Create migration metadata
  const metadata = {
    id: 'manual_optimize',
    checksum: Math.random().toString(36).substring(2),
    steps: [
      { script: 'migration.sql', directive: 'ExecuteScript' }
    ],
    migration_name: 'manual_optimize'
  };

  // Write migration_lock.toml
  fs.writeFileSync(
    path.join(tempMigrationDir, 'migration.toml'), 
    `# Prisma Migration File
migration_id = "${metadata.id}"
checksum = "${metadata.checksum}"
`
  );

  // Run prisma migrate
  console.log('Applying optimization migrations...');
  execSync('npx prisma migrate resolve --applied manual_optimize', { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  // Execute the SQL directly for immediate effect
  console.log('Executing optimization SQL...');
  
  // Quote the file path to handle spaces properly
  const quotedPath = `"${MIGRATION_FILE}"`;
  execSync(`npx prisma db execute --file=${quotedPath}`, { 
    stdio: 'inherit',
    cwd: path.join(__dirname, '..')
  });

  console.log('✅ Database optimization completed successfully');
} catch (error) {
  console.error('❌ Error optimizing database:', error.message);
  process.exit(1);
} 