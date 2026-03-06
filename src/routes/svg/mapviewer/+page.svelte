<script>
import EventfulSvg from './EventfulSvg.svelte'
    import {P} from '$lib/index.js'
    import {ViewDemo1} from './ViewDemo1.js'

    //--------------------------------------------------------------------------
    // Controller
    //--------------------------------------------------------------------------

    let width = $state(400)
    let height = $state(400)
    
    //--------------------------------------------------------------------------
    // View (which also handles the Model based upon the Controller props).
    //--------------------------------------------------------------------------
    let viewDemo1 = $derived(new ViewDemo1(width, height))
    let content = $derived(viewDemo1.content())
    function handler(e) { /* nothing */ }
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
        </P><P>
            Within the +page.svelte, an EventfulSvg component captures mouse and keyboard
            events and passes them onto the handler() function. The handler()
            merely passes the event along to the View.content() method,
            which returns new SVG content.
        </P>
    </div>

    <div class='mt-4 border rounded'>
        <div class='mx-2 my-2 border rounded'>
            Controller Goes Here
        </div>
        <div class='mx-2 my-2'>
        <!-- The EventfulSvg captures mouse and keyboard events and passes
        them along to the handler() function. -->
            <EventfulSvg {width} {height} {content} {handler}/>
        </div>
    </div>
</div>
