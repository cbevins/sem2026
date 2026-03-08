<script>
    import {P} from '$lib/index.js'
    import {PcsDemo01Model} from './PcsDemo01Model.js'
    import {PcsDemo01Pcs} from './PcsDemo01Pcs.js'
    import {PcsDemo01View} from './PcsDemo01View.js'

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
    
    //--------------------------------------------------------------------------
    // Model & View - uses controller state to change Model and any of its Views
    //--------------------------------------------------------------------------
    let pcs = $derived(new PcsDemo01Pcs(svgWidth, svgHeight, unitsPerPixel))
    let model = new PcsDemo01Model(100, 100)
    let view = $derived(new PcsDemo01View(pcs, model))
    let content = $derived(view.content())
</script>

{#snippet viewData(v)}
    <div class='mx-2 mt-2 text-sm border rounded'>
        <div class='ml-4'>
            - SVG is {v.svg.width} x {v.svg.height}.
            Map is {v.bounds.width} x {v.bounds.height}.
            Focus point = [{v.focus.east} e, {v.focus.north} n].
        </div>
        <div class='ml-4'>- viewBox = '{v.viewbox()}'</div>
    </div>
{/snippet}

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        Projected Coordinate System Mapper Demo
    </div>
    <div class='overflow-scroll border rounded'>
        <P>
            Example of creating interactive, pannable, zoomable SVG images
            from geographic projected coordinates (eastings, northings, bearings)
            using the Model-View-Controller design pattern.
        </P>
    </div>

    <div class='mt-4 border rounded'>
            {@render viewData(view)}
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
                <div class='text-xs'>(The above aren't that useful without pan controls)</div>
            </div>
        </div>
        </div>
        <div class="w-lg h-128 overflow-auto border border-gray-400">
            <svg width={view.svg.width} height={view.svg.height} viewBox='{view.viewbox()}'>
                {@html content}
            </svg>
        </div>
    </div>
</div>
