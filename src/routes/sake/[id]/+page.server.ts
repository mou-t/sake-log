import { getGinDb } from '$lib/server/notion-client/gin-database.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	const ginDb = await getGinDb();
	const gin = ginDb.find(({ id }) => id === params.id);
	if (!gin) throw error(404, 'Not found');
	return gin;
};
