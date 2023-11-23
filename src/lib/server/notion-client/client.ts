import { NOTION_TOKEN } from '$env/static/private';
import { Client } from '@notionhq/client';

export const notion = new Client({
	auth: NOTION_TOKEN
});
