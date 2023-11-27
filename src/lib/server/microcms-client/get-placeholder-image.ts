import { generateSrc } from '$lib/utils/microcms-image';

export const getPlaceHolderBase64 = async (imageUrl: string) => {
	const buffer = await fetch(generateSrc(imageUrl, { w: '8', fm: 'png' })).then(async (res) =>
		Buffer.from(await res.arrayBuffer())
	);

	return `data:image/png;base64,${buffer.toString('base64')}`;
};
