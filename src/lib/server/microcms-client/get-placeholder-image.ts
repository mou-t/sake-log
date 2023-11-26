import { generateSrc } from '$lib/utils/microcms-image';
import { getPlaiceholder } from 'plaiceholder';

export const getPlaceHolderImage = async (imageUrl: string) => {
	const buffer = await fetch(generateSrc(imageUrl, { w: '100' })).then(async (res) =>
		Buffer.from(await res.arrayBuffer())
	);

	const placeHolder = await getPlaiceholder(buffer);

	return placeHolder;
};
