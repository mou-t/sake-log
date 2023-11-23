<script lang="ts">
	import './global.css';
</script>

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
