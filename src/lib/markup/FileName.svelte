<script>
    let {children} = $props()
</script>

<span class='font-mono px-1 border rounded bg-gray-500 text-white'>
    {@render children?.()}
</span>
