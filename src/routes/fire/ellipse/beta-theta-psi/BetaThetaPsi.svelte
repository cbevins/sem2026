<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable, P} from '$lib/index.js'
    import {BetaThetaPsiDemo} from './BetaThetaPsiDemo.js'
    import {BetaThetaPsiViewport} from './BetaThetaPsiViewport.js'

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
        ellipse.f.dist.value, ellipse.h.dist.value))
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
        ellipse.ignition.x.value, ellipse.ignition.y.value,   // ignition pt
        ellipse.center.x.value, ellipse.center.y.value,   // center pt
        showBeta, showTheta, showPsi))

    let content = $derived(viewport.drawSvg())

    function handler(e) {
        if (viewport.handleEvent(e)) content = viewport.drawSvg()
    }

    function bearingChanged() {
        viewport.bearing = bearing
        content = viewport.drawSvg()
    }

    function elapsedChanged() {
        viewport.time = elapsed
        content = viewport.drawSvg()
    }

    function rosChanged() {
        viewport.headRos = headRos
        content = viewport.drawSvg()
    }

    function lwrChanged() {
        viewport.lwRatio = lwRatio
        content = viewport.drawSvg()
    }
</script>

<P>The SVG below uses FireEllipseMod to determine the ellipse perimeter points
    plotted at uniform intervals of {degStep} degrees of beta (red), theta (yellow),
    or psi (blue) from '{src}'.
</P>

<div class='ml-4 mt-4 px-2 py-2 w-48 border rounded'>
    <label for="lwRatio" class="w-16 h-8 text-sm font-medium text-gray-700">Length/Width</label>
    <input  id="lwRatio" class="mt-1 w-16 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        bind:value={lwRatio} onchange={lwrChanged} type="number" min="1" max="10" />

    <label for="headRos" class="w-16 h-8 text-sm font-medium text-gray-700">Head Ros</label>
    <input id="headRos" class="mt-1 w-16 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        bind:value={headRos} onchange={rosChanged} type="number" min="0.1" max="100" />

    <label for="bearing" class="w-16 h-8 text-sm font-medium text-gray-700">Bearing</label>
    <input id="bearing" class="mt-1 w-16 h-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        bind:value={bearing} onchange={bearingChanged} type="number" min="-360" max="360" step="5"/>
</div>

<div class='ml-4 mt-4'>
    <EventfulSvg {width} {height} {content} {handler}/>
</div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter Estimates'>
            <GenericTable data={perimTable} headers={['Method', 'Perim']}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {degStep}-deg Beta Intervals'>
            <GenericTable data={betaPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {degStep}-deg Psi Intervals'>
            <GenericTable data={psiPts}/>
        </Expand>
    </div>

    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Perimeter at {degStep}-deg Theta Intervals'>
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
