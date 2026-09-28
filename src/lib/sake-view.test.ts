import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { fixtureEntries } from './fixture.ts';
import { heroImage, imageSrc, transitionName } from './image.ts';
import {
	countryHighlights,
	countryName,
	filterEntries,
	gridLabel,
	heroMark,
	highlightStoryHref,
	homeQuery,
	moveStory,
	placeName,
	presentLinks,
	profileStats,
	storyHighlights,
	storyTarget,
} from './sake-view.ts';
import type { SakeEntry } from './types.ts';

const sample: SakeEntry[] = [
	{
		id: 'a',
		name: '獺祭 純米大吟醸',
		country: { japanese: '日本', english: 'Japan' },
		prefecture: '山口県',
		publishedAt: '2024-06-01T00:00:00.000Z',
		link: [{ fieldId: 'link', link: 'https://www.asahishuzo.ne.jp/' }],
	},
	{
		id: 'b',
		name: '作',
		country: { japanese: 'フランス' },
		publishedAt: '2025-06-01T00:00:00.000Z',
		link: [{ link: 'https://example.com/notes/1', title: '蔵元について', note: '資料メモ' }],
	},
	{
		id: 'c',
		name: '赤武',
		country: { japanese: 'イタリア' },
		createdAt: '2026-01-01T00:00:00.000Z',
	},
	{
		id: 'd',
		name: '鳳凰',
		country: { english: 'Spain' },
	},
];

describe('sake view', () => {
	it('counts posts, countries, and Tokyo calendar years', () => {
		assert.deepEqual(profileStats(sample), { posts: 4, countries: 4, years: 3 });
	});

	it('keeps the three most common countries and folds the rest into その他', () => {
		assert.deepEqual(
			countryHighlights(sample).map((item) => item.name),
			['日本', 'フランス', 'イタリア', 'その他'],
		);
		assert.equal(countryHighlights(sample).at(-1)?.initial, 'そ');
	});

	it('filters by country, the other bucket, and query', () => {
		assert.deepEqual(
			filterEntries(sample, { country: '日本' }).map((entry) => entry.id),
			['a'],
		);
		assert.deepEqual(
			filterEntries(sample, { country: 'other' }).map((entry) => entry.id),
			['d'],
		);
		assert.deepEqual(
			filterEntries(sample, { q: '山口' }).map((entry) => entry.id),
			['a'],
		);
	});

	it('labels CMS links from the URL when the entry has no title', () => {
		assert.deepEqual(presentLinks(sample[0]?.link), [
			{ href: 'https://www.asahishuzo.ne.jp/', title: '公式サイト', subtitle: 'asahishuzo.ne.jp' },
		]);
		assert.deepEqual(presentLinks(sample[1]?.link), [
			{ href: 'https://example.com/notes/1', title: '蔵元について', subtitle: '資料メモ' },
		]);
		assert.equal(presentLinks(undefined).length, 0);
	});

	it('reads a place chip without repeating the country', () => {
		assert.equal(placeName(sample[0]!), '山口県');
		assert.equal(placeName(sample[1]!), undefined);
		assert.equal(countryName({ id: 'x', name: 'x', country: 'japan' }), 'その他');
	});

	it('builds home links and placeholder marks', () => {
		assert.equal(homeQuery(), '/');
		assert.equal(homeQuery('list'), '/?view=list');
		assert.equal(highlightStoryHref('日本'), '/highlight/%E6%97%A5%E6%9C%AC/1');
		assert.equal(highlightStoryHref('other', 3), '/highlight/other/3');
		assert.equal(gridLabel('獺祭 純米大吟醸 磨き二割三分'), '獺祭');
		assert.deepEqual(heroMark('獺祭 純米大吟醸'), { primary: '獺', secondary: '祭' });
		assert.equal(transitionName('ab/c d'), 'sake-abcd');
		assert.equal(imageSrc('https://img.example/a.jpg', { w: '100', q: undefined }), 'https://img.example/a.jpg?w=100');
		assert.match(heroImage('https://img.example/a.jpg').src, /w=1400/);
	});

	it('opens the next highlight at the end of a country and skips empty ones', () => {
		const stories = storyHighlights(fixtureEntries());
		assert.deepEqual(
			stories.map((story) => [story.country, story.entries.length]),
			[
				['日本', 6],
				['フランス', 1],
				['イタリア', 1],
				['other', 1],
			],
		);
		const japan = { highlightIndex: 0, slideIndex: 0 };
		assert.equal(storyTarget(stories, japan, 'prev-slide').href, null);
		assert.equal(storyTarget(stories, japan, 'next-slide').href, highlightStoryHref('日本', 2));
		assert.equal(
			storyTarget(stories, { highlightIndex: 0, slideIndex: 5 }, 'next-slide').href,
			highlightStoryHref('フランス', 1),
		);
		assert.equal(storyTarget(stories, { highlightIndex: 1, slideIndex: 0 }, 'prev-slide').href, null);
		assert.equal(
			storyTarget(stories, { highlightIndex: 1, slideIndex: 0 }, 'prev-highlight').href,
			highlightStoryHref('日本', 1),
		);
		assert.equal(storyTarget(stories, { highlightIndex: 3, slideIndex: 0 }, 'next-slide').href, '/');
		assert.equal(storyTarget(stories, { highlightIndex: 3, slideIndex: 0 }, 'next-highlight').href, null);
		assert.deepEqual(moveStory([2, 0, 3], { highlightIndex: 0, slideIndex: 1 }, 'next-slide'), {
			type: 'go',
			highlightIndex: 2,
			slideIndex: 0,
		});
		assert.deepEqual(moveStory([0, 2], { highlightIndex: 1, slideIndex: 0 }, 'prev-highlight'), {
			type: 'stay',
		});
		assert.deepEqual(moveStory([1, 0], { highlightIndex: 0, slideIndex: 0 }, 'next-slide'), {
			type: 'close',
		});
	});

	it('shapes the dev fixture like the profile screen', () => {
		const entries = fixtureEntries();
		assert.deepEqual(profileStats(entries), { posts: 9, countries: 4, years: 3 });
		assert.deepEqual(
			countryHighlights(entries).map((item) => [item.initial, item.name]),
			[
				['日', '日本'],
				['フ', 'フランス'],
				['イ', 'イタリア'],
				['そ', 'その他'],
			],
		);
		assert.equal(placeName(entries[0]!), '山口県');
		assert.equal(presentLinks(entries[0]?.link)[0]?.title, '公式サイト');
		assert.equal(presentLinks(entries[0]?.link)[2]?.subtitle, '自分のメモ');
	});
});
