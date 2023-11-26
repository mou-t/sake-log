<script lang="ts">
	import type { HTMLImgAttributes } from 'svelte/elements';

	export let title: string;
	export let href: string;
	export let imageSrc: string | undefined;
	export let imageProps: Omit<HTMLImgAttributes, 'href' | 'alt'> | undefined = undefined;
	export let viewTransitionName: string | undefined = undefined;
</script>

<div class="card">
	<div class="img-wrapper" style="--view-transition-name: {viewTransitionName}">
		<a {href}>
			<img src={imageSrc} alt={title} {...imageProps} />
		</a>
	</div>
	<p class="card-title">
		<a {href}>{title}</a>
	</p>
</div>

<style>
	.img-wrapper {
		width: 100%;
		aspect-ratio: 3/4;
		overflow: hidden;
	}

	img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		border-radius: 10px;
		transition: all 0.7s;
		view-transition-name: var(--view-transition-name);
	}

	img:hover {
		border-radius: 0px;
		scale: 1.1;
		transition: all 0.5s;
	}

	.card-title {
		margin: var(--size-0) var(--size-1);
	}
</style>
