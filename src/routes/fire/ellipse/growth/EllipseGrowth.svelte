<script>
    import {FirePerimeterGenerator} from './FirePerimeterGenerator.js'
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {EllipseGrowthViewport} from './EllipseGrowthViewport.js'
    import FireEllipseControls from './FireEllipseControls.svelte'
    import { addBearings } from './Geometry.js'

    let {width, height} = $props()
    // Input parameter controls
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(100)
    let headRos = $state(1)
    let lwRatio = $state(2)
    let timeStep = $state(10)

    function x(east) { return east }
    function y(north) { return height - north }

    // Generate an initial perimeter
    let generator = $derived(new FirePerimeterGenerator(
        lwRatio, headRos, bearing, elapsed))
    let points = $derived(
        addBearings(generator.thetaPerimeterPoints(degStep), 'east', 'north'))
    let ellipse = $derived(generator.ellipse)
    
    let generator2 = $derived(new FirePerimeterGenerator(
        lwRatio, headRos, bearing, elapsed+timeStep))
    let points2 = $derived(
        addBearings(generator2.thetaPerimeterPoints(degStep), 'east', 'north'))
    let ellipse2 = $derived(generator2.ellipse)

    // Create a Viewport to display the perimeter
    let viewport = $derived(new EllipseGrowthViewport(400, 400,
        headRos, elapsed, timeStep,
        points,  points2,// perimeter pt arrays
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

    // table of expansion points
    let t2 = []
    // svelte-ignore state_referenced_locally
        for(let i=0; i<points.length; i++) {
        const p = points[i]
        t2.push({deg:p.deg,
            x: p.x.toFixed(2), y:p.y.toFixed(2),
            east:p.east.toFixed(2), north:p.north.toFixed(2),
            mx:p.mx, my:p.my, angle:p.angle, bearing:p.bearing, deg2:p.deg})
    }
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-xl'>Fire Perimeter Generator</div>

    <FireEllipseControls {bearing} {degStep} {elapsed} {headRos} {lwRatio} {onchange} />

    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Expansion Points at {degStep}-deg Theta Intervals'>
            <GenericTable data={t2}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Points at {degStep}-deg Theta Intervals'>
            <GenericTable data={points}/>
        </Expand>
    </div>
</div>
