<script>
    import {P} from '$lib/index.js'
    import {ViewDemo1} from './ViewDemo1.js'

    //--------------------------------------------------------------------------
    // Controller state and handlers
    //--------------------------------------------------------------------------
    let svgWidth = $state(1600)
    let svgHeight = $state(800)
    let svgLevel = $state(1)
    let uppLevel = $state(1)
    let unitsPerPixel = $state(1)

    function doubleSvg() {
        svgLevel = svgLevel + 1
        svgWidth = 2 * svgWidth
        svgHeight = 2 * svgHeight
    }
    function halveSvg() {
        svgLevel = svgLevel - 1
        svgWidth = svgWidth / 2
        svgHeight = svgHeight / 2
    }
    function halveUpp() {
        uppLevel = uppLevel + 1
        unitsPerPixel = unitsPerPixel / 2
    }
    function doubleUpp() {
        uppLevel = uppLevel - 1
        unitsPerPixel = 2 * unitsPerPixel
    }
    //--------------------------------------------------------------------------
    // View (which also handles the Model based upon the Controller props).
    //--------------------------------------------------------------------------
    function makeView(d) {
        return new ViewDemo1(d.width, d.height, d.west, d.east, d.south, d.north,
            d.upp, d.units, d.focusEast, d.focusNorth)
    }

    function viewbox(v) {
        const x = (v1.svg.width - v1.bounds.width) / 2
        const y = (v1.svg.height - v1.bounds.height) / 2
        const w = v.bounds.width
        const h = v.bounds.height
        return `${x} ${y} ${w} ${h}`
    }
    let d1 = $derived({
        width: svgWidth, height: svgHeight,
        // width: 400, height: 200,  // zoom x 0.25
        // width: 800, height: 400,  // zoom x 0.5
        // width: 1600, height: 800,  // zoom x 1
        // width: 3200, height: 1600,  // zoom x 2
        west: 0, east: 1600, south:2000, north:2800,
        upp: unitsPerPixel, units: 'ft', focusEast: null, focusNorth: null})

    let v1 = $derived(makeView(d1))
    // console.log('v1', v1)
    // console.log('viewbox(v1)', viewbox(v1))
    let content1 = $derived(v1.content())
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        SVG Map Viewer
    </div>
    <div class='overflow-scroll border rounded'>
        <P>
            Example of creating interactive, pannable, zoomable SVG images
            from geographic projected coordinates (eastings, northings, bearings)
            using the Model-View-Controller design pattern.
        </P>
    </div>

    {#snippet data(v)}
        <div class='text-sm'>
        <div class='ml-4'>- SVG is {v.svg.width} x {v.svg.height}.
        Map is {v.bounds.width} x {v.bounds.height}.
        Focus point = [{v.focus.east} e, {v.focus.north} n].</div>
        <div class='ml-4'>- viewBox = '{viewbox(v)}'</div>
        </div>
    {/snippet}

    <div class='mt-4 border rounded'>
        <div class='mx-2 my-2 border rounded'>
            <div>
                <button class='border rounded text-md bg-blue-300'
                    onclick={doubleSvg}>Double SVG</button>
                <button class='border rounded text-md bg-blue-300'
                    onclick={halveSvg}>Halve SVG</button>
            <div>
            These aren't that useful
                <button class='border rounded text-md bg-blue-300'
                    onclick={halveUpp}>Halve Upp</button>
                <button class='border rounded text-md bg-blue-300'
                    onclick={doubleUpp}>Double Upp</button>
                </div>
        </div>
            {@render data(v1)}
        </div>
        <div class="w-lg h-128 overflow-auto border border-gray-400">
            <svg width={v1.svg.width} height={v1.svg.height} viewBox='{viewbox(v1)}'>
                {@html content1}
            </svg>
        </div>
    </div>
</div>
