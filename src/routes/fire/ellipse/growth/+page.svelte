<script>
    import {ClassName, FileName} from '$lib/index.js'
    import NormalBearing from './NormalBearing.svelte'
    import EllipseGrowth from './EllipseGrowth.svelte'

    let width = $state(400)
    let height = $state(400)
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Fire Perimeter Growth Demo</div>

    <NormalBearing {width} {height}/>
    <!-- <EllipseGrowth {width} {height}/> -->
</div>