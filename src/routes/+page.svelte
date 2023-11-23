<script lang="ts">
	import Card from '$lib/ui/card.svelte';

	export let data;
</script>

<main>
	<div class="cards-container">
		{#each data['ginDb'] as { image, name, id }}
			<Card title={name} href={`/sake/${id}`} imageSrc={image} />
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
