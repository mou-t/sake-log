import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

export type Properties = PageObjectResponse['properties'][string];
type CommonProperties<T extends PropertiesType> = Pick<Properties, 'id' | 'type'> & { type: T };
type PropertiesType = Properties['type'];
type Property<T extends PropertiesType> = Properties & { type: T };

const isCommonProperties = <T extends PropertiesType>(
	input: unknown,
	propertiesType: T
): input is CommonProperties<T> => {
	return (
		typeof (input as CommonProperties<T>)?.id === 'string' &&
		(input as CommonProperties<T>)?.type === propertiesType
	);
};

export const isFilesProperties = (input: unknown): input is Property<'files'> => {
	return isCommonProperties(input, 'files') && (input as Property<'files'>)?.files !== undefined;
};

export const isCreatedTimeProperties = (input: unknown): input is Property<'created_time'> => {
	return (
		isCommonProperties(input, 'created_time') &&
		(input as Property<'created_time'>)?.created_time !== undefined
	);
};

export const isCheckBoxProperties = (input: unknown): input is Property<'checkbox'> => {
	return (
		isCommonProperties(input, 'checkbox') &&
		typeof (input as Property<'checkbox'>)?.checkbox === 'boolean'
	);
};

export const isSelectProperties = (input: unknown): input is Property<'select'> => {
	return (
		isCommonProperties(input, 'select') &&
		(input as Property<'select'>)?.select !== null &&
		(input as Property<'select'>)?.select !== undefined
	);
};
export const isLastEditedTimeProperties = (
	input: unknown
): input is Property<'last_edited_time'> => {
	return (
		isCommonProperties(input, 'last_edited_time') &&
		(input as Property<'last_edited_time'>)?.last_edited_time !== undefined
	);
};
export const isUrlProperties = (input: unknown): input is Property<'url'> => {
	return isCommonProperties(input, 'url') && typeof (input as Property<'url'>).url === 'string';
};
export const isTitleProperties = (input: unknown): input is Property<'title'> => {
	return isCommonProperties(input, 'title') && Array.isArray((input as Property<'title'>).title);
};
