<script>
    import {GlowButton as Button} from '$lib/index.js'
    import {BearingDemo01Pcs} from './BearingDemo01Pcs.js'
    import {BearingDemo01View} from './BearingDemo01View.js'

    //--------------------------------------------------------------------------
    // Controller state and handlers
    //--------------------------------------------------------------------------
    
    let svgWidth = $state(500)
    let svgHeight = $state(500)
    let svgLevel = $state(0)
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

    //--------------------------------------------------------------------------
    // Model & View - uses controller state to change Model and any of its Views
    //--------------------------------------------------------------------------
    let pcs = $derived(new BearingDemo01Pcs(svgWidth, svgHeight, unitsPerPixel))
    let view = $derived(new BearingDemo01View(pcs))
    let content = $derived(view.content())
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        PCSMapper Easting, Northing, Bearing Demo
    </div>

    <div class='mx-2 my-2 py-1 border rounded'>
            <div class='ml-2 mt-1'>
                <Button label="Zoom In (2*SVG)" handler={doubleSvg}/>
                <Button label='Zoom Out (2*SVG/2)' handler={halveSvg}/>
                <span>Current Zoom Level {svgLevel}</span>
            </div>
        </div>
    <div class="w-lg h-128 overflow-auto border border-gray-400">
        <svg width={view.svg.width} height={view.svg.height} viewBox='{view.viewbox()}'>
            {@html content}
        </svg>
    </div>
</div>
