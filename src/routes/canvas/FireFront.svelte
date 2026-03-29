<script>
    import { onMount } from "svelte"
    import {drawEllipse, rgbaNeighbors, rByte, rindex} from './canvasLib.js'
    import Neighbors from './Neighbors.svelte'

    let {width=512, height=512} = $props()

    let burnedPoints = $state([])
    let elapsed = $state(0)
    let fireFrontPoints = $state([])
    let neighbors = $state([])
    let clickX = $state(0)
    let clickY = $state(0)
    const burnedStyle = 'red'
    const unburnedStyle = 'green'
    
    // Bind this variable to the canvas element
    let canvasElement
    let ctx, imageData
    let ellipseData
    let justShowTemplate = false

    //--------------------------------------------------------------------------
    // Move the following functions into a fire growth library
    //  1 - Draw (fill) initial fire front polygon,
    //          perhaps from a GeoJSON -> PCS -> canvas raster pipe.
    //  2 - Determine fire front points
    //  3 - Draw (fill) an ellipse at each fire front point
    //  4 - Construct new polygon of fire front points
    //--------------------------------------------------------------------------

    // Returns an array of all Canvas [col, row] points that are burned
    function getBurnedPoints(imageData) {
        const pts = []
        for(let row=0; row<imageData.height; row++ ) {
            for(let col=0; col<imageData.width; col++ ) {
                if (isBurned(imageData, col, row)) pts.push([col,row])
            }
        }
        return pts
    }

    // Returns an array of Canvas [col,row] points that are burned
    // and have at least 1 unburned neighbor
    function getFireFrontPoints(imageData) {
        const front = []
        for(let row=1; row<imageData.height-1; row++ ) {
            for(let col=1; col<imageData.width-1; col++ ) {
                if (isBurned(imageData, col, row)) {
                    if (   !isBurned(imageData, col-1, row-1)
                        || !isBurned(imageData, col-1, row)
                        || !isBurned(imageData, col-1, row+1)
                        || !isBurned(imageData, col,   row-1)
                        || !isBurned(imageData, col,   row+1)
                        || !isBurned(imageData, col+1, row-1)
                        || !isBurned(imageData, col+1, row)
                        || !isBurned(imageData, col+1, row+1)
                    ) front.push([col,row])
                }
            }
        }
        return front
    }

    // NOTE: Red channel is devoted to the point's burn state
    // where 0 is unburned, and anything else is burned.
    // Even though we set the ellipse red to 255, its edges are antialiased
    // to lower values, and cannot be used as state indicators.
    function isBurned(imageData, col, row) { return rByte(imageData, col, row) > 0 }

    //--------------------------------------------------------------------------

    // Temporarily highjacks the context to draw and save 1 or more
    // ellipse imageData templates
    // Now the red channel is not anti-aliased (but the alpha channel still is)
    function makeTemplates() {
        // Create the fire ellipse template on the canvas
        let cx = 50
        let cy = 25
        ctx.beginPath()
        ctx.fillStyle = burnedStyle
        drawEllipse(ctx, cx, cy, 50, 25, 90)
        ctx.fill()

        // Add the ignition point for reference
        ctx.beginPath()
        ctx.fillStyle = 'yellow'
        drawEllipse(ctx, 10, cy, 2, 2, 0)

        // Save the image data
        ellipseData = ctx.getImageData(0, 0, 100, 50)
        clickX = cx
        clickY = cy
        neighbors = rgbaNeighbors(ellipseData, cx, cy)

        if (justShowTemplate) {
            burnedPoints = getBurnedPoints(ellipseData)
            fireFrontPoints = getFireFrontPoints(ellipseData)
            // confirm the fire front by painting it yellow
            for(let [col,row] of fireFrontPoints) {
                const idx = rindex(ellipseData, col, row)
                ellipseData.data[idx+1] = 255  
                ellipseData.data[idx+3] = 255  
            }
            ctx.putImageData(ellipseData, 0, 0)
        } else {
            // Clear the templates from the canvas before returning
            ctx.clearRect(0, 0, canvasElement.width, canvasElement.height)
        }
    }

    onMount(() => {
        // Get the canvas context
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        // Start by getting an imageData ellipse template
        makeTemplates()
        if (! justShowTemplate) draw(ctx)
    })

    function draw(ctx) {
        // 1 - Clear the canvas
        ctx.fillStyle = unburnedStyle
        ctx.fillRect(0, 0, width, height)

        // 2 - Draw current fire (should be from GeoJSON Polygon)
        ctx.beginPath()
        let cx = 256
        let cy = 256
        drawEllipse(ctx, cx, cy, 50, 25, 90)
        ctx.fillStyle = burnedStyle
        ctx.fill()

        // 3 - Get image data
        const t0 = new Date()
        imageData = ctx.getImageData(0, 0, width, height)

        // 4 - Determine fire front points
        neighbors = rgbaNeighbors(imageData, cx, cy)
        burnedPoints = getBurnedPoints(imageData)
        fireFrontPoints = getFireFrontPoints(imageData)
        // confirm the fire front by painting it white
        for(let [col,row] of fireFrontPoints) {
            const idx = rindex(imageData, col, row)
            imageData.data[idx] = 255  
            imageData.data[idx+1] = 255  
            imageData.data[idx+2] = 255  
        }
        ctx.putImageData(imageData, 0, 0)

        // 5 - Expand perimeter
        // expand(fireFrontPoints)
        // imageData = ctx.getImageData(0, 0, width, height)
        elapsed = (new Date() - t0)
    }

    function expand(points) {
        ctx.beginPath()
        for(let i=0; i<points.length; i++) {
            const [col, row] = points[i]
            drawEllipse(ctx, col, row, 50, 25, 30)
        }
        ctx.fillStyle = 'yellow' // burnedStyle
        ctx.fill()
    }
    function clicked(e){
        neighbors = (justShowTemplate)
            ? rgbaNeighbors(ellipseData, e.offsetX, e.offsetY)
            : rgbaNeighbors(imageData, e.offsetX, e.offsetY)
        clickX = e.offsetX
        clickY = e.offsetY
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='text-2xl'>Fire Front Detection ({elapsed} msec)</div>
    <div class='text-lg'>
        {burnedPoints.length} Burned Points
        with {fireFrontPoints.length} fire front points
    </div>
    <div>
        <Neighbors {neighbors} focusCol={clickX} focusRow={clickY}/>
    </div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>