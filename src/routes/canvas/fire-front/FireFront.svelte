<script>
    import { onMount } from "svelte"
    import { FireFrontModel } from "./FireFrontModel.js"
    import { drawCentralAxis } from '../canvasLib.js'
	import { BurnMap } from "../BurnMap.js"     // needed for BurnMap.<codes>
    // import Neighbors from '../Neighbors.svelte'
    
    let {width=512, height=512} = $props()
    let degStep = $state(0.2)

    // Bind this variable to the canvas element
    let canvasElement, ctx, animId

    let dataModel = $derived(new FireFrontModel(width, height, degStep))
    let counts = $derived(dataModel.counts)
    let msec = $state(0)
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let frames = $state(1)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        draw()
    }

    function draw() {
        const t0 = new Date()
        // First draw the BurnMap
        dataModel.updateSpinner()
        dataModel.drawToCanvas(ctx)
        // Then add any additional elements like axis, text, etc.
        drawCentralAxis(ctx)
        // collect timing stats
        msec = new Date() - t0
        totalMsec += msec
        meanMsec = (totalMsec / frames).toFixed(2)
        frames++
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
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Fire Front Generation</div>
    <!-- <div><Neighbors {neighbors} focusCol={clickX} focusRow={clickY}/></div> -->

    {@render burnCountsTable(counts)}

    <div class='ml-4 mt-2 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>{frames} Frames,
            Run Msec {totalMsec}, Avg Frame Msec {meanMsec}
            ({(1000/meanMsec).toFixed(2)} fps) DegStep {degStep}
        </span>
    </div>

    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>

<!-- --------------------------------------------------------------------------- -->

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
