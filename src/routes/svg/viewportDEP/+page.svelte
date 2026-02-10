<script>
    import {ViewPort, viewportKeyHandler, viewportMouseHandler} from './ViewPort.jsmport { gxmlStr } from '$lib/gxml/gxmlStr.js'
    import ViewportWrapper from './ViewportWrapper.svelte'
    import { onMount } from 'svelte';

    let vp = $state(new ViewPort(400, 400, 1/20, 16000, 24000))
    console.log(vp)
    let m = $state(viewportMouseHandler(vp))
    let k = $state(viewportKeyHandler(vp))
    let keyMessage = $state('Press a key over the SVG image...')
    let mouseMessage = $state('Click on the SVG image...')
    let zoom = $state(4)
    let els = $state(circles(vp))

    // Forwards mouse event handling to viewportHandler()
    // which returns the mouse data object
    // {type:'', dx:0, dy:0, vx:0, vy:0, drag:false}
    function keyHandler(e) {
        k = viewportKeyHandler(vp, e)
        keyMessage = `'${k.type}' at SVG [${k.dx}, ${k.dy}] `
            + `World [${k.vx.toFixed(vp.dec)}, ${k.vy.toFixed(vp.dec)}]`
    }
    function mouseHandler(e) {
        m = viewportMouseHandler(vp, e)
        mouseMessage = `'${m.type}' at SVG [${m.dx}, ${m.dy}] `
            + `World [${m.vx.toFixed(vp.dec)}, ${m.vy.toFixed(vp.dec)}]`
    }

    // Zoom/Pan control handlers
    // Zooms are ft per pixel, scale is pixels per foot
    let zooms = [0.25, 0.5, 1, 2, 4, 8, 16, 32, 64, 128, 528, 1024]
    function zoomin() {
        if (zoom > 0) {
            zoom--
            vp.scale = 1 / zooms[zoom]
            els = circles(vp)
        }
    }
    function zoomout() {
        if (zoom < zooms.length-1) {
            zoom++
            vp.scale = 1 / zooms/zoom
            els = circles(vp)
        }
    }
    function panit(dx, dy) {}

    //---------------------------------------------------------------------
    // SVG content
    //---------------------------------------------------------------------
    function circles(vp) {
        console.log('INSIDE circles()')
        const els = []
        // Start with a green background
        els.push({el: 'rect', x: 0, y: 0, width: vp.device.width, height: vp.device.height,
            fill: 'green'})
        // Create a field of circles with 100-ft diameters
        const space = 100
        const r = vp.dd(space/2 - 5)
        for(let x=vp.left()+space/2; x<=vp.right(); x+=space) {
            for(let y=vp.bottom()+space/2; y<=vp.top(); y+=space) {
                els.push({el: 'circle', cx:vp.dx(x), cy: vp.dy(y),
                    r:r, fill:'red'})
                // els.push(label(x,y))
            }
        }
        // // Mark the center of the world
        // els.push({el: 'circle', cx:this.frameX(this.v.cx),
        //     cy:this.frameY(this.v.cy), r:this.frameD(25), fill:'yellow'})
        return els
    }
    // Text helper
    function label(x, y) {
        return {el: 'text', x: vp.dx(x), y: vp.dy(y), stroke: 'black',
        'font-size': 10,'text-anchor': 'middle', 'font-family': 'sans-serif', 'font-weight': 'light',
        els: [{el: 'inner', content: `${x},${y}`}]}
    }
    els = circles(vp)
</script>

<div class='ml-4 mt-2 text-xl'>SVG Viewport Demo</div>

<div class='ml-4 mt-2 text-normal'>
    Demonstrates use of a ViewPort to display zoomable/pannable content within an SVG.
    ViewPort class defines the SVG size and the underlying world coordinate system and scale.
    ViewportWrapper.svelte embeds the SVG content and adds mouse event detection.
    This example also uses gxmlStr() to programatically generate the SVG content.
    ViewportControls.svelte will be added next.
</div>

<!-- Zoom control ---------------------------------------------------------- -->
<div class='ml-4 mt-4'>{keyMessage}</div>
<div class='ml-4 mt-4'>{mouseMessage}</div>

<!-- Main SVG image -------------------------------------------------------- -->
<div class='ml-4 mt-4'>
    <button class='border px-1 py-1' onclick={zoomin}>Zoom In</button>
    <button class='border px-1 py-1' onclick={zoomout}>Zoom Out</button>
    <div class=''>Zoom level {zoom} is 1 px per {zooms[zoom]} ft.</div>
    <ViewportWrapper width={vp.device.width} height={vp.device.height}
        mouseHandler={mouseHandler} keyHandler={keyHandler}
        content={gxmlStr(els)}/>
</div>
