import { z } from 'zod';

// Base schemas for user data
const emailSchema = z.string().email().trim().toLowerCase();
const usernameSchema = z.string().min(3).max(30).trim().regex(/^[a-zA-Z0-9_]+$/, {
  message: 'Username can only contain alphanumeric characters and underscores',
});
const clerkIdSchema = z.string().min(5).trim();

// Schema for creating a new user
export const createUserSchema = z.object({
  email: emailSchema,
  username: usernameSchema,
  clerkID: clerkIdSchema,
});

// Schema for updating a user
export const updateUserSchema = z.object({
  username: usernameSchema.optional(),
  email: emailSchema.optional(),
  lastLatitude: z.number().min(-90).max(90).optional(),
  lastLongitude: z.number().min(-180).max(180).optional(),
  teamID: z.string().uuid().optional().nullable(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided',
});

// Schema for user ID in params
export const userIdParamSchema = z.object({
  userID: z.string().uuid({
    message: 'Invalid user ID format',
  }),
});

// Schema for querying users
export const userQuerySchema = z.object({
  teamID: z.string().uuid().optional(),
  username: z.string().optional(),
  email: z.string().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().positive().max(1000)
  ).optional().default('100'),
});

// Schema for Clerk webhook validation
export const clerkWebhookSchema = z.object({
  data: z.object({
    id: clerkIdSchema,
    email_addresses: z.array(
      z.object({
        email_address: emailSchema,
      })
    ).min(1),
    username: usernameSchema.optional(),
  }),
  type: z.enum([
    'user.created',
    'user.updated',
    'user.deleted',
  ]),
}); 