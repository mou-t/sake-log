import type { Highlight, PresentedLink, SakeEntry } from './types';

const FEATURED_COUNTRIES = 3;
const PLACE_KEYS = ['prefecture', 'region', 'area', 'prefectureName', 'origin'] as const;

export function countryName(entry: SakeEntry) {
	const country = entry.country;
	if (!country || typeof country === 'string') return 'その他';
	return country.japanese?.trim() || country.english?.trim() || 'その他';
}

export function gridLabel(name: string) {
	const token = name.trim().split(/\s+/)[0] ?? name.trim();
	const chars = [...token];
	if (chars.length <= 8) return token;
	return chars.slice(0, 8).join('');
}

export function heroMark(name: string) {
	const chars = [...gridLabel(name)];
	if (chars.length === 2) {
		return { primary: chars[0] ?? '酒', secondary: chars[1] ?? '' };
	}
	return { primary: chars[0] ?? '酒', secondary: '' };
}

export function placeName(entry: SakeEntry) {
	const country = countryName(entry);
	const sources: object[] = [entry];
	if (entry.country && typeof entry.country === 'object') sources.push(entry.country);
	for (const source of sources) {
		const record = source as Record<string, unknown>;
		for (const key of PLACE_KEYS) {
			const value = record[key];
			if (typeof value !== 'string') continue;
			const label = value.trim();
			if (label && label !== country) return label;
		}
	}
	return undefined;
}

export function profileStats(entries: SakeEntry[]) {
	const countries = new Set(entries.map(countryName));
	const years = new Set(
		entries.map(yearInTokyo).filter((year): year is number => year !== null),
	);
	return {
		posts: entries.length,
		countries: countries.size,
		years: years.size,
	};
}

export function countryHighlights(entries: SakeEntry[]): Highlight[] {
	const counts = new Map<string, number>();
	const order = new Map<string, number>();
	for (const entry of entries) {
		const name = countryName(entry);
		if (!order.has(name)) order.set(name, order.size);
		counts.set(name, (counts.get(name) ?? 0) + 1);
	}
	const sorted = [...counts.entries()].sort(
		(a, b) => b[1] - a[1] || (order.get(a[0]) ?? 0) - (order.get(b[0]) ?? 0),
	);
	const featured = sorted.slice(0, FEATURED_COUNTRIES).map(([name]) => ({
		name,
		initial: [...name][0] ?? '・',
		country: name,
	}));
	if (sorted.length > FEATURED_COUNTRIES) {
		featured.push({ name: 'その他', initial: 'そ', country: 'other' });
	}
	return featured;
}

export function filterEntries(
	entries: SakeEntry[],
	options: { country?: string | null; q?: string | null },
) {
	const country = options.country?.trim() ?? '';
	const query = options.q?.trim().toLocaleLowerCase('ja') ?? '';
	const featured = new Set(
		countryHighlights(entries)
			.filter((item) => item.country !== 'other')
			.map((item) => item.country),
	);
	return entries.filter((entry) => {
		const name = countryName(entry);
		if (country === 'other' && featured.has(name)) return false;
		if (country && country !== 'other' && name !== country) return false;
		if (!query) return true;
		const haystack = `${entry.name} ${name} ${placeName(entry) ?? ''}`.toLocaleLowerCase('ja');
		return haystack.includes(query);
	});
}

export function presentLinks(links: unknown[] | null | undefined): PresentedLink[] {
	if (!Array.isArray(links)) return [];
	return links.flatMap((item) => {
		const link = presentLink(item);
		return link ? [link] : [];
	});
}

export function homeQuery(params: { country?: string | null; view?: string | null }) {
	const search = new URLSearchParams();
	if (params.country) search.set('country', params.country);
	if (params.view === 'list') search.set('view', 'list');
	const query = search.toString();
	return query ? `/?${query}` : '/';
}

export function highlightHref(
	highlight: Highlight,
	current: { country?: string | null; view?: string | null },
) {
	const active = current.country === highlight.country;
	return homeQuery({
		country: active ? null : highlight.country,
		view: current.view,
	});
}

function presentLink(raw: unknown): PresentedLink | null {
	if (!raw || typeof raw !== 'object') return null;
	const record = raw as Record<string, unknown>;
	const href = firstString(record, ['link', 'url', 'href']);
	if (!href) return null;
	let host = href.replace(/^https?:\/\//, '');
	let pathname = '';
	try {
		const url = new URL(href);
		host = url.hostname.replace(/^www\./, '');
		pathname = url.pathname;
	} catch {
		// Keep the raw string when it is not an absolute URL.
	}
	const title =
		firstString(record, ['title', 'label', 'text']) ??
		(pathname === '' || pathname === '/' ? '公式サイト' : '関連ページ');
	const subtitle = firstString(record, ['note', 'description', 'caption']) ?? host;
	return { href, title, subtitle };
}

function firstString(record: Record<string, unknown>, keys: string[]) {
	for (const key of keys) {
		const value = record[key];
		if (typeof value === 'string' && value.trim()) return value.trim();
	}
	return undefined;
}

function yearInTokyo(entry: SakeEntry) {
	const raw = entry.publishedAt || entry.createdAt;
	if (!raw) return null;
	const time = Date.parse(raw);
	if (Number.isNaN(time)) return null;
	const year = Number(
		new Intl.DateTimeFormat('en-US', {
			timeZone: 'Asia/Tokyo',
			year: 'numeric',
		}).format(new Date(time)),
	);
	return Number.isInteger(year) ? year : null;
}
