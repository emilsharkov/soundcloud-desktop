import { z } from 'zod';

// ===== Media - Track =====
export const GetTrackWaveformQuerySchema = z.object({
    id: z.number(),
});

export const GetStreamUrlQuerySchema = z.object({
    id: z.number(),
    stream_type: z.enum(['hls', 'progressive', 'none']).optional(),
});

// ===== Type exports =====
export type GetTrackWaveformQuery = z.infer<typeof GetTrackWaveformQuerySchema>;
export type GetStreamUrlQuery = z.infer<typeof GetStreamUrlQuerySchema>;
