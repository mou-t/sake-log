export type CountryRef = {
	id?: string;
	japanese?: string;
	english?: string;
	prefecture?: string;
	region?: string;
	area?: string;
	prefectureName?: string;
	origin?: string;
};

export type SakeEntry = {
	id: string;
	name: string;
	image?: { url: string } | null;
	link?: unknown[] | null;
	country?: CountryRef | string | null;
	prefecture?: string;
	region?: string;
	area?: string;
	prefectureName?: string;
	origin?: string;
	createdAt?: string;
	publishedAt?: string;
};

export type PresentedLink = {
	href: string;
	title: string;
	subtitle: string;
};

export type Highlight = {
	name: string;
	initial: string;
	country: string;
};
