<script>
    import { slide } from "svelte/transition"

    let {children, title='Please Add a Title' } = $props()
    let isOpen = $state(false)
    const toggle = () => (isOpen = !isOpen)
</script>

<div class='border rounded-4xl mb-2 bg-gray-300'>
  <button class="flex" onclick={toggle} aria-expanded={isOpen}>
    <svg class="" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke-linecap="round" stroke-linejoin="round" stroke-width="2" stroke="black">
      <path d="M9 5l7 7-7 7" />
    </svg>
    {title}
  </button>
</div>

<div class="ml-2">
  {#if isOpen}
    <div class:hidden={!isOpen} transition:slide={{ duration: 300 }}>
      {@render children?.()}
    </div>
  {/if}
</div>

<style>
  button {
    border: none;
    background: none;
    color: inherit;
    cursor: pointer;
    margin: 0;
    padding-bottom: 0.5rem;
    padding-top: 0.5rem;
  }

  svg {
		flex-shrink: 0;
    transition: transform 0.2s ease-in;
  }

  [aria-expanded="true"] svg {
    transform: rotate(0.25turn);
  }
	
	.flex {
		display: flex;
	}
		.hidden {
		display: none;
	}
</style>
