import { z } from 'zod';

// Base schemas for location data
const latitudeSchema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);
const altitudeSchema = z.number().optional();
const speedSchema = z.number().min(0).optional();

// Schema for creating/updating a user location
export const locationSchema = z.object({
  latitude: latitudeSchema,
  longitude: longitudeSchema,
  altitude: altitudeSchema,
  speed: speedSchema,
});

// Schema for batch location updates
export const batchLocationSchema = z.object({
  locations: z.array(
    z.object({
      latitude: latitudeSchema,
      longitude: longitudeSchema,
      altitude: altitudeSchema,
      speed: speedSchema,
      timestamp: z.string().datetime().optional(),
    })
  ).min(1).max(100),
});

// Schema for location query parameters
export const locationQuerySchema = z.object({
  userID: z.string().uuid().optional(),
  teamID: z.string().uuid().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().positive().max(1000)
  ).optional().default('100'),
});

// Schema for historical location data
export const historicalLocationQuerySchema = z.object({
  userID: z.string().uuid(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  resolution: z.enum(['minute', 'hour', 'day']).optional().default('hour'),
}).refine(
  data => new Date(data.startDate) < new Date(data.endDate),
  {
    message: 'Start date must be before end date',
    path: ['startDate', 'endDate'],
  }
); 