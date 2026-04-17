<script>
    import { onMount } from 'svelte'
    import { strokePath } from '../canvasLib.js'
    import { setPixel } from '../imageDataLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'
    import { createEllipseRaster } from './createEllipseRaster.js'

    let {width=512, height=512} = $props()

    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwr = $state(3.2)
    let headRos = $state(115.31)
    let bearing = $state(0)
    let headDeg = $derived((450-bearing)%360)
    let elapsed = $state(1)
    let degStep = $state(1)

    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let points = $state([])

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    let cx = $derived(Math.trunc(width/2))
    let cy = $derived(Math.trunc(height/2))

    function canvasX(easting) { return Math.trunc(easting+0.5) + cx }
    function canvasY(northing) { return cy - Math.trunc(northing+0.5) }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })

    function draw() {
        updateData()
        drawBackground(ctx)
        blastPerimeter(ctx)
        blastRaster(ctx)
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

    function blastPerimeter(ctx) {
        const imageData = ctx.getImageData(0, 0, width, height)
        for(let [easting, northing /*, bearing*/] of points) {
            const col = canvasX(easting)
            const row = canvasY(northing)
            setPixel(imageData, col, row, 255, 0, 0)
        }
        ctx.putImageData(imageData, 0, 0)
    }

    function blastRaster(ctx) {
        const raster = createEllipseRaster(width, height, 100, 100, 50, 40, 0)
        const imageData = ctx.getImageData(0, 0, width, height)
        for(let row = 0; row<height; row++) {
            for(let col=0; col<width; col++) {
                if (raster[row][col])
                    setPixel(imageData, col, row, 255, 0, 0)
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }
    
    function updateData() {
        bearing = (bearing<355) ? bearing + 5 : 0
        const gen = new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth)
        points = gen.points
    }

    function runpause() {
        if (running) {
			window.cancelAnimationFrame(animId)
        } else {
			animId = window.requestAnimationFrame(draw)
        }
        running = ! running
    }
    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Ellipse Perimeter Animation</div>
    <div class='ml-4 text-normal'>Uses FirePerimeterGenerator (via FireEllipseMod) to generate perimeter points.</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North (Cartesian angle is {headDeg}&deg; above horizon)
    </div>
    <div class='ml-4 text-lg'>Last click at [{offsetX}, {offsetY}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>