import type { PageServerLoad } from './$types';
import { getGinDb } from '$lib/server/notion-client';

export const load: PageServerLoad = async () => {
	const ginDb = await getGinDb();
	return { ginDb };
};
