<script>
    import { onMount } from 'svelte'
    import { FireEllipse } from './FireEllipse.js'
    import { getEllipseRasterPerimeterOffsets } from './getEllipseRasterPerimeterOffsets.js'
    import { drawBackground, drawCentralAxis, drawPerimeterCells } from './canvasDrawing.js'

    let {canvasWidth=512, canvasHeight=512} = $props()

    let headRos= $state(100)
    let lwr = $state(2)
    let ignX = $state(50)
    let ignY = $state(50)
    let bearing = $state(-5)
    let duration = $state(1)
    let spacing = $state(1)

    let offsetX = $state(0)
    let offsetY = $state(0)

    let running = $state(false)
    let frames = $state(1)
    let prevMsec = $state(0)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    let ellipse = $derived(new FireEllipse(headRos, lwr, duration, ignX, ignY, bearing))
    let perimOffsets = $state([])

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        drawPerimeterCells(ctx, perimOffsets, 'red')   // just raster center points in clockwise order
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
        ellipse =  ellipse.setLocation(ignX, ignY, bearing)
        const {majorDist: rx, minorDist: ry, degRot, centerEast: cx, centerNorth: cy} = ellipse
        perimOffsets = getEllipseRasterPerimeterOffsets(cx, cy, rx, ry, degRot, spacing)
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>FireEllipse Perimeter Bearing Rotation Example</div>
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
