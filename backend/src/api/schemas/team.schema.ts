import { z } from 'zod';

// Base schemas for team data
const teamCodeSchema = z.string().min(4).max(10).regex(/^[A-Z0-9]+$/, {
  message: 'Team code must be uppercase alphanumeric characters only',
});

const teamNameSchema = z.string().min(3).max(50).trim();

const rangeSchema = z.number().positive().min(10).max(10000);

// Schema for creating a new team
export const createTeamSchema = z.object({
  teamName: teamNameSchema,
  range: rangeSchema.optional().default(100),
});

// Schema for joining a team
export const joinTeamSchema = z.object({
  teamCode: teamCodeSchema,
});

// Schema for updating a team
export const updateTeamSchema = z.object({
  teamName: teamNameSchema.optional(),
  range: rangeSchema.optional(),
  active: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Schema for team ID in params
export const teamIdParamSchema = z.object({
  teamID: z.string().uuid({
    message: 'Invalid team ID format',
  }),
});

// Schema for team code in params
export const teamCodeParamSchema = z.object({
  teamCode: teamCodeSchema,
});

// Schema for team members
export const teamMembersQuerySchema = z.object({
  includeLeader: z.enum(['true', 'false']).optional().default('true'),
  includeLocations: z.enum(['true', 'false']).optional().default('false'),
}); 