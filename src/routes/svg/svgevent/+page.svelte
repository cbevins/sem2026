<script>
    import SvgEvent from "./SvgEvent.svelte"
    import {SvgEventDemo} from './SvgEventDemo.js'
    import {SvgEventButtonDemo} from './SvgEventButtonDemo.js'

    // Create a class that draws the image and maintains its state
    let demo = new SvgEventDemo(400, 400)
    let btn = new SvgEventButtonDemo(40, 40)
</script>

<div class='text-2xl'>Basic SvgEvent Demo</div>

<div class='ml-4 mt-4'>
    <SvgEvent creator={btn} keyable={true} mousable={true}/>
</div>


<div class='ml-4 mt-4'>
    <SvgEvent creator={demo} keyable={true} mousable={true}/>
</div>
