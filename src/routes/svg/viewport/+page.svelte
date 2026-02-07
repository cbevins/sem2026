<script>
    import {ViewPort, viewportHandler} from './ViewPort.js'
    import { gxmlStr } from '$lib/gxml/gxmlStr.js'
    import ViewportWrapper from './ViewportWrapper.svelte'

    let vp = $state(new ViewPort(400, 400, 1/20, 16000, 24000))
    let m = $state(viewportHandler(vp))
    let eventMessage = $state('Click on the SVG image...')

    // Forwards mouse event handling to viewportHandler()
    // which returns the mouse data object
    // {type:'', dx:0, dy:0, vx:0, vy:0, drag:false}
    function handler(e) {
        m = viewportHandler(vp, e)
        eventMessage = `'${m.type}' at SVG [${m.dx}, ${m.dy}] `
            + `World [${m.vx.toFixed(vp.dec)}, ${m.vy.toFixed(vp.dec)}]`
    }

    //---------------------------------------------------------------------
    
    let pts = [
        [16000,22000], [14000, 22000], [18000, 22000],
        [16000,24000], [14000, 24000], [18000, 24000],
        [16000,26000], [14000, 26000], [18000, 26000],
    ]
    const els = []
    els.push({el: 'rect', width: vp.device.width, height: vp.device.height, fill: 'magenta'})
    for(let [vx, vy] of pts) {
        els.push({el: 'circle', cx: vp.dx(vx), cy: vp.dy(vy), r:10, fill: 'yellow'})
    }
</script>

<div class='ml-4 mt-2 text-xl'>SVG Viewport Demo</div>

<div class='ml-4 mt-2 text-normal'>
    Demonstrates use of a ViewPort to display zoomable/pannable content within an SVG.
    ViewPort class defines the SVG size and the underlying world coordinate system and scale.
    ViewportWrapper.svelte embeds the SVG content and adds mouse event detection.
    This example also uses gxmlStr() to programatically generate the SVG content.
    ViewportControls.svelte will be added next.
</div>

<div class='ml-4 mt-4'>{eventMessage}</div>

<div class='ml-4 mt-4'>
    <ViewportWrapper width={vp.device.width} height={vp.device.height}
        handler={handler} content={gxmlStr(els)}/>
</div>