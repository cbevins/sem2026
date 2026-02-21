<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {FirePerimeterGenerator} from './FirePerimeterGenerator.js'
    import {EllipseExpansionViewport} from './EllipseExpansionViewport.js'
    import FireEllipseControls from '../growth/FireEllipseControls.svelte'
	import {makeFireRing, FireRing} from './FireRing.js'
    import {bearingBetweenPoints, bearingEndpoint, midPoint} from './Geometry.js'

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
    let timeStep = $state(20)
    
    function expandFireRing(fireRing) {
        let node = fireRing.head
        const newRing = new FireRing()
        let idx = 0
        do {
            const mid = midPoint(node.prev, node.next)
            node.bearing = bearingBetweenPoints(mid, node)
            e.beta.bearing.set(node.bearing)
            e.updateAll()
            const dist = e.beta.vhr.get() * headRos * timeStep
            const ep = bearingEndpoint(node, node.bearing, dist)
            newRing.append(idx++, ep.x, ep.y, node)
            node = node.next
        } while(node !== fireRing.head)
        return newRing
    }

    // Works best!!
    function getBetaTable(fireRing) {
        let node = fireRing.head
        const data = []
        let idx = 0
        do {
            const mid = midPoint(node.prev, node.next)
            node.bearing = bearingBetweenPoints(mid, node)
            e.beta.bearing.set(node.bearing)
            e.updateAll()
            const d = {idx: node.idx, x: node.x, y: node.y,
                midx: mid.x, midy: mid.y,
                bearing: node.bearing,
                betaAngle: e.beta.angle.get(),
                betaVhr: e.beta.vhr.get(),
                betaRos: e.beta.vhr.get(),
                betaDist: e.beta.vhr.get() * headRos * timeStep
            }
            const ep = bearingEndpoint(node, node.bearing, d.betaDist)
            d.endx = ep.x
            d.endy = ep.y
            data.push(d)
            node = node.next
        } while(node !== fireRing.head.prev)
        return data
    }

    // 1a - get an initial fire perimeter closed polygon of {x, y} points
    let generator = $derived(new FirePerimeterGenerator(
        lwRatio, headRos, bearing, elapsed, degStep, ignEast, ignNorth))
    let points = $derived(generator.points)
    let e = $derived(generator.ellipse)

    // 1b - convert the polygon array into a FireRing linked list
    let fireRing1 = $derived(makeFireRing(points))
    let ringTable1 = $derived(fireRing1.table())
    
    let betaData = $derived(getBetaTable(fireRing1))    // works best
    let fireRing2 = $derived(expandFireRing(fireRing1, elapsed+timeStep, betaData))
    let ringTable2 = $derived(fireRing2.table())

    // 2 - Create a Viewport to display the FireRings
    let viewport = $derived(new EllipseExpansionViewport(width, height,
        headRos, elapsed, timeStep, fireRing1, fireRing2,
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
        <Expand title='FireRing 1 at {degStep}-deg Theta Intervals'>
            <div class='ml-4 text-normal'>Note that x is easting, y is northing</div>
            <GenericTable data={ringTable1}/>
        </Expand>
    </div>
    
    <div class='ml-4 mt-2 mb-2'>
        <Expand title='FireRing 2 at {degStep}-deg Theta Intervals'>
            <div class='ml-4 text-normal'>Note that x is easting, y is northing</div>
            <GenericTable data={ringTable2}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Pt, Bearing and Beta at Theta intervals Table 2 (betaData)'>
            <div class='ml-4 text-normal'>This looks correct</div>
            <GenericTable data={betaData}/>
        </Expand>
    </div>
</div>