import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

export const userProfileSchema = z.object({
  fullName: z.string().trim().min(2, UI_MESSAGES.VALIDATION_FULL_NAME),
  phone: z
    .string()
    .trim()
    .max(30, UI_MESSAGES.USER_PROFILE_PHONE_MAX)
    .optional()
    .or(z.literal('')),
  city: z
    .string()
    .trim()
    .max(120, UI_MESSAGES.USER_PROFILE_CITY_MAX)
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .trim()
    .max(120, UI_MESSAGES.USER_PROFILE_DEPARTMENT_MAX)
    .optional()
    .or(z.literal('')),
  bio: z
    .string()
    .trim()
    .max(500, UI_MESSAGES.USER_PROFILE_BIO_MAX)
    .optional()
    .or(z.literal('')),
  avatarUrl: z.union([
    z.literal(''),
    z.string().trim().url(UI_MESSAGES.USER_PROFILE_AVATAR_URL_INVALID),
  ]),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
