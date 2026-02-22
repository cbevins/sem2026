<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {ClassName, FileName, P} from '$lib/index.js'
	import { CoordinatesViewport } from './CoordinatesViewport.js'

    let width = $state(400)
    let height = $state(400)

    // Create a Viewport to display the perimeter
    let viewport = $derived(new CoordinatesViewport(width, height))
    let content = $derived(viewport.drawSvg())

    function handler(e) { if (viewport.handleEvent(e)) content = viewport.drawSvg() }

</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Fire Front Coordinate Systems</div>
        <P>Explores point and angle conversions between (1) projected geographic coordinate systems
            (used to display fire perimeters on the landscape) and
            (2) local mathematical Cartesian system as used to make fire perimeter calculations.
        </P>
</div>
<div class='ml-4 mt-4 mb-4'>

    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>

</div>