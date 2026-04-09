<script>
    import { onMount } from "svelte"
    import { RayCastModel } from "./RayCastModel.js"
    import { canvasX, canvasY, drawCentralAxis } from '../canvasLib.js'
	import { BurnMap } from "../BurnMap.js";

    let {width=512, height=512} = $props()
    let degStep = $state(0.5)

    let showBurnCounts = $state(true)
    let showBurnGaps = $state(true)
    let showScanLineStats = $state(true)

    let dataModel = $derived(new RayCastModel(width, height, degStep,
        showBurnCounts, showBurnGaps, showScanLineStats))
    let counts = $derived(dataModel.counts)
    let msec = $state(0)
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let frames = $state(1)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    // Bind this variable to the canvas element
    let canvasElement, ctx, animId

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        draw()
    }

    function draw() {
        const t0 = new Date()
        // First draw the BurnMap
        dataModel = new RayCastModel(width, height, degStep,
            showBurnCounts, showBurnGaps, showScanLineStats)
        dataModel.burnMap.drawToCanvas(ctx)
        // Then add any additional elements like axis, text, etc.
        drawCentralAxis(ctx)
        for(let fire of dataModel.fires)
            fillCell(canvasX(ctx, fire.ignEast), canvasY(ctx, fire.ignNorth), "yellow")
        msec = new Date() - t0
        totalMsec += msec
        meanMsec = (totalMsec / frames).toFixed(2)
        frames++
        if (running) animId = window.requestAnimationFrame(draw)
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

    {@render fireEllipseTable(dataModel.fires)}

    {#if showBurnCounts}
        {@render burnCountsTable(counts)}
    {/if}

    <div class='ml-4 mt-2 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>{frames} Frames,
            Run Msec {totalMsec}, Avg Frame Msec {meanMsec}
            ({(1000/meanMsec).toFixed(2)} fps)
        </span>
    </div>

    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>