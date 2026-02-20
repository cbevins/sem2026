<script>
    import {normalIntersection } from './Geometry.js'
    import {Expand, GenericTable} from '$lib/index.js'

    let {width, height} = $props()

    // NOTE: all [x,y] are [east,north]
        function north(y) { return height - y }

    // let a, b, and c be 3 adjacent perimeter points
    let a = $state({x: 100, y: 300})
    let b = $state({x: 300, y: 300})
    let c = $state({x: 300, y: 100})
    let dist = $state(20)

    function expand(x, y, bearing, dist) {
        let radians = bearing * Math.PI / 180
        return {
            x: x + dist * Math.cos(radians),
            y: y + dist * Math.sin(radians)
        }
    }

    function vector(fromPt, toPt) {
        let a = fromPt
        let b = toPt
        let dy = b.y - a.y
        let dx = b.x - a.x
        let angle = Math.atan2(dy, dx) * 180 / Math.PI
        let slope = (dx===0) ? 9999999 : dy/dx
        let bearing = (450 - angle) % 360
        // Back-calculate B from I using angle and length
        let radians = bearing * Math.PI / 180
        let length = Math.sqrt(dx*dx + dy*dy)
        let endpoint = {
            x: a.x + length * Math.cos(radians),
            y: a.y + length * Math.sin(radians)
        }
        let next = expand(b.x, b.y, bearing, dist)
        return {dx, dy, slope, angle, bearing, length, endpoint, next}
    }

    // Intersection point between line segment AC and point B
    let i = $derived(normalIntersection(b.x, b.y, a.x, a.y, c.x, c.y))

    // Vector B->I
    let bi = $derived(vector(b, i))
    let ib = $derived(vector(i, b))
    let next = $derived(ib.next)
    
    // Display props
    const perim = 'red'
    const base = 'green'
    const normal = 'blue'
    const growth = 'magenta'

    const data = $derived([
        ['Property', `B -> I`, 'I -> B'],
        ['Perimeter Point', `[${b.x}, ${b.y}]`, ''],
        ['Intersection Point', `[${i.x}, ${i.y}]`, ''],
        ['Slope of Normal', `${bi.slope}`, `${ib.slope}`],
        ['Angle of Normal from horizon', `${bi.angle.toFixed(2)}`, `${ib.angle.toFixed(2)}`],
        ['Bearing of Normal', `${bi.bearing.toFixed(2)}`, `${bi.bearing.toFixed(2)}`],
        ['Opposite Endpoint', `[${bi.endpoint.x.toFixed(2)}, ${bi.endpoint.y.toFixed(2)}]`,
            `[${ib.endpoint.x.toFixed(2)}, ${ib.endpoint.y.toFixed(2)}]`],
        ['Growth Vector Endpoint', `[${bi.next.x.toFixed(2)}, ${bi.next.y.toFixed(2)}]`,
            `[${ib.next.x.toFixed(2)}, ${ib.next.y.toFixed(2)}]`],
    ])
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-xl'>Calculation of Bearing of Normal to 3 Points</div>
    <div class='ml-4 mt-2 mb-2'>
        <GenericTable {data}/>
    </div>
    
    <svg width={width} height={height}>
        <rect  width="400" height="400" fill="gray"></rect>
        <!-- Perimeter line and points -->
        <line x1={a.x} y1={north(a.y)} x2={b.x} y2={north(b.y)} stroke={perim}/>
        <line x1={b.x} y1={north(b.y)} x2={c.x} y2={north(c.y)} stroke={perim}/>
        
        <circle cx={a.x} cy={north(a.y)} r="4" fill={perim}/>
        <text x='{a.x}' y='{north(a.y)}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            A [{a.x}, {a.y}] </text>
        
        <circle cx={b.x} cy={north(b.y)} r="4" fill={perim}/>
        <text x='{b.x}' y='{north(b.y)}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            B [{b.x}e, {b.y}] </text>
        
        <circle cx={c.x} cy={north(c.y)} r="4" fill={perim}/>
        <text x='{c.x}' y='{north(c.y)}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            C [{c.x}, {c.y}] </text>

        <!-- Base line AC -->
        <line x1={a.x} y1={north(a.y)} x2={c.x} y2={north(c.y)} stroke={base}/>
        <text x='{i.x}' y='{north(i.y)}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            I [{i.x}, {north(i.y)}] </text>
        <!-- Normal line BI -->
        <line x1={b.x} y1={north(b.y)} x2={i.x} y2={north(i.y)} stroke={normal}/>
        
        <!-- Growth vector -->
        <line x1={b.x} y1={north(b.y)} x2={next.x} y2={north(next.y)} stroke={growth}/>
        <text x='{next.x}' y='{north(next.y)}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            NEXT [{next.x.toFixed(2)}e, {next.y.toFixed(2)}n] </text>
    </svg>
</div>