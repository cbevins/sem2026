<script>
    import { onMount } from "svelte"
    import { BurnMap } from "../BurnMap.js"
    import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    import { canvasX, canvasY, xmid, ymid, drawCentralAxis } from '../canvasLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'

    let {width=512, height=512} = $props()
    let burnMap = $derived(new BurnMap(width, height))
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let points = $state([])
    let msec = $state(0)

    // Bind this variable to the canvas element
    let canvasElement, ctx, animId

    //-----------------------------------------------------------------------------------------
    // Fire Ellipse
    //-----------------------------------------------------------------------------------------
    
    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwr     = $state(2)
    let headRos = $state(250)
    let bearing = $state(-5)
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
        // draw()
    }

    function draw() {
        const t0 = new Date()
        updateData()
        drawBurnMap(ctx, burnMap)
        drawCentralAxis(ctx)
        fillCell(xmid(ctx), ymid(ctx), "yellow")
        msec = new Date() - t0
        if (running) animId = window.requestAnimationFrame(draw)
    }

    function overlayEllipse(burnMap, points) {
        // const [x1,y1] = points[0]
        // const [x2,y2] = points[1]
        // const dist = Math.sqrt((x2-x1)**2 + (y2-y1)**2)
        // console.log(`Head point gap for ${degStep} degrees is ${dist}.`)
        // const t0 = new Date()
        const ignCol = canvasX(ctx, ignEast)
        const ignRow = canvasY(ctx, ignNorth)
        for(let [easting, northing /*, bearing*/] of points) {
            const col = canvasX(ctx, easting)
            const row = canvasY(ctx, northing)
            burnMap.raycast(ignCol, ignRow, col, row)
        }
    }

    function drawBurnMap(ctx, burnMap) {
        const imageData = ctx.getImageData(0, 0, width, height)
        const d = imageData.data
        for(let j=0; j<burnMap.data.length; j++) {
            const burnCode = burnMap.data[j]
            const i = 4*j
            d[i] = 0
            d[i+1] = 0
            d[i+2] = 0
            d[i+3] = 255
            if (burnCode === BurnMap.burning) d[i] = 255   // red
            else if (burnCode === BurnMap.unburned) d[i+1] = 255 // green
            else if (burnCode === BurnMap.unburnable) d[i+2] = 255   // blue
            else if (burnCode === BurnMap.burned) { // brown
                d[i] = 150
                d[i+1] = 75
            }
        }
        ctx.putImageData(imageData, 0, 0)
    }

    function fillCell(col, row, color="rgba(255, 255, 255, 255)") {
        ctx.fillStyle = color
        ctx.fillRect(col-2, row-2, 5, 5)
    }

    function initializeBurnMap(burnMap) {
        // Unburnable blocks
        burnMap.setRect(280, 220, 10, 10, BurnMap.unburnable)
    }

    onMount(() => {
        initializeBurnMap(burnMap)
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })
    
    function maxGap(points) {
        let maxdsq = 0
        let maxid = 0
        let prev = points[0]
        for(let i=1; i<points.length; i++) {
            const dx = points[i][0] - prev[0]
            const dy = points[i][1] - prev[1]
            const dsq = dx*dx+dy*dy
            if (dsq > maxdsq) {
                maxdsq = dsq
                maxid = i
            }
            prev = points[i]
        }
        const maxd = Math.sqrt(maxdsq)
        const maxAngle = 360 * (maxid / (points.length-1)) - 1
        console.log(`Max perimeter point gap at ${degStep} degree increments `
            + `is ${maxd.toFixed(2)} at angle ${maxAngle.toFixed(2)} (index ${maxid}).`)
    }

    function runpause() {
        if (running) window.cancelAnimationFrame(animId)
        else animId = window.requestAnimationFrame(draw)
        running = ! running
    }

    function updateData() {
        // Set FireEllipseMod inputs
        bearing = (bearing + 5)%360
        ellipse.head.bearing.set(bearing)
        ignition.east.set(ignEast)
        ignition.north.set(ignNorth)
        head.bearing.set(bearing)
        head.ros.set(headRos)
        ellipse.lwr.set(lwr)
        ellipse.time.set(elapsed)
        ellipse.updateAll()
        // Generate perimeter points for the ellipse
        const gen = new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth)
        maxGap(gen.points)
        points = gen.points
        overlayEllipse(burnMap, points)
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Ellipse Collision Detection via Ray Cast</div>
    <div class='ml-4 text-lg'>Elapsed time {msec} milliseconds</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North
    </div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>