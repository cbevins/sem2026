<script>
    let svgRef  // reference to the SVG to programatically control focus

    // 'creator' is a class or object with svg 'width' and 'height' props and
    // a 'create' function that takes an event reference and returns SVG content
    // See Viewport for a working example
    let {creator, mousable=true, keyable=true} = $props()
    // svelte-ignore state_referenced_locally
    let content = $state(creator.create())
    // svelte-ignore state_referenced_locally
    const {width, height, create} = creator
    
    function focusAction(node) { node.focus() }

    // Handle mouseenter/mouseleave separately so svg element focus can be set
    function focusHandler(e) {
        if (e.type === 'mouseenter') svgRef.focus()
        mouseHandler(e)
    }
    function keyHandler(e) { if (keyable) content = creator.create(e) }
    function mouseHandler(e) {if (mousable) content = creator.create(e) }
</script>

<!-- 
    mousedown/mouseup interfers with click and dblclick
    The following events are not tracked:
        onmouseover={mouseHandler}
        onmouseout={mouseHandler}
        ondblclick={mouseHandler}
-->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- Could add onmousedown/onmouseup, but they interfer with click -->
<svg width={width} height={height} tabindex="-1" bind:this={svgRef}
    use:focusAction
    onkeydown={keyHandler}
    onkeyup={keyHandler} 
    onclick={mouseHandler}
    onmousedown={mouseHandler}
    onmouseup={mouseHandler}
    onmousemove={mouseHandler}
    onmouseenter={focusHandler}
    onmouseleave={focusHandler}
>
    {@html content}
</svg>
