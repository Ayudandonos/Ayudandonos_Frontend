import { z } from 'zod';
import { UI_MESSAGES } from '@/constants/messages.constants';

const passwordField = z
  .string()
  .min(8, UI_MESSAGES.VALIDATION_PASSWORD_MIN)
  .regex(/[A-Z]/, UI_MESSAGES.VALIDATION_PASSWORD_UPPERCASE)
  .regex(/[0-9]/, UI_MESSAGES.VALIDATION_PASSWORD_NUMBER);

const emailField = z.string().trim().toLowerCase().email(UI_MESSAGES.VALIDATION_EMAIL);

const fullNameField = z.string().trim().min(2, UI_MESSAGES.VALIDATION_FULL_NAME);

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, UI_MESSAGES.VALIDATION_PASSWORD_MIN),
  remember: z.boolean().optional(),
});

export const registerUserSchema = z
  .object({
    fullName: fullNameField,
    email: emailField,
    phone: z.string().optional(),
    password: passwordField,
    confirmPassword: z.string(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: UI_MESSAGES.AUTH_TERMS_REQUIRED }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: UI_MESSAGES.VALIDATION_PASSWORD_MATCH,
    path: ['confirmPassword'],
  });

export const registerFoundationSchema = z
  .object({
    fullName: fullNameField,
    email: emailField,
    phone: z.string().optional(),
    password: passwordField,
    confirmPassword: z.string(),
    foundationName: z.string().trim().min(2, UI_MESSAGES.VALIDATION_FOUNDATION_NAME),
    description: z.string().trim().max(500).optional(),
    acceptTerms: z.literal(true, { errorMap: () => ({ message: UI_MESSAGES.AUTH_TERMS_REQUIRED }) }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: UI_MESSAGES.VALIDATION_PASSWORD_MATCH,
    path: ['confirmPassword'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterUserFormData = z.infer<typeof registerUserSchema>;
export type RegisterFoundationFormData = z.infer<typeof registerFoundationSchema>;
