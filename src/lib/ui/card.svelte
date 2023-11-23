<script lang="ts">
	export let title: string;
	export let href: string;
	export let imageSrc: string | undefined;
</script>

<div class="card">
	<div class="img-wrapper">
		<a {href}>
			<img src={imageSrc} alt={title} />
		</a>
	</div>
	<p class="card-title">
		<a {href}>{title}</a>
	</p>
</div>

<style>
	.img-wrapper {
		width: 100%;
		overflow: hidden;
	}

	img {
		border-radius: 10px;
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
