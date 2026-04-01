<script>
    import { onMount } from 'svelte'
    import { rindex, strokePath } from '../canvasLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'
    // import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    // import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

    let {width=512, height=512, lwr=2, bearing=0, headRos=100, elapsed=1, ignEast=0, ignNorth=0, degStep=1} = $props()
    // let gen = $derived(new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth))
    // let fe = $state(new FireEllipseMod('fe', 'north').ready())

    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let points = $state([])
    let animId

    // Bind this variable to the canvas element
    let canvasElement, ctx

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
            // console.log('e', easting.toFixed(2), col, 'n', northing.toFixed(2), row)
            const idx = rindex(imageData, col, row)
            imageData.data[idx] = 255  
            imageData.data[idx+1] = 0
            imageData.data[idx+2] = 0
        }
        ctx.putImageData(imageData, 0, 0)
    }
    
    function updateData() {
        bearing = (bearing<355) ? bearing + 5 : 0
        const gen = new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth)
        points = gen.points
    }

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        if (running) {
			window.cancelAnimationFrame(animId)
            running = false
        } else {
			animId = window.requestAnimationFrame(draw)
            running = true
        }
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='text-2xl'>Fire Ellipse Scan Lines</div>
    <div class='text-lg'>Bearing is {bearing}&deg; (last click at [{offsetX}, {offsetY}])</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>