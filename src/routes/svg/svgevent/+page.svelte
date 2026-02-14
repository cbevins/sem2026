<script>
    import {SvgEvent} from "$lib/index.js"
    import {SvgEventHandlerDemo} from './SvgEventHandlerDemo.js'
    import {SvgEventButtonDemo} from './SvgEventButtonDemo.js'

    // Create a class that draws the image and maintains its state
    let demo = new SvgEventHandlerDemo(400, 400)
    let btn = new SvgEventButtonDemo(100, 100)
</script>

<div class='ml-4 text-2xl'>Basic SvgEvent Demo</div>

<div class='ml-4 mt-6 text-normal'>
    Below is an SVG button made from a SvgEvent.svelte component
    that changes its display attributes in response
    to mouse enter/leave and click:
</div>
<div class='ml-4 mt-4'>
    <SvgEvent creator={btn} keyable={true} mousable={true}/>
</div>

<div class='ml-4 mt-6 text-normal'>
    Below is an SvgEvent.svelte image that interactively displays the mouse
    and keyboard events that occur over it:
</div>
<div class='ml-4 mt-4'>
    <SvgEvent creator={demo} keyable={true} mousable={true}/>
</div>
