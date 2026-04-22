<script>
    import { onMount } from 'svelte'
	import { fireEllipse } from './lightweightFireEllipse.js'
    import { canvasX, canvasY, drawBackground, drawCentralAxis } from '../canvasLib.js'
    import { scanEllipse } from './scanEllipseV1.js'

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
    let hlines = $state([])
    let vlines = $state([])

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        drawScanLines(ctx, hlines, 'red')
        drawScanLines(ctx, vlines, 'blue')
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

    function drawScanLines(ctx, lines, style='red') {
        ctx.strokeStyle = style
        ctx.beginPath()
        for(let [p1, p2] of lines) {
            ctx.moveTo(canvasX(ctx, p1[0]), canvasY(ctx, p1[1]))
            ctx.lineTo(canvasX(ctx, p2[0]), canvasY(ctx, p2[1]))
        }
        ctx.stroke()
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
        hlines = scanEllipse(ellipse.length, ellipse.width, ellipse.headDeg, ignX, ignY,
            ellipse.cX, ellipse.cY, scanWidth, 'h')
        vlines = scanEllipse(ellipse.length, ellipse.width, ellipse.headDeg, ignX, ignY,
            ellipse.cX, ellipse.cY, scanWidth, 'v')
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
