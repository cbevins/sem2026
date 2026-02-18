<script>
    import {findNormalIntersection, lineSlope, lineSlopeToAngle, lineSlopeToBearing} from './Geometry.js'

    let {width, height} = $props()
    function x(east) { return east }
    function y(north) { return height - north }

    // let a, b, and c be 3 adjacent perimeter points
    let a = $state({e: 100, n: 300})
    let b = $state({e: 300, n: 300})
    let c = $state({e: 300, n: 100})
    for(let p of [a,b,c]) {
        p.x = x(p.e)
        p.y = y(p.n)
    }
    // derive normal of 'ac' through 'b'
    let i = $derived(findNormalIntersection(b.e, b.n, a.e, a.n, c.e, c.n))
    // svelte-ignore state_referenced_locally
    i.e = i.x
    // svelte-ignore state_referenced_locally
    i.n = height - i.y
    let slope = $derived(lineSlope(i.e, i.n, b.e, b.n))
    let angle = $derived(lineSlopeToAngle(slope))
    let bearing = $derived(lineSlopeToBearing(slope))

    // Display props
    const perim = 'red'
    const base = 'green'
    const normal = 'blue'
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-xl'>Calculation of Bearing of Normal to 3 Points</div>
    
    <div class='ml-4 text-normal'>Point of Interest is [{b.e}e, {b.n}n]</div>
    <div class='ml-4 text-normal'>Intersection is [{i.e}e, {i.nn}]</div>
    <div class='ml-4 text-normal'>IB Rise is {b.n-i.n}, Reach is {b.e-i.e}</div>
    <div class='ml-4 text-normal'>Slope of normal is {angle}</div>
    <div class='ml-4 text-normal'>Angle of normal from horizon is {angle.toFixed(2)}</div>
    <div class='ml-4 text-normal'>Bearing of normal is {bearing.toFixed(2)}</div>
    
    <svg width={width} height={height}>
        <rect  width="400" height="400" fill="gray"></rect>
        <!-- Perimeter line and points -->
        <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={perim}/>
        <line x1={b.x} y1={b.y} x2={c.x} y2={c.y} stroke={perim}/>
        <circle cx={a.x} cy={a.y} r="4" fill={perim}/>
        <text x='{a.x}' y='{a.y}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            A [{a.e}e, {a.n}n] </text>
        <circle cx={b.x} cy={b.y} r="4" fill={perim}/>
        <text x='{b.x}' y='{b.y}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            B [{b.e}e, {b.n}n] </text>
        <circle cx={c.x} cy={c.y} r="4" fill={perim}/>
        <text x='{c.x}' y='{c.y}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            C [{c.e}e, {c.n}n] </text>
        <!-- Base line AC -->
        <line x1={a.x} y1={a.y} x2={c.x} y2={c.y} stroke={base}/>
        <text x='{i.x}' y='{i.y}' stroke='black' font-size='8' font-family='sans-serif' font-weight='light'>
            I [{i.e}e, {i.n}n] </text>
        <!-- Normal line BI -->
        <line x1={b.x} y1={b.y} x2={i.x} y2={i.y} stroke={normal}/>
    </svg>
</div>