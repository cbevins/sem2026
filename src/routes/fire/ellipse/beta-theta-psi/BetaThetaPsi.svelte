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
        ellipse.f.dist.value, ellipse.h.dist.value, degStep))

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
        ellipse.ignition.x.value, ellipse.ignition.y.value, ellipse.ignition.east.value, ellipse.ignition.north.value,
        ellipse.center.x.value, ellipse.center.y.value, ellipse.center.east.value, ellipse.center.north.value,
        showBeta, showTheta, showPsi))
    let content = $derived(viewport.drawSvg())

    function handler(e) {
        if (viewport.handleEvent(e)) content = viewport.drawSvg()
    }

    function bearingChanged() {
        viewport.bearing = bearing
        content = viewport.drawSvg()
    }

    function degStepChanged() {
        content = viewport.drawSvg()
    }

    function elapsedChanged() {
        viewport.time = elapsed
        content = viewport.drawSvg()
    }

    function lwrChanged() {
        viewport.lwRatio = lwRatio
        content = viewport.drawSvg()
    }

    function rosChanged() {
        viewport.headRos = headRos
        content = viewport.drawSvg()
    }
</script>

<P>The SVG below uses FireEllipseMod to determine the ellipse perimeter points
    plotted at uniform intervals of {degStep} degrees of beta (red), theta (yellow),
    or psi (blue) from '{src}'.
</P>

<table class='ml-4 mt-4 border rounded'>
    <tbody class='text-xs'>
        <tr>
            <td class='px-1'>Length/Width</td>
            <td class='py-0.5'>
                <input id='lwRatio'bind:value={lwRatio} onchange={lwrChanged} type="number" min="1" max="10"
                    class='h-6 rounded w-full' />
            </td>
            <td class='px-1'>Head Spread Rate</td>
            <td class='py-0.5'>
                <input id='headRos' bind:value={headRos} onchange={rosChanged} type="number" min="0.1" max="100"
                    class='h-6 rounded w-full' />
            </td>
        </tr>
        <tr>
            <td class='px-1'>Bearing</td>
            <td class='p-0.5'>
                <input id='bearing' bind:value={bearing} onchange={bearingChanged} type="number" min="-360" max="360" step="5"
                class='h-6 rounded w-full' />
            </td>
            <td class='px-1'>Degree Increment</td>
            <td class='py-0.5'>
                <input id='degStep' bind:value={degStep} type="number" min="1" max="90" step="5"
                class='h-6 rounded w-full' />
            </td>
        </tr>
        <tr>
            <td class='px-1'>Elapsed Time</td>
            <td class='py-0.5'>
                <input id='elapsed'bind:value={elapsed} onchange={elapsedChanged} type="number" min="1" max={60*24*7}
                class='h-6 rounded w-full' />
            </td>
            <td class='px-1'></td>
            <td class=''></td>
        </tr>
        <tr>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-beta" type="checkbox" bind:checked={showBeta}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-red-500 focus:ring-2 focus:ring-brand-soft" >
                    <label for="checkbox-beta" class="px-1 text-xs select-none">
                        Show Beta
                    </label>
                </div>
            </td>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-theta" type="checkbox" bind:checked={showTheta}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-yellow-300 focus:ring-2 focus:ring-brand-soft">
                    <label for="checkbox-theta" class="px-1 text-xs select-none">
                        Show Theta
                    </label>
                </div>
            </td>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-psi" type="checkbox" bind:checked={showPsi}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-blue-600 focus:ring-2 focus:ring-brand-soft">
                    <label for="checkbox-psi" class="px-1 text-xs select-none">
                        Show Psi
                    </label>
                </div>
            </td>
        </tr>
    </tbody>
</table>

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
