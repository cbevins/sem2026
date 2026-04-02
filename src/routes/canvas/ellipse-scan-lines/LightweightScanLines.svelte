<script>
    import { onMount } from 'svelte'
	import { LightweightFireEllipse } from './LightweightFireEllipse.js'
    import { scanEllipse } from '../scanEllipse.js'
    import { setPixel, strokePath } from '../canvasLib.js'

    let {width=512, height=512} = $props()
    let cx = $derived(Math.trunc(width/2))
    let cy = $derived(Math.trunc(height/2))

    let radius = $state(250)
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

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    let actual = $derived(LightweightFireEllipse(headRos, lwr, ignX, ignY, headDeg, minutes, beta))
    // Clone the ellipse scaled with an elapsed time to fill 90% the axis length
    let tscale = $derived(minutes * 0.9 * radius / actual.fDist / 2)
    let ellipse = $derived(LightweightFireEllipse(headRos, lwr, ignX, ignY, headDeg, tscale, beta))
    let hlines = $derived(scanEllipse(ellipse, 1, 'h'))
    
    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })

    function canvasX(easting) { return Math.trunc(easting+0.5) + cx }
    function canvasY(northing) { return cy - Math.trunc(northing+0.5) }

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        if (running) {
			window.cancelAnimationFrame(animId)
        } else {
			animId = window.requestAnimationFrame(draw)
        }
        running = ! running
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        drawScanLines(ctx, hlines)
        // drawScanLines(ctx, vlines)
        drawAxis(ctx)
        if (running) animId = window.requestAnimationFrame(draw)
    }

    function drawAxis(ctx) {
        strokePath(ctx, 'black', [[0,cx,0], [1,cx,height], [0,0,cy], [1,width,cy]])
    }

    function drawBackground(ctx) {
        ctx.fillStyle = 'green'
        ctx.fillRect(0, 0, width, height)
    }

    function drawScanLines(ctx, lines) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        for(let [p1, p2] of lines) {
            const col1 = canvasX(p1.x)
            const row1 = canvasY(p1.y)
            const col2 = canvasX(p2.x)
            const row2 = canvasY(p2.y)
            ctx.moveTo(col1, row1)
            ctx.lineTo(col2, row2)
        }
        ctx.stroke()
    }

    function updateData() {
        bearing = (bearing<355) ? bearing + 5 : 0
    }

</script>
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-5 text-lg'>Lightweight Fire Ellipse Scan Lines</div>
    <div class='text-lg'>Bearing is {bearing}&deg; Cartesian Angle is {headDeg}&deg;</div>
    <div class='text-lg'>Last click at [{offsetX}, {offsetY}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>
