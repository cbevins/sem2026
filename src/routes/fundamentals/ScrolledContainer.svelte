<script>
    // Component props
    let { height = '150px', children } = $props();
</script>

<div class="scroll-container" style="height: {height};">
    {@render children()}
</div>

<style>
    .scroll-container {
        overflow-y: auto;       /* Enables vertical scrolling */
        border: 1px solid #ccc;
        padding: 1rem;
        border-radius: 4px;
        box-sizing: border-box;
    }
</style>
