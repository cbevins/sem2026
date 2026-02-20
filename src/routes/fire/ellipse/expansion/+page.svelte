<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {FirePerimeterGenerator} from './FirePerimeterGenerator.js'
    import {EllipseExpansionViewport} from './EllipseExpansionViewport.js'
    import FireEllipseControls from '../growth/FireEllipseControls.svelte'

    let width = $state(400)
    let height = $state(400)
    // Input parameter controls
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(100)
    let headRos = $state(1)
    let ignEast = $state(0)
    let ignNorth = $state(0)
    let lwRatio = $state(2)
    let timeStep = $state(10)

    // Get an initial fire perimeter to expand
    let generator = $derived(new FirePerimeterGenerator(
        lwRatio, headRos, bearing, elapsed, degStep, ignEast, ignNorth))
    let points = $derived(generator.points)
    let e = $derived(generator.ellipse)

    // Create a Viewport to display the perimeter
    let viewport = $derived(new EllipseExpansionViewport(width, height,
        headRos, elapsed, timeStep, points,
        e.ignition.x.get(), e.ignition.y.get(), e.ignition.east.get(), e.ignition.north.get(),
        e.center.x.get(), e.center.y.get(), e.center.east.get(), e.center.north.get()))
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
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Fire Perimeter Expansion Explorer</div>

    <FireEllipseControls {bearing} {degStep} {elapsed} {headRos} {lwRatio} {onchange} />

    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>
    
    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Expansion Points at {degStep}-deg Theta Intervals'>
            <div class='ml-4 text-normal'>Note that x is easting, y is northing</div>
            <GenericTable data={points}/>
        </Expand>
    </div>

</div>