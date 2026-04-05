<script>
    import { onMount } from 'svelte'
    import { FireEllipseScanLines } from '../FireEllipseScanLines.js'
	import { LightweightFireEllipse } from './LightweightFireEllipse.js'
    import { drawBackground, drawCentralAxis, drawFireEllipseScanLines } from '../canvasLib.js'

    let {width=512, height=512} = $props()

    let headRos= $state(115.31)
    let lwr = $state(3.2)
    let ignX = $state(0)
    let ignY = $state(0)
    let bearing = $state(0)
    let headDeg = $derived((450-bearing)%360)
    let minutes = $state(1)
	let beta = $state(0)
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)

    let ellipse = $derived(LightweightFireEllipse(headRos, lwr, ignX, ignY, headDeg, minutes, beta))
    let fireEllipseScanLines = $state(null)

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        drawFireEllipseScanLines(ctx, fireEllipseScanLines, 'red')
        // drawScanLines(ctx, hlines)
        // drawScanLines(ctx, vlines)
        drawCentralAxis(ctx)
        if (running) animId = window.requestAnimationFrame(draw)
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })

    function runpause() {
        if (running) window.cancelAnimationFrame(animId)
        else animId = window.requestAnimationFrame(draw)
        running = ! running
    }

    function updateData() {
        bearing = (bearing<355) ? bearing + 5 : 0
        fireEllipseScanLines = new FireEllipseScanLines(ignX, ignY,
            ellipse.length, ellipse.width, bearing,
            ellipse.cX, ellipse.cY, 1, 'ft')
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Lightweight Fire Ellipse Scan Lines</div>
    <div class='ml-4 text-normal'>Uses lightweight FireEllipse object for scan line generation.</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North (Cartesian angle is {headDeg}&deg; above horizon)
    </div>
    <div class='ml-4 text-lg'>Last click at [{offsetX}, {offsetY}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>
