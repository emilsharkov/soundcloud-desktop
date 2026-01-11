import { z } from 'zod';

// ===== Utility Schemas =====
export const PagingCollectionSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        collection: z.array(itemSchema),
    });

// ===== Utility Types =====
export type PagingCollection<T> = { collection: T[] };
