# Post-Installation Setup

## favicon
Specify a custom favicon in the /src/routes/layout.svelte file thusly:
```js
<script>
	import './layout.css';
	import favicon from '$lib/assets/Collin.jpg';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>
{@render children()}
```