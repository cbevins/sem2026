<script>
    import { getPointOnEllipse } from "./getPointOnEllipseCodePen.js";

    let ellRx = $state(100)
    let ellRy = $state(25)
    let ellCx = $state(0)
    let ellCy = $state(0)
    let ellBearing = $state(0)  // Ellipse rotation degrees clockwise from north
    let ellRotation = $derived((450-ellBearing)%360)    // Ellipse rotation degrees counter clockwise from x axis
    
    let svgMargin = $state(20)
    let svgSize = $state(400)
    let svgWidth = $derived(2 * svgMargin + svgSize)
    let svgHeight = $derived(2 * svgMargin + svgSize)
    let svgCx = $derived(svgMargin + svgSize/2)
    let svgCy = $derived(svgMargin + svgSize/2)
    let svgTransform = $derived(`rotate(${ellRotation}, ${svgCx}, ${svgCy})`)
    let scale = $derived(ellLength / svgSize)
    // let angleBearing = $state(45)
    // let angleCartesian = $derived((270-angleBearing)%360)
    // let angleSvg = $derived(-angleCartesian)
    // let parametric = $state(true)
    // let center = $derived(getPointOnEllipse(cx, cy, rx, rx, angleCartesian, 0, parametric))
    // let head = $derived(getPointOnEllipse(cx, cy, rx, ry, 0, rotationCartesian, true))
    // let back = $derived(getPointOnEllipse(cx, cy, rx, ry, 180, rotationCartesian, true))
    // let p = $derived(getPointOnEllipse(cx, cy, rx, ry, angleCartesian, rotationCartesian, true))
    // let g = $derived(getPointOnEllipse(cx, cy, rx, ry, angleCartesian, rotationCartesian, false))
    function svgX(easting) {
        return scale * easting
    }
</script>

{#snippet angles(label, bearing, cartesian)}
    <div class='text-sm grid grid-cols-4 gap-4'>
        <div class="w-32">{label}</div>
        <div>Bearing {bearing}</div>
        <div>Rotation {cartesian}</div>
    </div>
{/snippet}

{#snippet coords(label, pt)}
    <div class='text-sm grid grid-cols-4 gap-4'>
        <div class="w-32">{label}</div>
        <div>[{pt.x.toFixed(2)}, {pt.y.toFixed(2)}]</div>
    </div>
{/snippet}

<div class="mt-4 ml-4 mb-4 border px-4 py-4">

    {@render angles('Ellipse Angle', ellBearing, ellRotation)}
    <!-- {@render angles('Parametric Angle', angleBearing, angleCartesian)} -->
    {@render coords('Ellipse Center', {x: ellCx, y:ellCy})}
    <!-- {@render coords('Head pt', head)} -->
    <!-- {@render coords('Back pt', back)} -->
    <!-- {@render coords('Parametric pt', p)} -->
    <!-- {@render coords('Geometric pt', g)} -->
    <svg id="svg" width={svgWidth} height={svgHeight}>
        <!-- Draw these using SVG coordinates -->
        <!-- Subtending circle -->
        <!-- <circle cx={cx} cy={cy} r={rx} fill="none" stroke="#ccc" /> -->
        <!-- Rotated ellipse -->
        <!-- <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill="none" stroke="#ccc" transform={transform} /> -->
        <!-- Ellipse center -->
        <!-- <circle cx={cx} cy={cy} r=2 fill="green" stroke="black" /> -->

        <!-- Draw these using PCS coordinates -->
        <!-- Ellipse head -->
        <!-- <circle cx={head.x} cy={head.y} r=2 fill="red" stroke="black" /> -->
        <!-- Ellipse back -->
        <!-- <circle cx={back.x} cy={back.y} r=2 fill="yellow" stroke="black" /> -->
        
        <!-- Subtending circle perimeter point -->
        <!-- <circle cx={center.x} cy={center.y} r=2 fill="green" stroke="black" /> -->
        <!-- <line x1={cx} y1={cy} x2={center.x} y2={center.y} stroke='green' /> -->

        <!-- Parametric angle perimeter point -->
        <!-- <circle cx={p.x} cy={p.y} r=2 fill="green" stroke="black" /> -->
        <!-- <line x1={cx} y1={cy} x2={p.x} y2={p.y} stroke='green' /> -->
        
        <!-- Geometric angle perimeter point -->
        <!-- <circle cx={g.x} cy={g.y} r=2 fill="cyan" stroke="black" /> -->
        <!-- <line x1={cx} y1={cy} x2={g.x} y2={g.y} stroke='cyan' /> -->
        <!-- <line x1={center.x} y1={center.y} x2={g.x} y2={g.y} stroke='cyan' /> -->
    </svg>
</div>
