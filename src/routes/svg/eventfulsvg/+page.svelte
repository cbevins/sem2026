<script>
    import {EventfulSvg} from '$lib/index.js'
    import {DemoViewport} from './DemoViewport.js'

    let width = 400
    let height = 400
    let viewport = $state(new DemoViewport(width, height))
    let content = $state(viewport.drawSvg())

    // Controls
    let bearing = $state(0)
    let elapsed = $state(1)
    let headRos = $state(1)
    let lwRatio = $state(1)

    function handler(e) {
        if (viewport.handleEvent(e)) content = viewport.drawSvg()
    }

    function bearingChanged() {
        viewport.bearing = bearing
        content = viewport.drawSvg()
    }

    function elapsedChanged() {
        viewport.time = elapsed
        // content = viewport.drawSvg()
    }

    function rosChanged() {
        viewport.headRos = headRos
        // content = viewport.drawSvg()
    }

    function lwrChanged() {
        viewport.lwRatio = lwRatio
        content = viewport.drawSvg()
    }
</script>

<div class='ml-4 text-2xl'>EventfulSvg Basic Demo</div>

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
