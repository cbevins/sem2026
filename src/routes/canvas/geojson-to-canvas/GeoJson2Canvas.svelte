<script>
    import { onMount } from "svelte"
    let {width=512, height=512} = $props()

    let burnedCells = $state(0)
    let elapsed = $state(0)
    let perim = $state([])

    const burned = 255
    const burnedStyle = 'red'
    const unburned = 0
    const unburnedStyle = 'green'

    // Bind this variable to the canvas element
    let canvasElement
    let ctx, imageData, data

    // Convenience function for drawing ellipse with a bearing
    function drawEllipse(cx, cy, rx, ry, bearing, start=0, end=2*Math.PI) {
        const rads = ((90 + bearing) % 360) * Math.PI / 180
        ctx.ellipse(cx, cy, rx, ry, rads, start, end)
    }
    onMount(() => {
        // Get the canvas context
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw(ctx)
    })
    function draw(ctx) {
        // 1 - Clear the canvas
        ctx.fillStyle = unburnedStyle
        ctx.fillRect(0, 0, width, height)

        // 2 - Draw current fire from GeoJSON Polygon
        ctx.beginPath()
        drawEllipse(256, 256, 50, 25, 35)
        ctx.fillStyle = burnedStyle
        ctx.fill()

        // 3 - Get image data
        const t0 = new Date()
        imageData = ctx.getImageData(0, 0, width, height)
        data = imageData.data  // This is the Uint8ClampedArray

        // 4 - Determine ignition points
        let n = 0
        const edge = []
        for(let row=0; row<imageData.height; row++ ) {
            for(let col=0; col<imageData.width; col++ ) {
                if (isBurned(col, row, imageData)) {
                    n++
                }
            }
        }
        burnedCells = n
        perim = edge
        // ctx.putImageData(imageData, 0, 0)
        elapsed = (new Date() - t0)
    }
    function isBurned(col, row, imageData) {
        const idx = 4 * (col + row * imageData.width)
        const r = imageData.data[idx]
        // const g = data[i+1]
        // const b = data[i+2]
        // const a = data[i+3]
        return r === burned }
</script>

<div class='mt-4 ml-4 border'>
    <div class='text-2xl'>GeoJson2Canvas</div>
    <div class='text-lg'>{burnedCells} Burned Points ({elapsed} msec)</div>
    <div class='text-lg'>Perimeter consists of {perim.length} points</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} width={width} height={512}>
    </canvas>
</div>