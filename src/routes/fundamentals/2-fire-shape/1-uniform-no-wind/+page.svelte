<script>
    import {EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {P} from '$lib/index.js'
    import {View} from './View.js'

    //--------------------------------------------------------------------------
    // Controller
    //--------------------------------------------------------------------------

    let width = $state(400)
    let height = $state(400)
    let headRos = $state(0.5)
    let elapsed = $state(1)
    
    //--------------------------------------------------------------------------
    // View (which also handles the Model based upon the Controller props).
    //--------------------------------------------------------------------------
    let view = $derived(new View(width, height, headRos, elapsed))
    let content = $derived(view.drawSvg())
    function handler(e) { if (view.handleEvent(e)) content = view.drawSvg() }
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        1 - Fire Shape under Uniform Fuel Conditions with No-Wind, No-Slope
    </div>

    <div class='overflow-scroll border rounded'>
        <P>
            Lets start out as simply as possible.
            First, let us assume a perfectly level field
            containing a uniform distribution of similarly shaped fuel particles,
            all at the same moisture content.
            Tall annual grasses are a good real-world approximation of such fuel.
            Second, we will assume absolutely no wind.
        </P>
    </div>

    <div class='mt-4 border rounded'>
        <div class='mx-2 my-2 border rounded'>
            Controller Goes Here
        </div>
        <div class='mx-2 my-2'>
            <EventfulSvg {width} {height} {content} {handler}/>
        </div>
    </div>
</div>
