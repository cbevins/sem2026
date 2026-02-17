<script>
    import EventfulSvg from './EventfulSvg.svelte'
    import {DemoViewport} from './DemoViewport.js'

    let width = 400
    let height = 400
    let viewport = $state(new DemoViewport(width, height))
    let content = $state(viewport.drawSvg())
    let redraw = true
    function handler(e) {
        redraw = viewport.handleEvent(e)
        if (redraw) {
            content = viewport.drawSvg()
        }
    }
</script>

<div class='ml-4 text-2xl'>EventfulSVg Basic Demo</div>
<div class='ml-4 mt-4'>
    <EventfulSvg {width} {height} {content} {handler}/>
</div>
