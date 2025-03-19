/**
 * Database Health Check Script
 * 
 * This script performs health checks on the database and generates performance reports.
 * It can be used to identify slow queries and tables that need optimization.
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Initialize Prisma client with logging
const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'error', emit: 'stdout' },
  ],
});

// Create reports directory if it doesn't exist
const REPORTS_DIR = path.join(__dirname, '../db-reports');
if (!fs.existsSync(REPORTS_DIR)) {
  fs.mkdirSync(REPORTS_DIR, { recursive: true });
}

// Store query timing data
const queryTimings = [];
prisma.$on('query', (e) => {
  queryTimings.push({
    query: e.query,
    params: e.params,
    duration: e.duration,
    timestamp: new Date().toISOString(),
  });
});

// Function to get table sizes
async function getTableSizes() {
  try {
    // This query works for PostgreSQL
    const result = await prisma.$queryRaw`
      SELECT
        table_name,
        pg_size_pretty(pg_total_relation_size('"' || table_schema || '"."' || table_name || '"')) as size,
        pg_relation_size('"' || table_schema || '"."' || table_name || '"') as raw_size
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY raw_size DESC;
    `;
    return result;
  } catch (error) {
    console.error('Failed to get table sizes:', error);
    return [];
  }
}

// Function to get table row counts
async function getTableRowCounts() {
  try {
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    `;
    
    const counts = [];
    for (const table of tables) {
      const tableName = table.table_name;
      const countResult = await prisma.$queryRawUnsafe(
        `SELECT COUNT(*) as count FROM "${tableName}"`
      );
      counts.push({
        table: tableName,
        count: Number(countResult[0].count),
      });
    }
    
    return counts.sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Failed to get row counts:', error);
    return [];
  }
}

// Function to check for tables without indexes
async function getTablesWithoutIndexes() {
  try {
    const result = await prisma.$queryRaw`
      SELECT t.table_name
      FROM information_schema.tables t
      LEFT JOIN pg_indexes i ON t.table_name = i.tablename
      WHERE t.table_schema = 'public' AND t.table_type = 'BASE TABLE'
      GROUP BY t.table_name
      HAVING COUNT(i.indexname) = 0;
    `;
    return result;
  } catch (error) {
    console.error('Failed to check for tables without indexes:', error);
    return [];
  }
}

// Function to find slow queries
async function getSampleSlowQueries() {
  // Get sample queries across different tables
  const tables = ['User', 'Team', 'UserLocation', 'Alert', 'EmergencyAlert'];
  
  // Run sample queries
  for (const table of tables) {
    try {
      await prisma[table].findMany({ take: 10 });
      console.log(`Ran sample query on ${table} table`);
    } catch (error) {
      console.error(`Failed to query ${table} table:`, error.message);
    }
  }
  
  // Try some more complex queries
  try {
    await prisma.user.findMany({
      where: { 
        teamID: { not: null } 
      },
      include: {
        team: true,
        locations: {
          orderBy: { timestamp: 'desc' },
          take: 1
        }
      },
      take: 10
    });
    console.log('Ran complex join query');
  } catch (error) {
    console.error('Failed to run complex query:', error.message);
  }
  
  // Sort and return the slowest queries
  return queryTimings
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
}

// Main function
async function main() {
  console.log('Starting database health check...');
  
  const startTime = Date.now();
  const results = {
    timestamp: new Date().toISOString(),
    databaseUrl: process.env.DATABASE_URL?.replace(/:[^:]+@/, ':****@'), // Hide password
    tableSizes: [],
    tableRowCounts: [],
    tablesWithoutIndexes: [],
    slowestQueries: [],
    durationMs: 0
  };
  
  try {
    console.log('Checking table sizes...');
    results.tableSizes = await getTableSizes();
    
    console.log('Counting table rows...');
    results.tableRowCounts = await getTableRowCounts();
    
    console.log('Checking for tables without indexes...');
    results.tablesWithoutIndexes = await getTablesWithoutIndexes();
    
    console.log('Running sample queries to identify performance issues...');
    results.slowestQueries = await getSampleSlowQueries();
    
    results.durationMs = Date.now() - startTime;
    
    // Generate report
    const reportPath = path.join(REPORTS_DIR, `db-health-report-${new Date().toISOString().replace(/:/g, '-')}.json`);
    
    // Custom replacer to handle BigInt serialization
    const replacer = (key, value) => {
      // Convert BigInt to String
      if (typeof value === 'bigint') {
        return value.toString();
      }
      return value;
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(results, replacer, 2));
    
    console.log(`✅ Database health check completed in ${results.durationMs}ms`);
    console.log(`Report saved to: ${reportPath}`);
    
    // Print summary
    console.log('\n=== Database Health Summary ===');
    console.log(`Total tables: ${results.tableSizes.length}`);
    console.log(`Tables without indexes: ${results.tablesWithoutIndexes.length}`);
    console.log(`Largest table: ${results.tableSizes[0]?.table_name || 'N/A'} (${results.tableSizes[0]?.size || 'N/A'})`);
    console.log(`Table with most rows: ${results.tableRowCounts[0]?.table || 'N/A'} (${results.tableRowCounts[0]?.count || 0} rows)`);
    console.log(`Slowest query: ${results.slowestQueries[0]?.duration || 0}ms`);
  } catch (error) {
    console.error('Error during health check:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 