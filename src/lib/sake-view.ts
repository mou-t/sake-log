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

/** Two label characters, so a name like 十四代 is not a single 十 on the bottle. */
export function storyBottleMark(name: string) {
	const chars = [...gridLabel(name)];
	return { primary: chars[0] ?? '酒', secondary: chars[1] ?? '' };
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

export function homeQuery(view?: string | null) {
	return view === 'list' ? '/?view=list' : '/';
}

export function highlightStoryHref(country: string, index = 1) {
	return `/highlight/${encodeURIComponent(country)}/${index}`;
}

export type StoryHighlight = Highlight & {
	entries: SakeEntry[];
};

export type StoryCursor = {
	highlightIndex: number;
	slideIndex: number;
};

export type StoryAction = 'prev-slide' | 'next-slide' | 'prev-highlight' | 'next-highlight';

export type StoryMove =
	| { type: 'go'; highlightIndex: number; slideIndex: number }
	| { type: 'close' }
	| { type: 'stay' };

export type StoryTarget = {
	href: string | null;
	name: string | null;
};

export function storyHighlights(entries: SakeEntry[]): StoryHighlight[] {
	return countryHighlights(entries)
		.map((highlight) => ({
			...highlight,
			entries: filterEntries(entries, { country: highlight.country }),
		}))
		.filter((highlight) => highlight.entries.length > 0);
}

export function moveStory(counts: number[], cursor: StoryCursor, action: StoryAction): StoryMove {
	const current = cursor.highlightIndex;
	if (action === 'prev-slide') {
		if (cursor.slideIndex > 0) {
			return { type: 'go', highlightIndex: current, slideIndex: cursor.slideIndex - 1 };
		}
		return { type: 'stay' };
	}
	if (action === 'next-slide') {
		const count = counts[current] ?? 0;
		if (cursor.slideIndex < count - 1) {
			return { type: 'go', highlightIndex: current, slideIndex: cursor.slideIndex + 1 };
		}
		const neighbor = stepHighlight(counts, current, 1);
		return neighbor.type === 'go' ? neighbor : { type: 'close' };
	}
	const direction = action === 'next-highlight' ? 1 : -1;
	const neighbor = stepHighlight(counts, current, direction);
	return neighbor.type === 'go' ? neighbor : { type: 'stay' };
}

export function storyTarget(
	stories: StoryHighlight[],
	cursor: StoryCursor,
	action: StoryAction,
): StoryTarget {
	const move = moveStory(
		stories.map((story) => story.entries.length),
		cursor,
		action,
	);
	if (move.type === 'stay') return { href: null, name: null };
	if (move.type === 'close') return { href: '/', name: null };
	const story = stories[move.highlightIndex];
	if (!story) return { href: '/', name: null };
	return {
		href: highlightStoryHref(story.country, move.slideIndex + 1),
		name: story.name,
	};
}

function stepHighlight(counts: number[], from: number, direction: 1 | -1): StoryMove {
	let index = from + direction;
	while (index >= 0 && index < counts.length && counts[index] === 0) index += direction;
	if (index < 0 || index >= counts.length) return { type: 'stay' };
	return { type: 'go', highlightIndex: index, slideIndex: 0 };
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
