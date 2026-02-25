<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {EllipseGeometryMod} from './EllipseGeometryMod.js'
    import {EllipseGeometryViewport} from './EllipseGeometryViewport.js'
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
    // let data = $derived(dataBuilder(lwRatio, bearing, headRos, elapsed, degStep, timeStep,
    //     beta, psi, theta))

    let zip = $derived(ellipse(lwRatio))
    let zipEllipses = $derived(ellipseTable(lwRatio))  // Parameters at various lwr
    let zipPoints = $derived(pointsTable(lwRatio))    // Perimeters for above
    console.log('Zip', zip)
    // Uses a single module to build all the required data and draw SVG
    // const mod2 = new EllipseGeometryMod('e')
    // mod2.select()
    // function dataBuilder(lwRatio, bearing, headRos, elapsed, degStep, timeStep,
    //         beta, psi, theta) {
    //     mod2.bearing.set(bearing)
    //     mod2.lwr.set(lwRatio)
    //     mod2.ros.set(headRos)
    //     mod2.theta.angle.set(theta)
    //     mod2.time.set(elapsed)
    //     mod2.psi.angle.set(psi)
    //     mod2.beta.angle.set(beta)
    //     mod2.updateAll()
    //     const points = {
    //         back: {x: e.back.x.get(), y: e.back.y.get()},
    //         beta: {x: e.beta.x.get(), y: e.beta.y.get()},
    //         center: {x: e.center.x.get(), y: e.center.y.get()},
    //         f: {x: e.center.x.get()+e.f.dist.get(), y: 0},
    //         g: {x: e.ignition.x.get()+e.g.dist.get(), y: 0},
    //         head: {x: e.head.x.get(), y: e.head.y.get()},
    //         ign: {x: e.ignition.x.get(), y: e.ignition.y.get()},
    //         psi: {x: e.psi.x.get(), y: e.psi.y.get()},
    //         theta: {x: e.theta.x.get(), y: e.theta.y.get()}
    //     }
    // }
    // Create module generator fuction that is reactive to input controls
    function modGenerator(lwRatio, bearing, headRos, elapsed, degStep, timeStep,
            beta, psi, theta) {
        const mod = new EllipseGeometryMod('e')
        mod.select()
        mod.bearing.set(bearing)
        mod.lwr.set(lwRatio)
        mod.ros.set(headRos)
        mod.theta.angle.set(theta)
        mod.time.set(elapsed)
        mod.psi.angle.set(psi)
        mod.beta.angle.set(beta)
        mod.updateAll()
        return mod
    }
    // Create a module dependent upon all the inputs
    let mod = $derived(modGenerator(lwRatio, bearing, headRos, elapsed, degStep, timeStep,
        beta, psi, theta))
    let allNodes = $derived(mod.sortNodes(mod.nodes()))

    //--------------------------------------------------------------------------
    // Viewport instance, content, and event handler
    //--------------------------------------------------------------------------
    
    // To be reactive to input controls, must pass in all their values
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
