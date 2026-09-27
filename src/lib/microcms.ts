import { MICROCMS_APIKEY, MICROCMS_DOMAIN } from 'astro:env/server';
import {
	createClient,
	isMicroCMSRequestError,
	type MicroCMSImage,
	type MicroCMSListContent,
} from 'microcms-js-sdk';
import { fixtureById, fixtureEntries } from './fixture';
import type { SakeEntry } from './types';

const ENDPOINT = 'sake';

export class MicrocmsConfigError extends Error {
	constructor() {
		super('MICROCMS_DOMAIN and MICROCMS_APIKEY are required');
		this.name = 'MicrocmsConfigError';
	}
}

export class SakeNotFoundError extends Error {
	constructor() {
		super('Not found');
		this.name = 'SakeNotFoundError';
	}
}

type SakeFields = {
	name?: string;
	image?: MicroCMSImage | null;
	link?: unknown[] | null;
	country?: SakeEntry['country'];
	prefecture?: string;
	region?: string;
	area?: string;
	prefectureName?: string;
	origin?: string;
};

export type Catalog =
	| { ok: true; entries: SakeEntry[] }
	| { ok: false; reason: 'config' | 'unavailable' };

export function microcmsConfigured() {
	return Boolean(MICROCMS_DOMAIN && MICROCMS_APIKEY);
}

export async function loadCatalog(): Promise<Catalog> {
	try {
		return { ok: true, entries: await getAllSake() };
	} catch (error) {
		if (error instanceof MicrocmsConfigError) return { ok: false, reason: 'config' };
		console.error(error);
		return { ok: false, reason: 'unavailable' };
	}
}

export async function getAllSake() {
	if (useFixture()) return fixtureEntries();
	const contents = await client().getAllContents<SakeFields>({
		endpoint: ENDPOINT,
		queries: { depth: 2 },
	});
	return contents.map(toEntry);
}

export async function getSake(id: string) {
	if (useFixture()) {
		const entry = fixtureById(id);
		if (!entry) throw new SakeNotFoundError();
		return entry;
	}
	try {
		const content = await client().getListDetail<SakeFields>({
			endpoint: ENDPOINT,
			contentId: id,
			queries: { depth: 2 },
		});
		return toEntry(content);
	} catch (error) {
		if (isMicroCMSRequestError(error) && error.status === 404) throw new SakeNotFoundError();
		throw error;
	}
}

export function classifySakeError(error: unknown): 'config' | 'missing' | 'unavailable' {
	if (error instanceof MicrocmsConfigError) return 'config';
	if (error instanceof SakeNotFoundError) return 'missing';
	return 'unavailable';
}

function useFixture() {
	return import.meta.env.DEV && !microcmsConfigured();
}

function client() {
	if (!MICROCMS_DOMAIN || !MICROCMS_APIKEY) throw new MicrocmsConfigError();
	return createClient({
		serviceDomain: MICROCMS_DOMAIN,
		apiKey: MICROCMS_APIKEY,
	});
}

function toEntry(content: SakeFields & MicroCMSListContent): SakeEntry {
	return {
		id: content.id,
		name: content.name?.trim() || '無題',
		image: content.image?.url ? { url: content.image.url } : null,
		link: content.link ?? [],
		country: content.country ?? null,
		prefecture: content.prefecture,
		region: content.region,
		area: content.area,
		prefectureName: content.prefectureName,
		origin: content.origin,
		createdAt: content.createdAt,
		publishedAt: content.publishedAt,
	};
}
