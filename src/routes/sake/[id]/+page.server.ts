import { getPlaceHolderImage } from '$lib/server/microcms-client/get-placeholder-image.js';
import { getSake } from '$lib/server/microcms-client/sake.js';
import { error } from '@sveltejs/kit';

export const load = async ({ params }) => {
	try {
		const sake = await getSake(params.id);
		const placeholder = await getPlaceHolderImage(sake.image.url);
		return { ...sake, placeholder: placeholder.base64 };
	} catch (e) {
		throw error(404, 'Not found');
	}
};
