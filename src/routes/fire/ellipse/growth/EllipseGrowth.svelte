<script>
    import {findNormalIntersection, lineSlope, lineSlopeToAngle, lineSlopeToBearing} from './Geometry.js'
    import {FirePerimeterGenerator} from './FirePerimeterGenerator.js'
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {EllipseGrowthViewport} from './EllipseGrowthViewport.js'
    import FireEllipseControls from './FireEllipseControls.svelte'

    let {width, height} = $props()
    // Input parameter controls
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(100)
    let headRos = $state(1)
    let lwRatio = $state(2)

    function x(east) { return east }
    function y(north) { return height - north }

    // Generate an initial perimeter
    let generator = $derived(new FirePerimeterGenerator(lwRatio, headRos, bearing, elapsed))
    let points = $derived(generator.thetaPerimeterPoints(degStep))
    let normals = $derived(addNormals(points))
    let ellipse = $derived(generator.ellipse)

    // Create a Viewport to display the perimeter
    let viewport = $derived(new EllipseGrowthViewport(400, 400, ellipse.length.dist.get(),
        points,  // perimeter pt arrays
        ellipse.ignition.x.get(), ellipse.ignition.y.get(), ellipse.ignition.east.get(), ellipse.ignition.north.get(),
        ellipse.center.x.get(), ellipse.center.y.get(), ellipse.center.east.get(), ellipse.center.north.get()))
    let content = $derived(viewport.drawSvg())

    function handler(e) {
        if (viewport.handleEvent(e)) content = viewport.drawSvg()
    }

    function onchange(input) {
        bearing = input.bearing
        degStep = input.degStep
        elapsed = input.elapsed
        headRos = input.headRos
        lwRatio = input.lwRatio
        content = viewport.drawSvg()
    }

    // Determine normal to each point based on its neighbors' base line
    function addNormals(points) {
        const normals = []
        let a = points[points.length-2]  // point *before* 360
        let b, c, x
        for(let i=0; i<points.length-1; i++) {
            const p = points[i]
            const normal = {east: p.east, north: p.north, x: p.x, y: p.y}
            b = points[i]
            c = (i>points.length) ? points[0] : points[i+1]
            // derive normal of 'ac' through 'b'
            x = findNormalIntersection(b.east, b.north, a.east, a.north, c.east, c.north)
            normal.slope = lineSlope(x.x, x.y, b.east, b.north)
            normal.angle = lineSlopeToAngle(normal.slope)
            normal.bearing = lineSlopeToBearing(normal.slope)
            normals.push(normal)
            a = b
        }
        return normals
    }
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-xl'>Fire Perimeter Generator</div>

    <FireEllipseControls {bearing} {degStep} {elapsed} {headRos} {lwRatio} {onchange} />

    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Normals to Perimeter Points at {degStep}-deg Theta Intervals'>
            <GenericTable data={normals}/>
        </Expand>
    </div>
    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Points at {degStep}-deg Theta Intervals'>
            <GenericTable data={points}/>
        </Expand>
    </div>
</div>
