import { getSake } from '$lib/server/microcms-client/sake.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const sake = await getSake(params.id);
		return sake;
	} catch (e) {
		throw error(404, 'Not found');
	}
};
