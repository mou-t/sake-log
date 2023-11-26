type ImageQuery = {
	w?: string;
	h?: string;
	fit?: string;
	q?: string;
	dpr?: string;
	fm?: string;
};

export type SrcsetOption = [ImageQuery, string];

export const generateSrc = (imageUrl: string, query: ImageQuery) => {
	return `${imageUrl}?${new URLSearchParams(query)}`;
};

export const generateSrcset = (imageUrl: string, options: SrcsetOption[]) => {
	const srcset = options
		.map(([query, size]) => `${generateSrc(imageUrl, query)} ${size}`)
		.join(',');
	return srcset;
};
