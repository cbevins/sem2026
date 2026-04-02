<script>
    import { onMount } from 'svelte'
    import { setPixel, strokePath } from '../canvasLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'
    // import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    // import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

    let {width=512, height=512, lwr=2, bearing=0, headRos=100, elapsed=1, ignEast=0, ignNorth=0, degStep=1} = $props()
    // let fe = $state(new FireEllipseMod('fe', 'north').ready())

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
        } else {
			animId = window.requestAnimationFrame(draw)
        }
        running = ! running
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='text-2xl'>Fire Ellipse Perimeter Animation</div>
    <div class='text-normal'>Click the green field to start and stop the animation:</div>
    <div class='text-lg'>Bearing is {bearing}&deg; (last click at [{offsetX}, {offsetY}])</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>