<script>
    import {ClassName, EventfulSvg} from '$lib/index.js'
    import {DemoButton} from './DemoButton.js'
    let width = 40
    let height = 40
    let viewport = $state(new DemoButton(width, height))
    let content = $state(viewport.drawSvg())

    function handler(e) {
        if (viewport.handleEvent(e)) content = viewport.drawSvg()
    }
</script>

<div class='ml-4 text-2xl'>EventfulSvg Button Demo</div>

<div class='ml-4 mt-6 text-normal'>
    Below is an SVG button made from an <ClassName>EventfulSvg.svelte</ClassName>
    component that changes its display attributes in response
    to mouse enter/leave and click:
</div>

<div class='ml-4 mt-4'>
    <EventfulSvg {width} {height} {content} {handler}/>
</div>
