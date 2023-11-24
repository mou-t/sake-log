<script lang="ts">
	import { generateSrc, generateSrcset } from '$lib/utils/microcms-image.js';

	export let data;
</script>

<article>
	<div class="img-wrapper">
		<img src={generateSrc(data.image.url, { w: '2000' })} alt={data.name} />
	</div>
	<div class="info">
		<h2>
			{data.name}
		</h2>
		<p>国： {data.country.japanese}</p>
	</div>
</article>

<style>
	article {
		display: flex;
		flex-wrap: wrap;
	}

	.img-wrapper,
	.info {
		margin: 0 auto;
		width: var(--size-10);
	}

	img {
		aspect-ratio: 3/4;
		width: 100%;
	}
</style>
