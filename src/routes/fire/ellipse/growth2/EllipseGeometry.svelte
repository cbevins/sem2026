<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {EllipseGeometryMod} from './EllipseGeometryMod.js'
    import {EllipseGeometryViewport} from './EllipseGeometryViewport.js'
    import FireEllipseControls from './FireEllipseControls.svelte'

    let width = $state(400)
    let height = $state(400)

    // Input parameter controls
    let lwRatio = $state(2)
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(1)
    let headRos = $state(1)
    let timeStep = $state(10)

    // Create module generator fuction that is reactive to input controls
    function modGenerator(lwRatio, bearing, headRos, elapsed, degStep, timeStep) {
        const mod = new EllipseGeometryMod('e')
        mod.select()
        mod.bearing.set(bearing)
        mod.lwr.set(lwRatio)
        mod.ros.set(headRos)
        mod.time.set(elapsed)
        mod.updateAll()
        return mod
    }
    // Create a module dependent upon all the inputs
    let mod = $derived(modGenerator(lwRatio, bearing, headRos, elapsed, degStep, timeStep))
    let allNodes = $derived(mod.sortNodes(mod.nodes()))

    //--------------------------------------------------------------------------
    // Viewport instance, content, and event handler
    //--------------------------------------------------------------------------
    
    // To be reactive to input controls, mMust pass in all their values
    let vp = $derived(new EllipseGeometryViewport(width, height, mod))
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
    <Expand title={'EllipseGeometryMod Nodes'}>
        <DagNodeTable nodes={allNodes} title={''}/>
    </Expand>
</div>
