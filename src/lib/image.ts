type ImageQuery = Record<string, string | undefined>;

export function imageSrc(url: string, query: ImageQuery = {}) {
	const params = new URLSearchParams();
	for (const [key, value] of Object.entries(query)) {
		if (value) params.set(key, value);
	}
	const search = params.toString();
	if (!search) return url;
	return `${url}${url.includes('?') ? '&' : '?'}${search}`;
}

export function gridImage(url: string) {
	const crop = (size: string) =>
		imageSrc(url, { w: size, h: size, fit: 'crop', q: '75' });
	return {
		src: crop('480'),
		srcset: `${crop('240')} 240w, ${crop('480')} 480w, ${crop('800')} 800w`,
		sizes: '(max-width: 480px) 33vw, 160px',
	};
}

export function heroImage(url: string) {
	const sized = (width: string) => imageSrc(url, { w: width, q: '75' });
	return {
		src: sized('1400'),
		srcset: `${sized('720')} 720w, ${sized('1400')} 1400w`,
		sizes: '(max-width: 480px) 100vw, 480px',
	};
}

export function transitionName(id: string) {
	const safe = id.replace(/[^A-Za-z0-9_-]/g, '');
	return `sake-${safe || 'item'}`;
}
