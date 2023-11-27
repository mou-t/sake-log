<script lang="ts">
	import Card from '$lib/ui/card.svelte';
	import { MetaTags } from 'svelte-meta-tags';

	import { generateSrc, generateSrcset } from '$lib/utils/microcms-image.js';

	export let data;
</script>

<MetaTags title="お酒メモ" />

<main>
	<div class="cards-container">
		{#each data['sakeList']['contents'] as { id, image, name }}
			<Card
				title={name}
				href={`/sake/${id}`}
				imageSrc={generateSrc(image.url, { w: '300' })}
				imageSrcset={generateSrcset(image.url, [
					[{ dpr: '1', w: '300' }, '1x'],
					[{ dpr: '2', w: '300' }, '2x'],
					[{ dpr: '3', w: '300' }, '3x'],
					[{ dpr: '4', w: '300' }, '4x']
				])}
				viewTransitionName={id}
			/>
		{/each}
	</div>
</main>

<style>
	.cards-container {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(var(--size-8), 1fr));
		gap: var(--size-1);
	}
</style>
