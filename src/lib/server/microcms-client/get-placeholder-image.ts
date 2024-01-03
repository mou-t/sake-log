import { generateSrc } from '$lib/utils/microcms-image';

export const getPlaceHolderBase64 = async (imageUrl: string) => {
	const buffer = await fetch(generateSrc(imageUrl, { w: '8', fm: 'png' })).then(async (res) =>
		// node依存のコード
		// ビルド時にしか使用しなければ、実行時エラーは発生しない。
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-expect-error
		Buffer.from(await res.arrayBuffer())
	);

	return `data:image/png;base64,${buffer.toString('base64')}`;
};
