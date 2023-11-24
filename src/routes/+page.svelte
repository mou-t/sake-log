<script lang="ts">
	import Card from '$lib/ui/card.svelte';
	import { generateSrc, generateSrcset } from '$lib/utils/microcms-image.js';

	export let data;
</script>

<main>
	<div class="cards-container">
		{#each data['sakeList']['contents'] as { id, image, name }}
			<Card
				title={name}
				href={`/sake/${id}`}
				imageSrc={generateSrc(image.url, { w: '300' })}
				imageProps={{ srcset: generateSrcset(image.url) }}
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
