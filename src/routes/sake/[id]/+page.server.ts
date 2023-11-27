import { getPlaceHolderBase64 } from '$lib/server/microcms-client/get-placeholder-image.js';
import { getSake } from '$lib/server/microcms-client/sake.js';
import { error } from '@sveltejs/kit';

export const prerender = true;

export const load = async ({ params }) => {
	try {
		const sake = await getSake(params.id);
		const base64 = await getPlaceHolderBase64(sake.image.url);
		return { ...sake, placeholder: base64 };
	} catch (e) {
		throw error(404, 'Not found');
	}
};
