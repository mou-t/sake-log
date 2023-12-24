<script lang="ts">
	import { generateSrc, generateSrcset } from '$lib/utils/microcms-image.js';
	import { MetaTags } from 'svelte-meta-tags';

	export let data;

	$: srcset = generateSrcset(data.image.url, [
		[{ w: '360' }, '720w'],
		[{ w: '720' }, '1440w'],
		[{ w: '1000' }, '2000w']
	]);
</script>

<MetaTags title={data.name} titleTemplate="%s | お酒メモ" />

<article>
	<div style="--view-transition-name: {data.id}; --bg-image: url({data.placeholder})">
		<img src={generateSrc(data.image.url, { w: '1500' })} {srcset} alt={data.name} />
	</div>
	<div>
		<h2>
			{data.name}
		</h2>
		<p>国： {data.country.japanese}</p>
		<div>
			<p>関連リンク</p>
			<ul>
				{#each data.link as link}
					<li><a href={link.link} target="_blank">{link.link}</a></li>
				{/each}
			</ul>
		</div>
	</div>
</article>

<style>
	article {
		display: flex;
		flex-wrap: wrap;
	}

	article > * {
		margin: 0 auto;
		width: var(--size-10);
	}

	img {
		aspect-ratio: 3/4;
		width: 100%;
		view-transition-name: var(--view-transition-name);
		background-image: var(--bg-image);
		background-repeat: no-repeat;
		background-size: cover;
	}
</style>
