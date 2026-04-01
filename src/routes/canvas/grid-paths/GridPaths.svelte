<script>
    import { onMount } from "svelte"

    let {width=512, height=512, gridRadius=10} = $props()
    let offsetX = $state(0)
    let offsetY = $state(0)
    let clickCol = $derived(colAtX(offsetX))
    let clickRow = $derived(rowAtY(offsetY))

    let gridDim = $derived(1 + 2 * gridRadius)
    let dx = $derived(Math.trunc(width / (gridDim+2)))  // left side of left-most cell
    let cx = $derived(dx * (gridRadius+1))              // left side of center cell [0,0]
    let zx = $derived(dx + gridDim * dx)                // right side of right-most cell
    let dy = $derived(Math.trunc(height / (gridDim+2))) // top side of top-most cell
    let cy = $derived(dy * (gridRadius+1))              // top side of center cell [0,0]
    let zy = $derived(dy + gridDim * dy)                // top side of bottom-most cell

    // Bind this variable to the canvas element
    let canvasElement
    let ctx
    const burnedStyle = 'red'
    const unburnedStyle = 'green'

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        drawBackground(ctx)
        drawGraticules(ctx)
    })

    function drawBackground(ctx) {
        // 1 - Clear the canvas
        ctx.fillStyle = unburnedStyle
        ctx.fillRect(0, 0, width, height)
    }

    function drawGraticules(ctx) {
        ctx.strokeStyle = 'black'
        ctx.beginPath()
        for(let x=dx; x<=zx; x+=dx) {
            ctx.moveTo(x, dy)
            ctx.lineTo(x, zy)
        }
        for(let y=dy; y<=zy; y+=dy) {
            ctx.moveTo(dx, y)
            ctx.lineTo(zx, y)
        }
        for(let x=-gridRadius; x<=gridRadius; x++) {
            ctx.strokeText(x.toString(), (cx+dx/4)+x*dx, 3*dy/4)
            ctx.strokeText(x.toString(), (cx+dx/4)+x*dx, zy+3*dy/4)
        }
        for(let y=gridRadius; y>=-gridRadius; y--) {
            ctx.strokeText(y.toString(),    dx/4, (cy+3*dy/4)-y*dy)
            ctx.strokeText(y.toString(), zx+dx/4, (cy+3*dy/4)-y*dy)
        }
        ctx.stroke()
        ctx.fillStyle = 'white'
        ctx.fillRect(cx, cy, dx, dy)
        ctx.fill()
    }
    function drawLineOfSight(ctx, col, row) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(colCenter(0), rowCenter(0))
        ctx.lineTo(colCenter(col), rowCenter(row))
        ctx.stroke()
    }
    
    // Returns the canvas pixel of the center of the cell at col or row,
    // where the grid's center cell is [0,0]
    function colCenter(col) { return cx + col*dx + dx/2 }
    function rowCenter(row) { return cy - row*dy + dy/2 }

    // Returns the cell containing the canvas pixel
    function colAtX(x) { return Math.trunc(x/dx) - gridRadius - 1 }
    function rowAtY(y) { return gridRadius - Math.trunc(y/dy) + 1 }
    
    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        drawBackground(ctx)
        drawGraticules(ctx)
        drawLineOfSight(ctx, clickCol, clickRow)
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='text-2xl'>Grid Paths</div>
    <div class='text-2xl'>Click at [{offsetX}, {offsetY}] is cell [{clickCol}, {clickRow}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement}  onclick={clicked} width={width} height={height}>
    </canvas>
</div>