<script>
    import { onMount } from 'svelte'
	import { fireEllipse } from './lightweightFireEllipse.js'
    import { scanEllipse } from './scanEllipseV1.js'
    import { getScanLinesPerimeter, getScanLinesPerimeterRaster } from './getScanLinesPerimeter.js'
    import { drawBackground, drawCentralAxis, drawPerimeterPts, drawScanLines, drawScanLineEndPoints }
        from './canvasDrawing.js'

    let {canvasWidth=512, canvasHeight=512} = $props()

    let headRos= $state(115.31)
    let lwr = $state(3.2)
    let ignX = $state(-140)
    let ignY = $state(-20)
    let bearing = $state(0)
    let duration = $state(1)
    let scanWidth = $state(1)

    let offsetX = $state(0)
    let offsetY = $state(0)

    let running = $state(false)
    let frames = $state(1)
    let prevMsec = $state(0)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    // The 'ellipse' object uses fire behavior parameters and an ignition point
    // to construct a Cartesian ellipse with a center point
    let ellipse = $derived(fireEllipse(headRos, lwr, duration, ignX, ignY, bearing))
    let perimPts = $state([])
    let perimRaster = $state([])

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        // drawScanLines(ctx, hlines, 'red')
        // drawScanLines(ctx, vlines, 'blue')
        // drawScanLineEndPoints(ctx, vlines, 'cyan')  // just segment endpoints
        // drawPerimeterPts(ctx, perimPts, 'cyan')  // all segment endpoints in clockwise order
        drawPerimeterPts(ctx, perimRaster, 'red')   // just raster center points in clockwise order
        drawCentralAxis(ctx)
        // collect timing stats
        const now = new Date()  // performance.now()
        const msec = now - prevMsec
        totalMsec += msec
        meanMsec = (totalMsec / frames).toFixed(2)
        frames++
        prevMsec = now
        if (running) animId = window.requestAnimationFrame(draw)
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        prevMsec = new Date()
        draw()
    })

    function runpause() {
        if (running) window.cancelAnimationFrame(animId)
        else animId = window.requestAnimationFrame(draw)
        running = ! running
    }

    function updateData() {
        bearing = (bearing + 5) % 360
        ellipse = fireEllipse(headRos, lwr, duration, ignX, ignY, bearing)
        const {length, width, headDeg, cX, cY} = ellipse
        const hlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'h')
        const vlines = scanEllipse(length, width, headDeg, ignX, ignY, cX, cY, scanWidth, 'v')
        perimPts = getScanLinesPerimeter(cX, cY, hlines, vlines)
        perimRaster = getScanLinesPerimeterRaster(perimPts, 0, 0, scanWidth)
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Lightweight Fire Ellipse Scan Lines</div>
    <div class='ml-4 text-normal'>Uses lightweight FireEllipse object for scan line generation.</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>{frames} Frames,
            Run Msec {totalMsec}, Avg Frame Msec {meanMsec}
            ({(1000/meanMsec).toFixed(2)} fps)
        </span>
    </div>
    <div class='ml-4 text-lg'>Last click at [{offsetX}, {offsetY}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={canvasWidth} height={canvasHeight}>
    </canvas>
</div>
