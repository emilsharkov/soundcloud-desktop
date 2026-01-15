import z from 'zod';

export const TrackMediaMetadataSchema = z.object({
    title: z.string(),
    artist: z.string(),
    artwork: z.string(),
});

export type TrackMediaMetadata = z.infer<typeof TrackMediaMetadataSchema>;
