import { z } from 'zod';
import { AlertType } from '@prisma/client';

// Base schemas for location data
const latitudeSchema = z.number().min(-90).max(90);
const longitudeSchema = z.number().min(-180).max(180);
const messageSchema = z.string().min(1).max(500).trim();

// Schema for creating a new alert
export const createAlertSchema = z.object({
  type: z.nativeEnum(AlertType),
  message: messageSchema,
  lastLatitude: latitudeSchema,
  lastLongitude: longitudeSchema,
});

// Schema for updating an alert
export const updateAlertSchema = z.object({
  resolved: z.boolean(),
});

// Schema for alert ID in params
export const alertIdParamSchema = z.object({
  alertID: z.string().uuid({
    message: 'Invalid alert ID format',
  }),
});

// Schema for alert query parameters
export const alertQuerySchema = z.object({
  userID: z.string().uuid().optional(),
  teamID: z.string().uuid().optional(),
  resolved: z.enum(['true', 'false']).optional(),
  type: z.nativeEnum(AlertType).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  limit: z.string().regex(/^\d+$/).transform(Number).pipe(
    z.number().int().positive().max(1000)
  ).optional().default('100'),
});

// Schema for creating a new emergency alert
export const createEmergencyAlertSchema = z.object({
  message: messageSchema.optional(),
  latitude: latitudeSchema,
  longitude: longitudeSchema,
});

// Schema for emergency alert ID in params
export const emergencyAlertIdParamSchema = z.object({
  alertID: z.string().uuid({
    message: 'Invalid emergency alert ID format',
  }),
}); 