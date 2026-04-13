<script>
    import { onMount } from "svelte"
    import { BurnMap } from "./BurnMap.js"
    import { GeoServer } from './GeoServer.js'
    import { SpriteServer } from './SpriteServer.js'

    let {width=512, height=512} = $props()
    let burnMap = $derived(new BurnMap(new GeoServer(), -256, 256, 1, width, height))
    let counts = $state({})
    let front = $state([])
    
    // Bind this variable to the canvas element
    let canvasElement, ctx, animId
    let msec = $state(0)
    let running = $state(false)
    let frames = $state(1)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    function run() {
        console.clear()
        const t0 = new Date()

        // 1 - Request GeoServer for fire behavior for current location and time
        const geoServer = new GeoServer()
        const ignEast = 0
        const ignNorth = 0
        const firePacket = geoServer.getFireBehavior(ignEast, ignNorth, 0, 1)
        console.log('FirePacket')
        console.table(firePacket)

        // 2 - Request SpriteServer for a fire ellipse sprite with perimeter
        const spriteServer = new SpriteServer()
        const sprite = spriteServer.getSprite(ignEast, ignNorth, firePacket, 1)
        console.log('Sprite')
        console.table(sprite, ['Value'])

        // Note that scanLine coordinates are for an ignition at [0,0]
        console.log('Sprite.scanlines', sprite.scanLines.length)
        console.table(sprite.scanLines)

        // SCanline endpoint raster cells
        const endpts = burnMap.getEndPointCells(sprite.scanLines, sprite.ignEast, sprite.ignNorth)
        console.log('Sprite endpoint cells', endpts.length)
        console.table(endpts)
        
        const cells = burnMap.getPerimeterCells(sprite.scanLines, sprite.ignEast, sprite.ignNorth)
        console.log('Sprite.cells', cells.length)
        console.table(cells)

        // Show the sprite perimeter
        ctx.fillStyle = 'green'
        ctx.fillRect(0, 0, width, height)
        
        // Display scanlines
        ctx.beginPath()
        ctx.strokeStyle='red'
        for(let pair of endpts) {
            let [x1,y1] = pair[0]
            ctx.moveTo(x1,y1)
            let [x2,y2] = pair[1]
            ctx.lineTo(x2, y2)
        }
        ctx.stroke()

        // Display the scanline perimeter raster cells
        ctx.fillStyle='cyan'
        for(let cell of cells) {
            const [col, row] = cell
            ctx.fillRect(col, row, 1, 1)
        }

        // BurnMap
        front = burnMap.getFireFront()
        console.table(front)
        counts = burnMap.getCounts()
        console.table(counts)
        // collect timing stats
        msec = new Date() - t0
        totalMsec += msec
        meanMsec = (totalMsec / frames).toFixed(2)
        frames++
        if (running) animId = window.requestAnimationFrame(run)
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        burnMap.set(256, 256, 0)
        run()
    })

    function runpause() {
        if (running) window.cancelAnimationFrame(animId)
        else animId = window.requestAnimationFrame(run)
        running = ! running
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Geographical Fire Spread</div>

    <div class='ml-4 mt-2 text-lg'>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>{frames} Frames,
            Run Msec {totalMsec}, Avg Frame Msec {meanMsec}
            ({(1000/meanMsec).toFixed(2)} fps)
        </span>
    </div>

    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} width={width} height={height}>
    </canvas>
</div>
