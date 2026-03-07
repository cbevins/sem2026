<script>
    import {P} from '$lib/index.js'
    import {PcsViewDemo1} from './PcsViewDemo1.js'
    import {PcsModelDemo1} from './PcsModelDemo1.js'

    //--------------------------------------------------------------------------
    // Controller state and handlers
    //--------------------------------------------------------------------------
    
    let svgWidth = $state(1600)
    let svgHeight = $state(800)
    let svgLevel = $state(0)
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

    // Constructs a good SVG viewBox based on current svg and bounds dimensions
    function viewbox(v) {
        const x = (v.svg.width - v.bounds.width) / 2
        const y = (v.svg.height - v.bounds.height) / 2
        const w = v.bounds.width
        const h = v.bounds.height
        return `${x} ${y} ${w} ${h}`
    }
    
    //--------------------------------------------------------------------------
    // View (which also handles the Model based upon the Controller props).
    //--------------------------------------------------------------------------
    let model1 = $derived(new PcsModelDemo1(svgWidth, svgHeight, unitsPerPixel))
    let view1 = $derived(new PcsViewDemo1(model1))
    let content1 = $derived(view1.content())
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

    {#snippet viewData(v)}
        <div class='mx-2 mt-2 text-sm border rounded'>
        <div class='ml-4'>- SVG is {v.svg.width} x {v.svg.height}.
            Map is {v.bounds.width} x {v.bounds.height}.
            Focus point = [{v.focus.east} e, {v.focus.north} n].</div>
        <div class='ml-4'>- viewBox = '{viewbox(v)}'</div>
        </div>
    {/snippet}

    <div class='mt-4 border rounded'>
            {@render viewData(view1)}
        <div class='mx-2 my-2 border rounded'>
            <div class='ml-2 mt-1'>
                Zoom Level {svgLevel}
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={doubleSvg}>Zoom In (double SVG size)</button>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={halveSvg}>Zoom Out (halve SVG size)</button>
            <div class='ml-2 mt-1'>
                Units per pixel: {unitsPerPixel}
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={halveUpp}>Halve Upp</button>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={doubleUpp}>Double Upp</button>
                <div class='text-xs'>The above aren't that useful without pan controls)</div>
            </div>
        </div>
        </div>
        <div class="w-lg h-128 overflow-auto border border-gray-400">
            <svg width={view1.svg.width} height={view1.svg.height} viewBox='{viewbox(view1)}'>
                {@html content1}
            </svg>
        </div>
    </div>
</div>
