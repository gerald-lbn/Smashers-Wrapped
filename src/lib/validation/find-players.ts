import { z } from 'zod';

export const findPlayerResultSchema = z.object({
	total_count: z.number(),
	meta: z.array(z.unknown()),
	items: z.object({
		entities: z.object({
			rankingSeries: z.array(z.unknown()),
			rankingIteration: z.array(z.unknown()),
			player: z.array(
				z.object({
					id: z.number(),
					gamerTag: z.string(),
					prefix: z.string().nullable(),
					smashboardsLink: z.number().nullable().optional(),
					smashboardsUserId: z.number().nullable().optional(),
					playerType: z.number().nullable().optional(),
					rank: z.number().nullable().optional(),
					color: z.string().nullable().optional(),
					gamerTagChangedAt: z.number().nullable().optional(),
					rankings: z.array(z.unknown()),
					inFantasy: z.boolean(),
					hasUser: z.boolean().optional().optional(),
					permissionType: z.string()
				})
			)
		}),
		result: z.array(z.number()),
		resultEntity: z.string()
	}),
	query: z.object({
		filter: z.object({ gamerTag: z.string() }),
		page: z.number(),
		per_page: z.number()
	}),
	actionRecords: z.array(z.unknown())
});

export type FindPlayerResultSchema = z.infer<typeof findPlayerResultSchema>;
export type Player = FindPlayerResultSchema['items']['entities']['player'][number];
