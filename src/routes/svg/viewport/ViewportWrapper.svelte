<script>
    let {width, height, handler, content} = $props()
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<!-- svelte-ignore a11y_click_events_have_key_events -->
<div onclick={handler}
    ondblclick={handler}
    onmousemove={handler}
    onmousedown={handler}
    onmouseup={handler}
    onmouseenter={handler}
    onmouseleave={handler}>
    <svg width={width} height={height}>
        {@html content}
    </svg>
</div>
