<script>
    import { onMount } from "svelte"
    import { FireEllipseScanLines } from '../FireEllipseScanLines.js'
    import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    import { canvasX, canvasY, xmid, ymid,
        drawBackground, drawCentralAxis, drawFireEllipseScanLines } from '../canvasLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'
    import { bresenhamWalk } from "../bresenhamSuperCover.js"

    let {width=512, height=512} = $props()

    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let points = $state([])
    let fireEllipseScanLines = $state(null)

    // Bind this variable to the canvas element
    let canvasElement, ctx //, animId

    //-----------------------------------------------------------------------------------------
    // Fire Ellipse
    //-----------------------------------------------------------------------------------------
    
    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwr = $state(2)
    let headRos = $state(250)
    let bearing = $state(45)
    let elapsed = $state(1)
    let degStep = $state(0.1)

    const ellipse = new FireEllipseMod('ellipse', 'north').ready()
    const {back, center, eccent, head, ignition} = ellipse
    ellipse.length.dist.select()
    ellipse.width.dist.select()
    back.dist.select()
    head.angle.select()
    head.bearing.select()
    center.east.select()
    center.north.select()
    ignition.east.select()
    ignition.north.select()
    eccent.select()

    //-----------------------------------------------------------------------------------------

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        // draw(ctx)
    }
    
    function draw(ctx) {
        updateData()
        drawBackground(ctx)
        // drawFireEllipseScanLines(ctx, fireEllipseScanLines, 'red')
        drawPerimeterRays(ctx, points, 'white')
        // drawScanLineRays(ctx, fireEllipseScanLines, 'white')
        drawCentralAxis(ctx)
        fillCell(xmid, ymid, "yellow")
        // if (running) animId = window.requestAnimationFrame(draw)
    }

    function testMethod(col, row) { return true }

    function drawPerimeterRays(ctx, points, style) {
        const [x1,y1] = points[0]
        const [x2,y2] = points[1]
        const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
        console.log(`Head point gap for ${degStep} degrees is ${dist}.`)
        const t0 = new Date()
        ctx.strokeStyle = style
        ctx.beginPath()
        const ignCol = canvasX(ctx, ignEast)
        const ignRow = canvasY(ctx, ignNorth)
        for(let [easting, northing /*, bearing*/] of points) {
            const col = canvasX(ctx, easting)
            const row = canvasY(ctx, northing)
            const [lastCol1, lastRow1] = bresenhamWalk(ignCol, ignRow, col, row, testMethod)
            ctx.moveTo(ignCol, ignRow)
            ctx.lineTo(lastCol1, lastRow1)
        }
        ctx.stroke()
        console.log('Processed', points.length, 'rays in', new Date()-t0, 'msec')
    }

    function drawScanLineRays(ctx, fesl, style='white') {
        const t0 = new Date()
        ctx.strokeStyle = style
        ctx.beginPath()
        let nrows = 0
        const ignCol = canvasX(ctx, fesl.ignEast)
        const ignRow = canvasY(ctx, fesl.ignNorth)
        console.log('ignition at', ignCol, ignRow)
        for(let [y, x1, x2] of fesl.lines) {
            const row = canvasY(ctx, y)
            const col1 = canvasX(ctx, x1) // convert from floating pt to raster
            const col2 = canvasX(ctx, x2)
            nrows++
            const [lastCol1, lastRow1] = bresenhamWalk(ignCol, ignRow, col1, row, testMethod)
            ctx.moveTo(ignCol, ignRow)
            ctx.lineTo(lastCol1, lastRow1)
            const [lastCol2, lastRow2] = bresenhamWalk(ignCol, ignRow, col2, row, testMethod)
            ctx.moveTo(ignCol, ignRow)
            ctx.lineTo(lastCol2, lastRow2)
        }
        ctx.stroke()
        console.log('Processed', nrows, 'rows in', new Date()-t0, 'msec')
        ctx.fillStyle = 'blue'
        ctx.fillRect(ignCol-5, ignRow-5, 10, 10)
    }

    function fillCell(col, row, color="rgba(255, 255, 255, 0.5)") {
        ctx.fillStyle = color
        ctx.fillRect(col-1, row-1, 3, 3)
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw(ctx)
    })

    function runpause() {
        // if (running) window.cancelAnimationFrame(animId)
        // else animId = window.requestAnimationFrame(draw)
        running = ! running
    }

    function updateData() {
        bearing = (bearing + 5)%360
        ellipse.head.bearing.set(bearing)
        ignition.east.set(ignEast)
        ignition.north.set(ignNorth)
        head.bearing.set(bearing)
        head.ros.set(headRos)
        ellipse.lwr.set(lwr)
        ellipse.time.set(elapsed)
        ellipse.updateAll()
        fireEllipseScanLines = new FireEllipseScanLines(ignEast, ignNorth,
            ellipse.length.dist.get(), ellipse.width.dist.get(), bearing,
            ellipse.center.east.get(), ellipse.center.north.get(), 1, 'ft')
        const gen = new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth)
        points = gen.points
        // console.log('Points', gen.points)
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Ellipse Collision Detection via Ray Cast</div>
    <div class='ml-4 text-lg'>Click at [{offsetX}, {offsetY}]</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North
    </div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>