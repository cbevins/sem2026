<script>
    // It seems we can import Svelte components from an index.js ...
    import {DagNodeTable, Expand, GenericTable, SvgEvent} from '$lib/index.js'
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import * as FE from '$lib/fire/lib/FireEllipseLib'
    import { perimeterPoints } from './perimeterPoints.js'
    import {PerimeterViewport} from './PerimeterViewport.js'

    let {lwRatio=2, bearing=0, headRos=1, elapsed=100, deg=5} = $props()

    let passed = $derived([
        {name: 'lwRatio', value: lwRatio},
        {name: 'bearing', value: bearing},
        {name: 'headRos', value: headRos},
        {name: 'elapsed', value: elapsed},
        {name: 'deg', value: deg}
    ])

    let svgRef = null
    function callback(svgevent) { svgRef = svgevent }

    // Create a FireEllipseMod with beta-psi-theta vector angle from 'head' and ready()
    const src = 'angle'  // 'angle' or 'bearing'
    let e = $derived.by(() => {
        let e = new FireEllipseMod('e', src).ready()

        // Select required nodes
        for(let v of [e.beta, e.psi, e.theta]) {
            for(let node of [v.perim.x, v.perim.y, v.perim.east, v.perim.north,
                v.beta, v.psi, v.theta, v.vhr])
                node.select()
        }
        for(let node of [e.center.x, e.center.y, e.f.dist, e.h.dist, e.length.dist])
            node.select()
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        return e
    })

    let inputNodes = $derived(e.sortNodes(e.activeInputNodes()))
    let activeInputNodes = $derived(e.sortNodes(e.activeInputNodes()))
    let selectedNodes = $derived(e.sortNodes(e.selectedNodes()))
    let activeNodes = $derived(e.sortNodes(e.activeNodes()))
    let dagNodeTables = $derived([
        {nodes: selectedNodes, title: 'Selected Nodes'},
        {nodes: activeInputNodes, title: 'Active Input Nodes'},
        {nodes: activeNodes, title: 'All Active Nodes'},
    ])

    let betaPts = $derived.by(() => {
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        return perimeterPoints(e, e.beta, deg, src)
    })

    let psiPts = $derived.by(() => {
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        return perimeterPoints(e, e.psi, deg, src)
    })

    let thetaPts = $derived.by(() => {
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()
        return perimeterPoints(e, e.theta, deg, src)
    })

    let perimTable = $derived.by(() => {
        // Set required inputs
        e.head.bearing.set(bearing)
        e.head.ros.set(headRos)
        e.lwr.set(lwRatio)
        e.time.set(elapsed)
        e.updateAll()

        let last = betaPts.length-1
        return ([
            [`${deg}-deg beta intervals`, betaPts[last].arcleng],
            [`${deg}-deg theta intervals`, thetaPts[last].arcleng],
            [`${deg}-deg psi intervals`, psiPts[last].arcleng],
            ['10k numerical integration', FE.perimeterNumericalIntegration(e.f.dist.value, e.h.dist.value).toFixed(8)],
            ['Ramanujan method', FE.perimeterRamanujan(e.f.dist.value, e.h.dist.value).toFixed(8)],
            ['Simple Approximation', FE.perimeterSimpleApprox(e.f.dist.value, e.h.dist.value).toFixed(8)],
        ])
    })

    // NOTE that the Svg does not refresh until it is focused
    let demo = $derived.by(() => {
        let demo = new PerimeterViewport(400, 400, e.length.dist.get(),
            thetaPts, psiPts, betaPts,  // perimeter pt arrays
            e.ignition.x.value, e.ignition.y.value,   // ignition pt
            e.center.x.value, e.center.y.value,   // center pt
            true, true, true, lwRatio, deg)   // show theta, psi, beta
        if (svgRef) svgRef.focus()
        return demo
    })
	$effect(() => {
        // console.log('Simple.effect() called')
        if (svgRef) svgRef.focus()
    })
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-normal'>
        Example using FireEllipseMod to determine the ellipse perimeter points
        plotted at uniform intervals of {deg} degrees of beta (red), theta (yellow),
        or psi (blue) from '{src}'.  SvgScope is used to display the ellipse
        in either a Cartesian or geographic coordinate system.
    </div>

    <div class='ml-4 mt-4 mb-4'>
        <SvgEvent creator={demo} keyable={true} mousable={true} {callback}/>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Estimates'>
            <GenericTable data={perimTable} headers={['Method', 'Perim']}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {deg}-deg Beta Intervals'>
            <GenericTable data={betaPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {deg}-deg Psi Intervals'>
            <GenericTable data={psiPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {deg}-deg Theta Intervals'>
            <GenericTable data={thetaPts}/>
        </Expand>
    </div>

    {#each dagNodeTables as table}
        <div class='ml-4 mt-2'>
            <Expand title={table.title}>
                <DagNodeTable nodes={table.nodes} title={table.title}/>
            </Expand>
        </div>
    {/each}
</div>
