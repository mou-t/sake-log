import type {
	PageObjectResponse,
	QueryDatabaseResponse
} from '@notionhq/client/build/src/api-endpoints';
import { notion } from './client';
import {
	isCreatedTimeProperties,
	isFilesProperties,
	isLastEditedTimeProperties,
	isSelectProperties,
	isTitleProperties,
	isUrlProperties,
	type Properties
} from './properties-type';
import { NOTION_GIN_DB_ID } from '$env/static/private';

export const getGinDb = async () => {
	const { results } = await notion.databases.query({
		database_id: NOTION_GIN_DB_ID
	});

	const ginDb = parseResults(results);
	return ginDb;
};

const parseGitDbProperties = (properties: Record<string, Properties>) => {
	const image = properties['image'];
	const createdTime = properties['Created time'];
	const country = properties['country'];
	const lastEditedTime = properties['Last edited time'];
	const link = properties['link'];
	const name = properties['name'];

	if (
		isFilesProperties(image) &&
		isCreatedTimeProperties(createdTime) &&
		isSelectProperties(country) &&
		isLastEditedTimeProperties(lastEditedTime) &&
		isUrlProperties(link) &&
		isTitleProperties(name)
	) {
		return {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-expect-error
			image: image.files?.[0]?.file?.url as string | undefined,
			createdTime: createdTime.created_time,
			country: country.select,
			lastEditedTime: lastEditedTime.last_edited_time,
			link: link.url,
			name: name.title
				.map((textRes) => {
					return textRes.plain_text;
				})
				.join('')
		};
	} else return null;
};

export type GinProperties = NonNullable<ReturnType<typeof parseGitDbProperties>>;
export type GinData = GinProperties & { id: string };

const parseResults = (results: QueryDatabaseResponse['results']): GinData[] => {
	const ginData: GinData[] = [];
	for (const result of results) {
		if (result.object !== 'page') continue;
		const properties = parseGitDbProperties((result as PageObjectResponse)?.properties);
		if (properties === null) throw new Error('parse failed');
		ginData.push({ id: result.id, ...properties });
	}
	return ginData;
};
