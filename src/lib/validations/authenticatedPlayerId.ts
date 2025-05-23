import { z } from 'zod';

const authenticatedPlayerIdSchema = z.object({
	data: z.object({
		currentUser: z.object({
			player: z.object({
				id: z.number()
			})
		})
	}),
	extensions: z.object({
		cacheControl: z.object({
			version: z.number(),
			hint: z.unknown().nullable()
		}),
		queryComplexity: z.number()
	}),
	actionRecords: z.array(z.unknown())
});

export default authenticatedPlayerIdSchema;
