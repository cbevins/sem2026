<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {ZipViewport} from './ZipViewport.js'
    import FireEllipseControls from './FireEllipseControls.svelte'
    import {ellipse, ellipseTable, pointsTable} from './ellipse.js'

    let width = $state(400)
    let height = $state(400)

    // Input parameter controls
    let lwRatio = $state(2)
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(1)
    let headRos = $state(1)
    let beta    = $state(17.58795377399377) // beta when theta=60 at lwr=2
    let psi     = $state(73.89788624801398) // psi when theta=60 at lwr=2
    let theta   = $state(80)        
    let timeStep = $state(10)

    let zip = $derived(ellipse(lwRatio))
    let zipEllipses = $derived(ellipseTable(lwRatio))  // Parameters at various lwr
    let zipPoints = $derived(pointsTable(lwRatio))    // Perimeters for above
    
    //--------------------------------------------------------------------------
    // Viewport instance, content, and event handler
    //--------------------------------------------------------------------------
    
    // To be reactive to input controls, must pass in all their values
    let vp = $derived(new ZipViewport(width, height, zip))
    let content = $derived(vp.drawSvg())
    function handler(e) { if (vp.handleEvent(e)) content = vp.drawSvg() }

    function onchange(input) {
        lwRatio = input.lwRatio
        bearing = input.bearing
        degStep = input.degStep
        elapsed = input.elapsed
        headRos = input.headRos
        content = vp.drawSvg()
    }
</script>

<div class='ml-4 mt-4 mb-4'>
    <FireEllipseControls {bearing} {degStep} {elapsed} {headRos} {lwRatio} {onchange} />

    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>
</div>

<div class='ml-4 mt-4 mb-4'>
    <Expand title={'Zip Ellipses'}>
        <GenericTable data={zipEllipses} title={'Zip'}/>
    </Expand>
</div>

<div class='ml-4 mt-4 mb-4'>
    <Expand title={'Zip Points'}>
        <GenericTable data={zipPoints} title={'Zip'}/>
    </Expand>
</div>
