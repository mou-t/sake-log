type ImageQuery = {
	w?: string;
	h?: string;
	fit?: string;
	q?: string;
	dpr?: string;
	fm?: string;
};

type SrcsetOption = [ImageQuery, string];

export const generateSrc = (imageUrl: string, query: ImageQuery) => {
	return `${imageUrl}?${new URLSearchParams(query)}`;
};

export const generateSrcset = (imageUrl: string) => {
	const srcsetOption = [
		[{ dpr: '1', w: '300' }, '1x'],
		[{ dpr: '2', w: '300' }, '2x'],
		[{ dpr: '3', w: '300' }, '3x'],
		[{ dpr: '4', w: '300' }, '4x']
	] satisfies SrcsetOption[];
	const srcset = srcsetOption
		.map(([query, size]) => `${generateSrc(imageUrl, query)} ${size}`)
		.join(',');
	return srcset;
};
