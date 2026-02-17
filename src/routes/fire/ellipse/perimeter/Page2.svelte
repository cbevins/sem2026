<script>
    import {DagNodeTable, Expand, GenericTable, SvgEvent} from '$lib/index.js'
    import {EventfulSvg} from '$lib/index.js'
    import {PerimeterDemo2} from './PerimeterDemo2.js'
    import {PerimeterViewport2} from './PerimeterViewport2.js'

    let width = 400
    let height = 400

    // Controls
    let bearing = $state(0)
    let degStep = $state(5)
    let elapsed = $state(100)
    let headRos = $state(1)
    let lwRatio = $state(2)
    let src = $state('angle')

    let demo = $derived(new PerimeterDemo2(lwRatio, headRos, bearing, elapsed, src))
    let ellipse = $derived(demo.ellipse)

    let betaPts = $derived(demo.betaPerimeterPoints(degStep))
    let psiPts = $derived(demo.psiPerimeterPoints(degStep))
    let thetaPts = $derived(demo.thetaPerimeterPoints(degStep))

    let perimTable = $derived(demo.perimeterTable(
        ellipse.f.dist.value, ellipse.h.dist.value))
    let inputNodes = $derived(ellipse.sortNodes(ellipse.activeInputNodes()))
    let activeInputNodes = $derived(ellipse.sortNodes(ellipse.activeInputNodes()))
    let selectedNodes = $derived(ellipse.sortNodes(ellipse.selectedNodes()))
    let activeNodes = $derived(ellipse.sortNodes(ellipse.activeNodes()))
    let dagNodeTables = $derived([
        {nodes: selectedNodes, title: 'Selected Nodes'},
        {nodes: activeInputNodes, title: 'Active Input Nodes'},
        {nodes: activeNodes, title: 'All Active Nodes'},
    ])

    let viewport = $derived(new PerimeterViewport2(400, 400, ellipse.length.dist.get(),
        thetaPts, psiPts, betaPts,  // perimeter pt arrays
        ellipse.ignition.x.value, ellipse.ignition.y.value,   // ignition pt
        ellipse.center.x.value, ellipse.center.y.value,   // center pt
        true, true, true))   // show theta, psi, beta

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

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Eventful Fire Ellipse Perimeter Demo</div>

    <div class='text-normal'>
        Example using FireEllipseMod to determine the ellipse perimeter points
        plotted at uniform intervals of {degStep} degrees of beta (red), theta (yellow),
        or psi (blue) from '{src}'.  SvgScope is used to display the ellipse
        in either a Cartesian or geographic coordinate system.
    </div>

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
</div>
