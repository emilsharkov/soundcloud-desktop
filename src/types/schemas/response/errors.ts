import { z } from 'zod';

// ===== Error Schemas =====
// Matches Rust AppError variants
export const AppErrorTypeSchema = z.enum(['network', 'other']);

// Matches Rust ErrorResponse struct from src-tauri/src/commands/utils.rs
export const ErrorResponseSchema = z.object({
    type: AppErrorTypeSchema,
    message: z.string(),
});

// ===== Type exports =====
export type AppErrorType = z.infer<typeof AppErrorTypeSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
