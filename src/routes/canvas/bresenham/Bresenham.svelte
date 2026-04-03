<script>
    import { onMount } from "svelte"
    import { bresenham, bresenhamSuperCover } from "../bresenhamSuperCover.js"

    let {width=512, height=512} = $props()
    let cx = $derived(width/2)
    let cy = $derived(height/2)

    let offsetX = $state(0)
    let offsetY = $state(0)
    let points = $state([])
    let superPoints = $state([])

    // Bind this variable to the canvas element
    let canvasElement, ctx
    const unburnedStyle = 'green'

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw(ctx)
    })
    
    function draw(ctx) {
        updateData()
        drawBackground(ctx)
        drawSuperPoints()
        drawPoints()
        fillCell(cx, cy, "yellow")
    }

    function drawBackground(ctx) {
        ctx.fillStyle = unburnedStyle
        ctx.fillRect(0, 0, width, height)
    }

    function drawPoints() {
        for(let [x, y] of points) fillCell(x, y)
    }

    function drawSuperPoints() {
        for(let [x, y] of superPoints) fillCell(x, y, "rgba(255, 0, 0, 1)")
    }

    function fillCell(col, row, color="rgba(255, 255, 255, 0.5)") {
        ctx.fillStyle = color
        ctx.fillRect(col-1, row-1, 3, 3)
    }

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        draw(ctx)
    }

    function updateData() {
        points = bresenham(cx, cy, offsetX, offsetY)
        superPoints = bresenhamSuperCover(cx, cy, offsetX, offsetY)
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Bresenham Line-of-Sight</div>
    <div class='ml-4 text-lg'>Click at [{offsetX}, {offsetY}]</div>
    <div class='ml-4 text-lg'>Bresenham line traverses {points.length} or {superPoints.length} cells</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>