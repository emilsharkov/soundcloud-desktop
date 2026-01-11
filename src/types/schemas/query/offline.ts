import { z } from 'zod';

// ===== Offline =====
export const GetOfflineModeQuerySchema = z.undefined();

export const SetOfflineModeQuerySchema = z.object({
    offline: z.boolean(),
});

export const TestConnectivityQuerySchema = z.undefined();

// ===== Type exports =====
export type GetOfflineModeQuery = z.infer<typeof GetOfflineModeQuerySchema>;
export type SetOfflineModeQuery = z.infer<typeof SetOfflineModeQuerySchema>;
export type TestConnectivityQuery = z.infer<typeof TestConnectivityQuerySchema>;
