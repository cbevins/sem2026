<script>
    let {width, height, keyHandler, mouseHandler, content} = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
    onkeydown={keyHandler}
    onkeyup={keyHandler} 
    onclick={mouseHandler}
    ondblclick={mouseHandler}
    onmousemove={mouseHandler}
    onmousedown={mouseHandler}
    onmouseup={mouseHandler}
    onmouseenter={mouseHandler}
    onmouseleave={mouseHandler}
    >
    <!-- tabindex is required for SVG to capture key events -->
    <svg width={width} height={height} tabindex="0">
        {@html content}
    </svg>
</div>
