<script>
    let {label, handler, glow=false, shadow=false} = $props()
</script>

<button class="px-1 py-1 relative rounded group font-medium text-white inline-block"
    onclick={handler}>
    <!-- Non-hover glow effect -->
    {#if glow}
    <span class="absolute top-0 left-0 w-full h-full rounded opacity-50 filter blur-sm bg-linear-to-br from-purple-600 to-blue-500"></span>
    {/if}
    <!-- drop shadow -->
    {#if shadow}
    <span class="h-full w-full inset-0 absolute mt-0.5 ml-0.5 bg-linear-to-br filter group-active:opacity-0 rounded opacity-50 from-purple-600 to-blue-500"></span>
    {/if}
    <span class="absolute inset-0 w-full h-full transition-all duration-200 ease-out rounded shadow-xl bg-linear-to-br filter group-active:opacity-0 group-hover:blur-sm from-purple-600 to-blue-500"></span>
    <span class="absolute inset-0 w-full h-full transition duration-200 ease-out rounded bg-linear-to-br to-purple-600 from-blue-500"></span>
    <span class="relative">{label}</span>
</button>