<script>
    import { onMount } from "svelte"
    import { gridIntersections } from "../gridIntersections.js"
    import { getBresenhamLinePoints } from "../getBreshenhamLinePoints.js"

    let {width=512, height=512, gridRadius=10} = $props()

    let gridDim = $derived(1 + 2 * gridRadius)
    let dx = $derived(Math.trunc(width / (gridDim+2)))  // left side of left-most cell
    let cx = $derived(dx * (gridRadius+1))              // left side of center cell [0,0]
    let zx = $derived(dx + gridDim * dx)                // right side of right-most cell
    let dy = $derived(Math.trunc(height / (gridDim+2))) // top side of top-most cell
    let cy = $derived(dy * (gridRadius+1))              // top side of center cell [0,0]
    let zy = $derived(dy + gridDim * dy)                // top side of bottom-most cell

    let offsetX = $state(0)
    let offsetY = $state(0)
    let clickCol = $derived(colAtX(offsetX))
    let clickRow = $derived(rowAtY(offsetY))
    let intersection = $state([])
    let bresenham = $state([])
    let slope = $state(0)

    // Bind this variable to the canvas element
    let canvasElement, ctx
    const burnedStyle = 'red'
    const unburnedStyle = 'green'

    function walker(col1, row1, col2, row2) {
        const dy = row2 - row1
        const dx = col2 - col1
        slope = (dx===0) ? null : dy / dx
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw(ctx)
    })
    
    function draw(ctx) {
        updateData()
        drawBackground(ctx)
        drawGraticules(ctx)
    }

    function drawBackground(ctx) {
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
    }

    function drawLineOfSight(ctx, col, row) {
        ctx.strokeStyle = 'red'
        ctx.beginPath()
        ctx.moveTo(colCenter(0), rowCenter(0))
        ctx.lineTo(colCenter(col), rowCenter(row))
        ctx.stroke()
    }
    
    // Returns the canvas pixel of the cell center or upper-left corner
    // given the cell col or row *offset* where the grid's center cell is [0,0]
    function colCenter(col) { return cx + col*dx + dx/2 }
    function colUl(col) { return cx + col*dx }
    function rowCenter(row) { return cy - row*dy + dy/2 }
    function rowUl(row) { return cy - row*dy }

    // Returns the cell containing the canvas pixel
    function colAtX(x) { return Math.trunc(x/dx) - gridRadius - 1 }
    function rowAtY(y) { return gridRadius - Math.trunc(y/dy) + 1 }

    function fillCell(col, row, color="rgba(255, 255, 255, 0.5)") {
        ctx.fillStyle = color
        ctx.fillRect(colUl(col), rowUl(row), dx, dy)
    }

    function drawBresenhamCells() {
        for(let cell of bresenham) {
            fillCell(cell.x, cell.y, "rgba(255, 0, 0, 0.5)")
        }
    }

    function drawIntersectionCells() {
        for(let cell of intersection) {
            fillCell(Math.trunc(cell.x), Math.trunc(cell.y), "rgba(0, 0, 255, 0.5)")
        }
    }

    function drawIntersectionPoints() {
        const d = 2
        const w = 5
        ctx.fillStyle = "rgba(255, 0, 0, 1)"
        for(let cell of intersection) {
            ctx.fillRect((cx+dx/2+dx*(cell.x-0.5))-d, (cy-dy/2-dy*(cell.y-1))-d, w, w)
        }
        // Center and four corners of source cell
        ctx.fillStyle = "cyan"
        ctx.fillRect(cx+(0*dx)+dx/2-d, cy-(0*dy)+dy/2-d, w, w)
        ctx.fillRect(cx+(1*dx)-d, cy-(0*dy)-d, w, w)    // ne [1, 1] => [1, 0]
        ctx.fillRect(cx+(1*dx)-d, cy-(-1*dy)-d, w, w)   // se [1, -1] => [1, -1]
        ctx.fillRect(cx+(0*dx)-d, cy-(-1*dy)-d, w, w)   // sw [-1, -1] => [0, -1]
        ctx.fillRect(cx+(0*dx)-d, cy-(0*dy)-d, w, w)    // nw [-1, 1] => [0, 0]
    }

    function clicked(e) {
        offsetX = e.offsetX
        offsetY = e.offsetY
        drawBackground(ctx)
        drawGraticules(ctx)
        fillCell(clickCol, clickRow)
        updateData()
        // drawBresenhamCells()
        drawIntersectionCells()
        drawIntersectionPoints()
        drawLineOfSight(ctx, clickCol, clickRow)
    }

    function updateData() {
        intersection = gridIntersections({x:0, y:0}, {x: clickCol, y: clickRow})
        bresenham = getBresenhamLinePoints(0, 0, clickCol, clickRow)
        walker(0, 0, clickCol, clickRow)
    }
</script>
    
<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Grid Paths</div>
    <div class='ml-4 text-lg'>Click at [{offsetX}, {offsetY}] is cell [{clickCol}, {clickRow}]</div>
    <div class='ml-4 text-lg'>Sightline has {intersection.length} cells.</div>
    <div class='ml-4 text-lg'>Slope {slope===null?'Vertical':slope}</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>

    {intersection.length} Intersection Points
    <table>
        <tbody>
            {#each intersection as cell, i}
                <tr>
                    <td class='border px-1 py-1'>{i}</td>
                    <td class='border px-1 py-1'>{cell.x.toFixed(4)}</td>
                    <td class='border px-1 py-1'>{cell.y.toFixed(4)}</td>
                </tr>
            {/each}
        </tbody>
    </table>

    {bresenham.length} Bresenham Cells
    <table>
        <tbody>
            {#each bresenham as cell, i}
                <tr>
                    <td class='border px-1 py-1'>{i}</td>
                    <td class='border px-1 py-1'>{cell.x.toFixed(4)}</td>
                    <td class='border px-1 py-1'>{cell.y.toFixed(4)}</td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>