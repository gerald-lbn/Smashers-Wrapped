import { z } from 'zod';

export const thisIsMyRecapSchema = z.object({
	name: z.string(),
	image: z.string().url().optional(),
	country: z.string().optional(),
	genderPronouns: z.string().optional()
});

export type ThisIsMyRecapType = z.infer<typeof thisIsMyRecapSchema>;
