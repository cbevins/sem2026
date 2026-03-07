<script>
    import {P} from '$lib/index.js'
    import {ViewDemo1} from './ViewDemo1.js'

    //--------------------------------------------------------------------------
    // Controller
    //--------------------------------------------------------------------------

    //--------------------------------------------------------------------------
    // View (which also handles the Model based upon the Controller props).
    //--------------------------------------------------------------------------
    function makeView(d) {
        return new ViewDemo1(d.width, d.height, d.west, d.east, d.south, d.north,
            d.upp, d.units, d.focusEast, d.focusNorth)
    }

    let demo1 = {width:400, height:400, west:0, east:1000, south:2000, north:3000,
                upp:1, units:'ft', focusEast:null, focusNorth:null}
    let view1 = makeView(demo1)
    let content1 = view1.content()
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

    <div class='mt-4 border rounded'>
        <div class='mx-2 my-2 border rounded'>
            <P>Controller Goes Here</P>
            <div class='ml-4'>- SVG is 400 x 400, and bounds are 1000 x 1000.</div>
            <div class='ml-4'>- PCSViewport auto-focus is 500, 500</div>
            <div class='ml-4'>- viewBox is '-300, -300, 1000, 1000', calculated as:</div>
            <div class='ml-8'>vb x = (400 - 1000)/2 = -300</div>
            <div class='ml-8'>vb y = (svgHeight-1000)/2 = (400 - 1000)/2 = -300</div>
        </div>
        <div class="w-64 h-64 overflow-auto border border-gray-400">
            <svg width=1000 height=1000 viewBox='-300 -300 1000 1000'>
            <!-- <svg width={width} height={height}> -->
                {@html content1}
            </svg>
        </div>
    </div>
</div>
