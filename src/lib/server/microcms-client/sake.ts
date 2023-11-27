import type { MicroCMSImage, MicroCMSListContent, MicroCMSQueries } from 'microcms-js-sdk';
import { cliet } from './client';

const endpoint = 'sake';

type Sake = {
	name: string;
	image: MicroCMSImage;
	link: { fieldId: 'link'; link: string }[];
	country: { japanese: string; english: string } & MicroCMSListContent;
};

export const getSakeList = async (queries?: MicroCMSQueries) => {
	return cliet.getList<Sake>({ endpoint, queries });
};

export const getSake = async (contentId: string, queries?: MicroCMSQueries) => {
	return cliet.getListDetail<Sake>({ endpoint, contentId, queries });
};
