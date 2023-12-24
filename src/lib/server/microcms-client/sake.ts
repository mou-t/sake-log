import type { MicroCMSImage, MicroCMSListContent, MicroCMSQueries } from 'microcms-js-sdk';
import { client } from './client';

const endpoint = 'sake';

type Sake = {
	name: string;
	image: MicroCMSImage;
	link: { fieldId: 'link'; link: string }[];
	country: { japanese: string; english: string } & MicroCMSListContent;
};

export const getSakeList = async (queries?: MicroCMSQueries) => {
	return client.getList<Sake>({ endpoint, queries });
};

export const getSake = async (contentId: string, queries?: MicroCMSQueries) => {
	return client.getListDetail<Sake>({ endpoint, contentId, queries });
};
