<script>
    import { onMount } from 'svelte'
    import { setPixel, strokePath } from '../canvasLib.js'
    import { scanEllipse2 } from '../scanEllipse.js'
    import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'
    import { DagNodeTable, Expand } from '$lib/index.js'
    // import {activeInputNodesTable, selectedNodesTable} from '$lib/dag/DagTables.js'

    let {width=512, height=512} = $props()
    let cx = $derived(Math.trunc(width/2))
    let cy = $derived(Math.trunc(height/2))
    
    let offsetX = $state(0)
    let offsetY = $state(0)
    let running = $state(false)
    let hlines = $state([])

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    //-----------------------------------------------------------------------------------------
    // Fire Ellipse
    //-----------------------------------------------------------------------------------------
    
    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwr = $state(3.2)
    let headRos = $state(115.31)
    let bearing = $state(0)
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

    let inputNodes       = ellipse.sortNodes(ellipse.activeInputNodes())
    let activeInputNodes = ellipse.sortNodes(ellipse.activeInputNodes())
    let selectedNodes    = ellipse.sortNodes(ellipse.selectedNodes())
    let activeNodes      = ellipse.sortNodes(ellipse.activeNodes())
    const allNodes = ellipse.sortNodes(ellipse.nodes())

    //-----------------------------------------------------------------------------------------

    function canvasX(easting) { return Math.trunc(easting+0.5) + cx }
    function canvasY(northing) { return cy - Math.trunc(northing+0.5) }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })

    function draw() {
        updateData()
        drawBackground(ctx)
        drawScanLines(ctx, hlines)
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

    function drawScanLines(ctx, lines) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        for(let [p1, p2] of lines) {
            const col1 = canvasX(p1.x)
            const row1 = canvasY(p1.y)
            const col2 = canvasX(p2.x)
            const row2 = canvasY(p2.y)
            ctx.moveTo(col1, row1)
            ctx.lineTo(col2, row2)
        }
        ctx.stroke()
    }
    
    function updateData() {
        bearing = (bearing<355) ? bearing + 5 : 0
        ellipse.head.bearing.set(bearing)
        ignition.east.set(ignEast)
        ignition.north.set(ignNorth)
        head.bearing.set(bearing)
        head.ros.set(headRos)
        ellipse.lwr.set(lwr)
        ellipse.time.set(elapsed)
        ellipse.updateAll()
        hlines = scanEllipse2(ignEast, ignNorth,
            ellipse.length.dist.get(), ellipse.width.dist.get(),
            ellipse.center.east.get(), ellipse.center.north.get(),
            headDeg, 1, 'h')
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
    <div class='text-2xl'>FireEllipseMod Scan Lines</div>
    <div class='text-lg'>Bearing is {bearing}&deg; (last click at [{offsetX}, {offsetY}])</div>
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