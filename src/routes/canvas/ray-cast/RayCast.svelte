<script>
    import { onMount } from "svelte"
    import { RaycastDataProvider } from "../DataProvider.js"
    import { FireEllipseModel } from '../FireEllipseModel.js'
    import { canvasX, canvasY, drawCentralAxis } from '../canvasLib.js'
    import { FireEllipseScanLines } from '../FireEllipseScanLines.js'
	import { BurnMap } from "../BurnMap.js";

    let {width=512, height=512} = $props()
    
    let fire1 = $state({ignEast:0, ignNorth:0, lwr:2, headRos:250, bearing:-5, elapsed:1,
        points:[], size:0, perimeter:0,
        gap:{distance:0, angle:0, index:0},
        scan:{size:0, cells:0, perimeter:0}})
    let fire2 = $state({ignEast:100, ignNorth:100, lwr:2, headRos:250, bearing:85, elapsed:1,
        points:[], size:0, perimeter:0,
        gap:{distance:0, angle:0, index:0},
        scan:{size:0, cells:0, perimeter:0}})
    let fires = $derived([fire1, fire2])
    let degStep = $state(0.5)

    const dataProvider = new RaycastDataProvider()
    let burnMap = $derived(dataProvider.getBurnMap(0, height/2, width, height, 1))
    let counts = $derived([0,0,0,0])
    let msec = $state(0)
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)

    let showBurnCounts = $state(true)
    let showBurnGaps = $state(true)
    let showScanLineStats = $state(true)

    // Bind this variable to the canvas element
    let canvasElement, ctx, animId

    //-----------------------------------------------------------------------------------------

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        draw()
    }

    function draw() {
        const t0 = new Date()
        updateData()
        burnMap.drawToCanvas(ctx)
        drawCentralAxis(ctx)
        for(let fire of fires)
            fillCell(canvasX(ctx, fire.ignEast), canvasY(ctx, fire.ignNorth), "yellow")
        msec = new Date() - t0
        if (running) animId = window.requestAnimationFrame(draw)
    }

    function castBurnLines(dataSource, fire) {
        const ignCol = canvasX(ctx, fire.ignEast)
        const ignRow = canvasY(ctx, fire.ignNorth)
        for(let [easting, northing /*, bearing*/] of fire.points) {
            const lastCol = canvasX(ctx, easting)
            const lastRow = canvasY(ctx, northing)
            burnMap.castBurnLine(ignCol, ignRow, lastCol, lastRow)
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
        // Because we're just spinning the same FireEllipses
        // (instead of growing the same fire),
        // each frame must start with a fresh BurnMap
        burnMap = dataProvider.getBurnMap(0, 0, width, height, 1)

        // Generate perimeter points for the fire ellipse at the current bearing
        for(let fire of fires) {
            fire.bearing = (fire.bearing + 5)%360
            const gen = new FireEllipseModel(fire.lwr, fire.headRos, fire.bearing,
                fire.elapsed, fire.ignEast, fire.ignNorth)
            fire.points = gen.perimeterPoints(degStep)
            if (showBurnGaps) fire.gap = gen.maxGap(fire.points)
            fire.size = gen.size()
            fire.perimeter = gen.perimeter()
            castBurnLines(burnMap, fire)
            // Some ScanLine size and perimeters for comparison purposes ...
            if (showScanLineStats) {
                const fireEllipseScanLines = new FireEllipseScanLines(
                    fire.ignEast, fire.ignNorth,
                    gen.length(), gen.width(), fire.bearing,
                    gen.centerEasting(), gen.centerNorthing(), 1, 'ft')
                fire.scan.size = fireEllipseScanLines.size
                fire.scan.perimeter = fireEllipseScanLines.perimeter
                fire.scan.cells = fireEllipseScanLines.rasterSize
            }
        }
        if (showBurnCounts) counts = burnMap.getBurnCounts()
    }
</script>

{#snippet item(content)}
    <td class='text-sm px-2 py-1 border border-gray-300'>{content}</td>
{/snippet}
{#snippet head(content)}
    <th class='text-sm px-2 py-1 border border-gray-300'>{content}</th>
{/snippet}

<!-- --------------------------------------------------------------------------- -->
{#snippet burnCountsTable(counts)}
    <table class='ml-4 mt-2 table-auto text-sm'>
        <tbody>
            <tr>
                {@render head('Burning')}{@render head('Burned')}
                {@render head('Unburned')}{@render head('Unburnable')}
            </tr>
            <tr>
                {@render item(counts[BurnMap.burning])}
                {@render item(counts[BurnMap.burned])}
                {@render item(counts[BurnMap.unburned])}
                {@render item(counts[BurnMap.unburnable])}
            </tr>
        </tbody>
    </table>
{/snippet}

<!-- --------------------------------------------------------------------------- -->

{#snippet fireEllipseTable(firesArray)}
    <table class='ml-4 table-auto text-sm'>
        <tbody>
        <tr>
            {@render head('Fire')}{@render head('Bearing')}
            {@render head('Size')}{@render head('Perim')}
            {#if showScanLineStats}
                {@render head('Scan Size')}{@render head('Scan Perim')}
            {/if}
            {#if showBurnGaps}
                {@render head('Max Gap')}{@render head('Gap Angle')}
            {/if}
        </tr>
            {#each firesArray as fire, i}
            <tr>
                {@render item(i+1)}
                {@render item(fire.bearing.toFixed(2))}
                {@render item(fire.size.toFixed(2))}
                {@render item(fire.perimeter.toFixed(2))}
                {#if showScanLineStats}
                    {@render item(fire.scan.size.toFixed(2))}
                    {@render item(fire.scan.perimeter.toFixed(2))}
                {/if}
                {#if showBurnGaps}
                    {@render item(fire.gap.distance.toFixed(4))}
                    {@render item(fire.gap.angle.toFixed(2))}
                {/if}
            </tr>
            {/each}
        </tbody>
    </table>
{/snippet}

<!-- --------------------------------------------------------------------------- -->

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Ellipse Collision Detection via Ray Casting</div>

    {@render fireEllipseTable(fires)}

    {#if showBurnCounts}
        {@render burnCountsTable(counts)}
    {/if}

    <div class='ml-4 mt-2 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>Elapsed time {msec} milliseconds</span>
    </div>

    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>