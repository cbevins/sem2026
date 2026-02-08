<script>
    import { gxmlStr } from '$lib/gxml/gxmlStr'
    import SvgMapTable from './SvgMapTable.svelte'

    // Props and responsive state
    let {scope, table} = $props()
    let zoom = $state(1)
    let els = $state(scope.view(zoom, scope.v.cx, scope.v.cy))

     // Zoom/Pan control handlers
    function zoomit(n) {
        if ((n>0 && zoom < 20) || (n<0 && zoom>n+2)) zoom = zoom + n
        els = scope.view(zoom)
    }
    function panit(dx, dy) {
        let x = scope.v.cx + dx * scope.v.pan.xstep
        let y = scope.v.cy + dy * scope.v.pan.ystep
        if (dx===0 && dy===0) {
            x = scope.w.cx
            y = scope.w.cy
        }
        els = scope.view(zoom, x, y)
    }

    // Zoom/Pan control icons
    const prefix = '<svg viewBox="0 0 12 12"> <path d="'
    const suffix = '" stroke="green" stroke-width="2" fill="none" stroke-linejoin="round"/></svg>'
    const ArrowN = prefix + "M6,10 L6,2 L1,6 L6,2 L11,6" + suffix
    const ArrowS = prefix + "M6,2 L6,10 L1,6 L6,10 L11,6" + suffix
    const ArrowW = prefix + "M10,6 L2,6 L6,1 L2,6 L6,11" + suffix
    const ArrowE = prefix + "M2,6 L10,6 L6,1 L10,6 L6,11" + suffix
    const ArrowNW = prefix + "M10,10 L2,2 L9,2 L2,2 L2,9" + suffix
    const ArrowNE = prefix + "M2,10 L10,2 L2,2 L10,2 L10,10" + suffix
    const ArrowSE = prefix + "M2,2 L10,10 L3,10 L10,10 L10,3" + suffix
    const ArrowSW = prefix + "M10,2 L2,10 L2,3 L2,10 L10,10" + suffix
    const Target = '<svg viewBox="0 0 12 12">'
        + '<circle cx="6" cy="6" r="5", stroke="green" fill="none"/> '
        + '<circle cx="6" cy="6" r="2", stroke="green" fill="green"/></svg>'

    // Experimental
    let message = $state('Select a box')
    let m = $state({x:0, y:0})
    // mouse events in Svelete SVG in format on<type> are:
    // click, dblclick, mousemove
    // mousedown/mouseup when mouse button is pressed/released
    // mouseover/mouseout when pointer enters/leaves the element
    // mouseenter/mouseleave similar to above fires when the pointer
    //  enters/leaves the bound element itself, but NOT its descendants
    //  so use this to reduce bubbling
    function handler(e) {
        m = {x:e.offsetX, y:e.offsetY}
        console.log(event)
        message = `button ${e.button} ${e.type} at [${m.x}, ${m.y}]`
    }
</script>

<!-- Zoom control ---------------------------------------------------------- -->
<div class='ml-5 mt-5 mb-5 border'>
    Message: {message}
    {@render panner()}
</div>

<!-- Main SVG image -------------------------------------------------------- -->
<div class='ml-4' onmousedown={handler}>
    <svg width={scope.f.width} height={scope.f.height}>
        {@html gxmlStr(els)}
    </svg>
</div>

{#if table}
<SvgMapTable d={scope}/>
{/if}

<!-- Pan buttons in a small 3x3 table -------------------------------------- -->
{#snippet panButton(content, dx, dy)}
    <td><button class='w-6 h-6 border rounded border-green-500'
        onclick={() => panit(dx,dy)}>{@html content}</button></td>
{/snippet}

{#snippet zoomButton(content, n)}
    <td><button class='align-middle w-12 h-8 font-medium text-2xl text-white bg-green-500 border rounded bg-green-500 border-black'
        onclick={() => zoomit(n)}>{@html content}</button></td>
{/snippet}

{#snippet coord(x,y)}
    <td colspan='2' align='center' class="align-middle h-6 border rounded border-green-500">
    [{x}, {y}]</td>
{/snippet}

{#snippet gap()} <td class="w-4 h-6"></td> {/snippet}
{#snippet label(str)}
    <td align='center' class='font-medium text-white bg-green-500 border-black ml-4 w-24 h-6 border rounded'>
    {@html str}</td>
{/snippet}

{#snippet panner()}
<div>
    <table class='border-separate'>
        <tbody>
            <tr>
                {@render panButton(ArrowNW,-1,1)}{@render panButton(ArrowN,0,1)}{@render panButton(ArrowNE,1,1)}
                {@render gap()} {@render label('Zoom x'+zoom)} {@render zoomButton('+',1)} {@render zoomButton('-',-1)}
            </tr>
            <tr>
                {@render panButton(ArrowW,-1,0)}{@render panButton(Target,0,0)}{@render panButton(ArrowE,1,0)}
                {@render gap()} {@render label('View Center')} {@render coord(scope.v.cx, scope.v.cy)}
            </tr>
            <tr>
                {@render panButton(ArrowSW,-1,-1)}{@render panButton(ArrowS,0,-1)}{@render panButton(ArrowSE,1,-1)}
                {@render gap()} {@render label('View Cursor')} {@render gap()} {@render gap()} 
            </tr>
        </tbody>
    </table>
</div>
{/snippet}
