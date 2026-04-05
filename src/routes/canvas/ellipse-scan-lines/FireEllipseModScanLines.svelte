<script>
    import { FireEllipseScanLines } from '../FireEllipseScanLines.js'
    import { onMount } from 'svelte'
    import { drawBackground, drawCentralAxis, drawFireEllipseScanLines } from '../canvasLib.js'
    import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    import { DagNodeTable, Expand } from '$lib/index.js'
    // import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

    let {width=512, height=512} = $props()
    
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let fireEllipseScanLines = $state(null)

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    //-----------------------------------------------------------------------------------------
    // Fire Ellipse
    //-----------------------------------------------------------------------------------------
    
    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwr = $state(3.2)
    let headRos = $state(115.31)
    let bearing = $state(-5)
    let headDeg = $derived((450-bearing)%360)
    let elapsed = $state(1)

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

    // let inputNodes       = ellipse.sortNodes(ellipse.activeInputNodes())
    let activeInputNodes = ellipse.sortNodes(ellipse.activeInputNodes())
    let selectedNodes    = ellipse.sortNodes(ellipse.selectedNodes())
    // let activeNodes      = ellipse.sortNodes(ellipse.activeNodes())
    const allNodes = ellipse.sortNodes(ellipse.nodes())

    //-----------------------------------------------------------------------------------------

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
    }

    function draw() {
        updateData()
        drawBackground(ctx)
        drawFireEllipseScanLines(ctx, fireEllipseScanLines, 'red')
        drawCentralAxis(ctx)
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
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>FireEllipseMod Scan Lines</div>
    <div class='ml-4 text-normal'>Uses FireEllipseMod for scan line generation.</div>
    <div class='ml-4 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        Bearing is {bearing}&deg; from North (Cartesian angle is {headDeg}&deg; above horizon)
    </div>
    <div class='ml-4 text-lg'>Last click at [{offsetX}, {offsetY}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>

    <Expand title='Selected Nodes'>
        <DagNodeTable nodes={selectedNodes} title='Selected Nodes'/>
    </Expand>
    <Expand title='Active Input Nodes'>
        <DagNodeTable nodes={activeInputNodes} title='Active Input Nodes'/>
    </Expand>
    <Expand title='All Nodes'>
        <DagNodeTable nodes={allNodes} title='All Nodes'/>
    </Expand>
</div>