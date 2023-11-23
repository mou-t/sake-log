import { getSakeList } from '$lib/server/microcms-client';

export const load = async () => {
	const sakeList = await getSakeList();
	return { sakeList };
};
