import { getSakeList } from '$lib/server/microcms-client';

export const prerender = true;

export const load = async () => {
	const sakeList = await getSakeList({ limit: 100 });
	return { sakeList };
};
