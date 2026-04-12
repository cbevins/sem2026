<script>
    let {radius=50, cellDim=100} = $props()
    let grid = $derived(getGrid(radius, cellDim))

    function degrees(radians) { return radians * 180 / Math.PI }
    function radians(degrees) {return degrees * Math.PI / 180 }
        
    function getAngle(x1, y1, x2, y2) {
        const dy = y2-y1
        const dx = x2-x1
        const rad = Math.atan2(dy, dx)
        const deg = degrees(rad)
        const bearing = ((450-deg)%360)
        const slope = (dy/dx)
        const dist = Math.hypot(dy, dx) 
        return {x1, y1, dx, x2, y2, dy, deg, bearing, slope, dist}
    }

    function getGrid(radius, cellDim) {
        const rows = []
        const sorted = []
        for(let row=radius; row>=-radius; row--) {
            const cols = []
            for(let col=-radius; col<=radius; col++) {
                const data = getAngle(0, 0, col, row)
                cols.push(data)
                sorted.push(data)
            }
            rows.push(cols)
        }
        const span = 1 + 2 * radius
        const dim = cellDim * (1 + 2*radius)    // pixels
        const last = rows.length * cellDim
        // Sort cells by bearing
        sorted.sort((a, b) => {
            if (a.bearing === b.bearing) return a.dist - b.dist
            return a.bearing - b.bearing
        })
        const lines = [{bearing: sorted[0].bearing, cells:[sorted[[0]]]}]
        for(let i=1; i<sorted.length; i++) {
            if (sorted[i].bearing === lines[lines.length-1].bearing) {
                lines[lines.length-1].cells.push(sorted[i])
            } else {
                lines.push({bearing: sorted[i].bearing, cells: [sorted[i]]})
            }
        }
        console.log(span*span, lines)
        return {dim, rows, last, span, sorted, lines}
    }

    // Drawing helpers
    function centerX(col) { return col*cellDim + cellDim/2 }
    function centerY(row) { return row*cellDim + cellDim/2 }
    function yLine1(row) { return row * cellDim + 1*cellDim/8}
    function yLine2(row) { return row * cellDim + 2*cellDim/8}
    function yLine3(row) { return row * cellDim + 3*cellDim/8}
    function yLine4(row) { return row * cellDim + 4*cellDim/8}
    function yLine5(row) { return row * cellDim + 5*cellDim/8}
    function yLine6(row) { return row * cellDim + 6*cellDim/8}
    function yLine7(row) { return row * cellDim + 7*cellDim/8}
</script>   

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Vector Grid</div>

<svg width={grid.dim+1} height={grid.dim+1}>
    <!-- Background -->
    <rect x=0 y=0 width={grid.dim+1} height={grid.dim+1} fill='green'/>
    
    <!-- Graticules -->
    {#each grid.rows as row, r}
        <line x1=0 y1={r*cellDim} x2={grid.dim} y2={r*cellDim} stroke='red'/>
    {/each}
    <line x1=0 y1={grid.last} x2={grid.dim} y2={grid.last} stroke='red'/>
    
    {#each grid.rows[0] as col, c}
        <line x1={c*cellDim} y1=0 x2={c*cellDim} y2={grid.dim} stroke='red'/>
    {/each}
    <line x1={grid.last} y1=0 x2={grid.last} y2={grid.dim} stroke='red'/>

<!-- Cell content -->
    {#each grid.rows as row, r}
        {#each row as {x1,y1,dx,x2,y2,dy,deg,bearing,slope,dist}, c}
        <circle cx={centerX(c)} cy={centerY(r)} r=4 fill='yellow'/>
        <text x={centerX(c)} y={yLine2(r)} text-anchor='middle'
            stroke='black' font-size=8 font-family='sans-serif' font-weight='light'>
            [{x2}, {y2}]
        </text>
        <text x={centerX(c)} y={yLine3(r)} text-anchor='middle'
            stroke='black' font-size=8 font-family='sans-serif' font-weight='light'>
            d = {dist.toFixed(2)}
        </text>
        <text x={centerX(c)} y={yLine5(r)} text-anchor='middle'
            stroke='black' font-size=8 font-family='sans-serif' font-weight='light'>
            m = {slope.toFixed(2)}
        </text>
        <text x={centerX(c)} y={yLine6(r)} text-anchor='middle'
            stroke='black' font-size=8 font-family='sans-serif' font-weight='light'>
            dy&nbsp;/&nbsp;dx = {dy} / {dx}
        </text>
        <text x={centerX(c)} y={yLine7(r)} text-anchor='middle'
            stroke='black' font-size=8 font-family='sans-serif' font-weight='light'>
            b = {bearing.toFixed(2)}
        </text>
        {/each}
    {/each}

    <line x1={centerX(0)} y1={centerY(0)} x2={centerX(grid.span-1)} y2={centerY(grid.span-1)} stroke='gray'/>
    <line x1={centerX(0)} y1={centerY(grid.span-1)} x2={centerX(grid.span-1)} y2={centerY(0)} stroke='gray'/>
    <line x1={centerX(0)} y1={centerY(radius)} x2={centerX(grid.span-1)} y2={centerY(radius)} stroke='gray'/>
    <line x1={centerX(radius)} y1={centerY(0)} x2={centerX(radius)} y2={centerY(grid.span-1)} stroke='gray'/>
</svg>
</div>