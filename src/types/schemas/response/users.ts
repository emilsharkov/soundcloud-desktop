import { z } from 'zod';

// ===== Users =====
export const ProductSchema = z.object({
    id: z.string(),
});

export const CreatorSubscriptionWrapperSchema = z.object({
    product: ProductSchema,
});

export const VisualEntrySchema = z.object({
    urn: z.string().nullable(),
    entry_time: z.number().nullable(),
    visual_url: z.string().nullable(),
});

export const VisualsSchema = z.object({
    urn: z.string().nullable(),
    enabled: z.boolean().nullable(),
    visuals: z.array(VisualEntrySchema).nullable(),
});

export const BadgesSchema = z.object({
    pro: z.boolean().nullable(),
    creator_mid_tier: z.boolean().nullable(),
    pro_unlimited: z.boolean().nullable(),
    verified: z.boolean().nullable(),
});

export const DateOfBirthSchema = z.object({
    month: z.number().nullable(),
    year: z.number().nullable(),
    day: z.number().nullable(),
});

export const UserSummarySchema = z.object({
    id: z.number().nullable(),
    username: z.string().nullable(),
    permalink_url: z.string().nullable(),
    avatar_url: z.string().nullable(),
});

export const UserSchema = z.object({
    avatar_url: z.string().nullable(),
    city: z.string().nullable(),
    comments_count: z.number().nullable(),
    country_code: z.string().nullable(),
    created_at: z.string().nullable(),
    creator_subscriptions: z.array(CreatorSubscriptionWrapperSchema).nullable(),
    creator_subscription: CreatorSubscriptionWrapperSchema.nullable(),
    description: z.string().nullable(),
    followers_count: z.number().nullable(),
    followings_count: z.number().nullable(),
    first_name: z.string().nullable(),
    full_name: z.string().nullable(),
    groups_count: z.number().nullable(),
    id: z.number().nullable(),
    kind: z.string().nullable(),
    last_modified: z.string().nullable(),
    last_name: z.string().nullable(),
    likes_count: z.number().nullable(),
    playlist_likes_count: z.number().nullable(),
    permalink: z.string().nullable(),
    permalink_url: z.string().nullable(),
    playlist_count: z.number().nullable(),
    reposts_count: z.number().nullable(),
    track_count: z.number().nullable(),
    uri: z.string().nullable(),
    urn: z.string().nullable(),
    username: z.string().nullable(),
    verified: z.boolean().nullable(),
    visuals: VisualsSchema.nullable(),
    badges: BadgesSchema.nullable(),
    station_urn: z.string().nullable(),
    station_permalink: z.string().nullable(),
    date_of_birth: DateOfBirthSchema.nullable(),
});

// ===== Type exports =====
export type Product = z.infer<typeof ProductSchema>;
export type CreatorSubscriptionWrapper = z.infer<
    typeof CreatorSubscriptionWrapperSchema
>;
export type VisualEntry = z.infer<typeof VisualEntrySchema>;
export type Visuals = z.infer<typeof VisualsSchema>;
export type Badges = z.infer<typeof BadgesSchema>;
export type DateOfBirth = z.infer<typeof DateOfBirthSchema>;
export type UserSummary = z.infer<typeof UserSummarySchema>;
export type User = z.infer<typeof UserSchema>;
