<script lang="ts">
	import './global.css';
</script>

<svelte:head>
	<link
		href="https://genjyuugothic-subsets.mou-t.dev/GenJyuuGothicL-Normal/GenJyuuGothicL-Normal.css"
		type="text/css"
		rel="stylesheet"
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="" />
	<link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
</svelte:head>

<header>
	<a href="/">お酒メモ</a>
	<nav>
		<!--<a href="/country">国別</a>-->
	</nav>
</header>

<slot />

<style>
	header {
		display: flex;
		justify-content: space-between;
		font-size: var(--font-size-2);
	}

	nav {
		font-size: var(--font-size-1);
	}
</style>
