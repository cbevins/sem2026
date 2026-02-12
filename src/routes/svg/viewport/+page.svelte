<script>
    import SvgEvent from "../svgevent/SvgEvent.svelte"
    import {ViewportDemo} from './ViewportDemo.js'
    // ViewportDemo is a class that draws the image and maintains its state
    let demo = new ViewportDemo(500, 500, 200, 200, [0.5, 1, 2], 1, 'ft')
    console.log(demo)
</script>

<div class='ml-4 text-2xl'>ViewPort Demo</div>

<div class='ml-4 mt-6 text-normal'>
    Below is an ViewPort image that responds to pan and zoom:
</div>
<div class='ml-4 mt-4'>
    <SvgEvent creator={demo} keyable={true} mousable={true}/>
</div>
