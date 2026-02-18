<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable, P} from '$lib/index.js'
    import {BetaThetaPsiDemo} from './BetaThetaPsiDemo.js'
    import {BetaThetaPsiViewport} from './BetaThetaPsiViewport.js'
    import FireEllipseControls from './FireEllipseControls.svelte'

    // Viewport SVG dimenisions
    let width = 400
    let height = 400

    // Input parameter controls
    let bearing     = $state(0)
    let degStep     = $state(5)
    let elapsed     = $state(100)
    let headRos     = $state(1)
    let lwRatio     = $state(2)
    let src         = $state('angle') // 'angle' or 'head'
    let showBeta    = $state(true)
    let showPsi     = $state(true)
    let showTheta   = $state(true)

    // Create the beta-theta-psi demo
    let demo = $derived(new BetaThetaPsiDemo(
        lwRatio, headRos, bearing, elapsed, src))
    // Get a reference to its FireEllipseMod
    let ellipse = $derived(demo.ellipse)

    let betaPts = $derived(demo.betaPerimeterPoints(degStep))
    let psiPts = $derived(demo.psiPerimeterPoints(degStep))
    let thetaPts = $derived(demo.thetaPerimeterPoints(degStep))

    // Table of perimeter estimates by various methods
    let perimTable = $derived(demo.perimeterTable(
        ellipse.f.dist.get(), ellipse.h.dist.get(), degStep))

    // DagNode tables
    let inputNodes       = $derived(ellipse.sortNodes(ellipse.activeInputNodes()))
    let activeInputNodes = $derived(ellipse.sortNodes(ellipse.activeInputNodes()))
    let selectedNodes    = $derived(ellipse.sortNodes(ellipse.selectedNodes()))
    let activeNodes      = $derived(ellipse.sortNodes(ellipse.activeNodes()))
    let allNodes         = $derived(ellipse.sortNodes(ellipse.nodes()))
    let dagNodeTables    = $derived([
        {nodes: selectedNodes, title: 'Selected Nodes'},
        {nodes: activeInputNodes, title: 'Active Input Nodes'},
        {nodes: activeNodes, title: 'All Active Nodes'},
        {nodes: allNodes, title: 'All FireEllipseMod Nodes'},
    ])

    // Create a Viewport to display the perimeter using beta and/or theta and/or psi
    let viewport = $derived(new BetaThetaPsiViewport(400, 400, ellipse.length.dist.get(),
        thetaPts, psiPts, betaPts,  // perimeter pt arrays
        ellipse.ignition.x.get(), ellipse.ignition.y.get(), ellipse.ignition.east.get(), ellipse.ignition.north.get(),
        ellipse.center.x.get(), ellipse.center.y.get(), ellipse.center.east.get(), ellipse.center.north.get(),
        showBeta, showTheta, showPsi))
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
        showBeta = input.showBeta
        showPsi = input.showPsi
        showTheta = input.showTheta
        content = viewport.drawSvg()
    }
</script>

<P>The SVG below uses FireEllipseMod to determine the ellipse perimeter points
    plotted at uniform intervals of {degStep} degrees of beta (red), theta (yellow),
    or psi (blue) from '{src}'.
</P>

<FireEllipseControls {bearing} {degStep} {elapsed} {headRos} {lwRatio}
    {showBeta} {showPsi} {showTheta} {onchange} />

<div class='ml-4 mt-4'>
    <EventfulSvg {width} {height} {content} {handler}/>
</div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Estimates'>
            <GenericTable data={perimTable} headers={['Method', 'Perim']}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Points at {degStep}-deg Beta Intervals'>
            <GenericTable data={betaPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Points at {degStep}-deg Psi Intervals'>
            <GenericTable data={psiPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Points at {degStep}-deg Theta Intervals'>
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
