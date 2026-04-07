<script>
    import { onMount } from "svelte"
    import { DataSource } from "../DataSource.js"
    import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    import { canvasX, canvasY, xmid, ymid, drawCentralAxis } from '../canvasLib.js'
    import { FirePerimeterGenerator } from '$lib/fire/ellipse/FirePerimeterGenerator.js'
    import { FireEllipseScanLines } from '../FireEllipseScanLines.js'

    let {width=512, height=512} = $props()
    // let burnMap = $derived(new BurnMap(width, height))
    let dataSource = $derived(new DataSource(width, height))
    let burnGaps = $derived(dataSource.burnMap.getGaps())
    let counts = $derived([0,0,0,0])
    let gap = $state({distance: 0, angle: 0, index: 0})
    let msec = $state(0)
    let offsetX = $state(0)
    let offsetY = $state(0)
    let perimeterMod = $state(0)
    let perimeterScan = $state(0)
    let points = $state([])
    let running = $state(false)
    let sizeMod = $state(0)
    let sizeScan = $state(0)
    let rasterScan = $state(0)

    let showBurnCounts = $state(true)
    let showBurnGaps = $state(false)
    let showScanLineStats = $state(false)

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
    let degStep = $state(0.5)

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
    ellipse.size.select()
    ellipse.perimeter.select()

    //-----------------------------------------------------------------------------------------

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        draw()
    }

    function draw() {
        const t0 = new Date()
        updateData()
        dataSource.drawImageData(ctx)
        drawCentralAxis(ctx)
        fillCell(xmid(ctx), ymid(ctx), "yellow")
        msec = new Date() - t0
        if (running) animId = window.requestAnimationFrame(draw)
    }

    function castBurnLines(dataSource, points) {
        const ignCol = canvasX(ctx, ignEast)
        const ignRow = canvasY(ctx, ignNorth)
        for(let [easting, northing /*, bearing*/] of points) {
            const lastCol = canvasX(ctx, easting)
            const lastRow = canvasY(ctx, northing)
            dataSource.burnMap.castBurnLine(ignCol, ignRow, lastCol, lastRow)
        }
    }

    function fillCell(col, row, color="rgba(255, 255, 255, 255)") {
        ctx.fillStyle = color
        ctx.fillRect(col-2, row-2, 5, 5)
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
        // Update the FireEllipseMod inputs for this location and time
        bearing = (bearing + 5)%360
        ellipse.head.bearing.set(bearing)
        ignition.east.set(ignEast)
        ignition.north.set(ignNorth)
        head.bearing.set(bearing)
        head.ros.set(headRos)
        ellipse.lwr.set(lwr)
        ellipse.time.set(elapsed)
        ellipse.updateAll()
        sizeMod = ellipse.size.get()
        perimeterMod = ellipse.perimeter.get()

        // Some size and perimeter comparison stats
        if (showScanLineStats) {
            const fireEllipseScanLines = new FireEllipseScanLines(ignEast, ignNorth,
                ellipse.length.dist.get(), ellipse.width.dist.get(), bearing,
                ellipse.center.east.get(), ellipse.center.north.get(), 1, 'ft')
            sizeScan = fireEllipseScanLines.size
            perimeterScan = fireEllipseScanLines.perimeter
            rasterScan = fireEllipseScanLines.rasterSize
        }

        // Generate perimeter points for the fire ellipse
        const gen = new FirePerimeterGenerator(lwr, headRos, bearing, elapsed, degStep, ignEast, ignNorth)
        gap = gen.maxGap()
        // Convert perimeter points to BurnMap and canvas raster coordinates
        // dataSource.burnMap.castBurnLines(ignCol, ignRow, endPoints)
        points = gen.points
        
        // Because we're just spinning the same FireEllipse,
        // must start with a fresh BurnMap each frame
        dataSource = new DataSource(width, height)
        castBurnLines(dataSource, points)
        if(showBurnCounts) counts = dataSource.burnMap.getCounts()
        if (showBurnGaps) burnGaps = dataSource.burnMap.getGaps()
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Ellipse Collision Detection via Ray Cast</div>
    <div class='ml-4 text-lg'>FireEllipseMod Size {sizeMod.toFixed(2)}, Perim {perimeterMod.toFixed(2)}</div>
    
    {#if showScanLineStats}
        <div class='ml-4 text-lg'>Scan lines Size {sizeScan.toFixed(2)} raster {rasterScan}, Perim {perimeterScan.toFixed(2)}</div>
    {/if}

    {#if showBurnCounts}
        <div class='ml-4 text-lg'>BurnMap Burning {counts[dataSource.burnMap.burning]}</div>
    {/if}

    {#if showBurnGaps}
        <div class='ml-4 text-lg'>BurnMap Burning has {burnGaps} gaps</div>
    {/if}

    <div class='ml-4 text-lg'>Degree increment={degStep}, max gap={gap.distance.toFixed(4)} at angle {gap.angle.toFixed(2)}.</div>
    <div class='ml-4 text-lg'>Elapsed time {msec} milliseconds</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North
    </div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>