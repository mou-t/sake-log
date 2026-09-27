import type { SakeEntry } from './types';

const japan = { id: 'japan', japanese: '日本', english: 'Japan' };
const france = { id: 'france', japanese: 'フランス', english: 'France' };
const italy = { id: 'italy', japanese: 'イタリア', english: 'Italy' };
const spain = { id: 'spain', japanese: 'スペイン', english: 'Spain' };

/** Sample posts used only by `astro dev` when microCMS env vars are unset. */
export function fixtureEntries(): SakeEntry[] {
	return [
		{
			id: 'dassai',
			name: '獺祭 純米大吟醸 磨き二割三分',
			country: japan,
			prefecture: '山口県',
			publishedAt: '2024-04-02T00:00:00.000Z',
			link: [
				{ fieldId: 'link', link: 'https://www.asahishuzo.ne.jp/', title: '公式サイト' },
				{
					fieldId: 'link',
					link: 'https://www.asahishuzo.ne.jp/about',
					title: '蔵元について',
					note: '資料メモ',
				},
				{
					fieldId: 'link',
					link: 'https://www.asahishuzo.ne.jp/tasting',
					title: 'テイスティングノート',
					note: '自分のメモ',
				},
			],
		},
		entry('kubota', '久保田', japan, '2024-08-01T00:00:00.000Z'),
		entry('jikon', '而今', japan, '2025-02-01T00:00:00.000Z'),
		entry('aramasa', '新政', japan, '2025-05-01T00:00:00.000Z'),
		entry('juyondai', '十四代', japan, '2025-09-01T00:00:00.000Z'),
		entry('zaku', '作', france, '2026-01-10T00:00:00.000Z'),
		entry('akabu', '赤武', italy, '2026-03-01T00:00:00.000Z'),
		entry('jikon-2', '而今', japan, '2026-04-01T00:00:00.000Z'),
		entry('houou', '鳳凰', spain, '2026-05-01T00:00:00.000Z'),
	];
}

export function fixtureById(id: string) {
	return fixtureEntries().find((entry) => entry.id === id);
}

function entry(
	id: string,
	name: string,
	country: SakeEntry['country'],
	publishedAt: string,
): SakeEntry {
	return { id, name, country, publishedAt, link: [] };
}
