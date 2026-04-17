<script>
    import { onMount } from "svelte"
    import { BurnMap } from "./BurnMap.js"
    import { GeoServer } from './GeoServer.js'
    import { SpriteServer } from './SpriteServer.js'

    let {pcsEast=-256, pcsNorth=256, width=512, height=512, cellDim=1} = $props()
    let geoServer = $state(new GeoServer())
    let spriteServer = $state(null)
    let burnMap = $derived(new BurnMap(geoServer, pcsEast, pcsNorth, cellDim, width, height))
    let time = $state(0)
    let begStatusFreq = $state({})
    let endStatusFreq = $state({})
    let frontCells = $state([])
    let stopTime = $state(2)

    // Bind this variable to the canvas element
    let canvasElement, ctx//, animId
    let msec = $state(0)
    let running = $state(false)
    let frames = $state(1)
    let totalMsec = $state(0)
    let meanMsec = $derived((totalMsec/frames).toFixed(2))

    function log(title, table, columns=[]) {
        console.log(title); console.table(table, columns) }

    function run() {
        // The following should go into GeoFireModel.js
        const t0 = new Date()

        // 1 - Get an array of all fire front raster cell [col, row]
        frontCells = burnMap.getFireFrontCells()
        log(`End Time ${time} Fire Front Cells (${frontCells.length})`, frontCells)

        // 2 - Set next time
        time++
        burnMap.time = time
        console.log('********** Start time', time)
        // 3 - Get starting burn status frequencies
        begStatusFreq = burnMap.getStatusFreq()
        log(`Beg Time ${time} Burn Status Frequencies`, begStatusFreq)

        // 4 - Ignite a Sprite at each fire front cell
        for(let frontCell of frontCells) {
            const [col, row, ignEast, ignNorth] = frontCell
            // 4.1 - Request GeoServer for fire behavior for current location and time
            const firePacket = geoServer.getFireBehavior(ignEast, ignNorth, time, 1)
            // log(`FirePacket at [${col}, ${row}, ${ignEast.toFixed(2)}, ${ignNorth.toFixed(2)}]`,
                // firePacket)

            // 4.2 - Request SpriteServer for a fire ellipse sprite with perimeter
            const sprite = spriteServer.getSprite(ignEast, ignNorth, firePacket, 1)
            // log(`Sprite at [${col}, ${row}, ${ignEast.toFixed(2)}, ${ignNorth.toFixed(2)}]`,
                // sprite, ['Value'])

            // Note that scanLine coordinates are for an ignition at [0,0]
            // log(`Sprite.scanlines (${sprite.scanLines.length})`, sprite.scanLines)

            const cells = burnMap.getPerimeterCells(sprite.scanLines, sprite.ignEast, sprite.ignNorth)
            // log(`Sprite Perim Cells (${cells.length})`, cells)

            // Show the sprite perimeter
            ctx.fillStyle = 'green'
            ctx.fillRect(0, 0, width, height)
        
            // Scanline endpoint raster cells
            const endpts = burnMap.getEndPointCells(sprite.scanLines, sprite.ignEast, sprite.ignNorth)
            // console.log(`Sprite endpoint cells (${endpts.length})`, endpts)
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
        }

        // collect timing stats
        msec = new Date() - t0
        totalMsec += msec
        meanMsec = (totalMsec / frames).toFixed(2)
        frames++
        // if (running) animId = window.requestAnimationFrame(run)
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        
        // Initialization should go into GeoFire.js
        geoServer = new GeoServer()
        spriteServer = new SpriteServer()
        burnMap.set(256, 256, 0)
        // begStatusFreq = burnMap.getStatusFreq()
        // log(`onMount Beg Time ${time} Burn Status Frequencies`, begStatusFreq)
        run()
    })

    function runpause() {
    //     if (running) window.cancelAnimationFrame(animId)
    //     else animId = window.requestAnimationFrame(run)
    //     running = ! running
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
