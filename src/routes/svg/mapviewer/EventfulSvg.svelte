<script>
    let {width, height, content, handler} = $props()
    let svgRef = null  // reference to the SVG to programatically control focus
    function localHandler(e) {
        if (svgRef && (e.type==='mouseenter' || e.type==='mouseover')) svgRef.focus()
        if (svgRef && (e.type==='mouseleave' || e.type==='mouseout')) svgRef.blur()
        handler(e)
    }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<svg width={width} height={height} tabindex="-1" bind:this={svgRef}
    onkeydowncapture={localHandler}
    onkeyupcapture={localHandler} 
    onclick={localHandler}
    onmousedown={localHandler}
    onmouseup={localHandler}
    onmousemove={localHandler}
    onmouseenter={localHandler}
    onmouseleave={localHandler}
    onmouseover={localHandler}
    onmouseout={localHandler}
    onfocus={localHandler}
    onblur={localHandler}
>
    {@html content}
</svg>
