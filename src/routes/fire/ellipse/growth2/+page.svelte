<script>
    import {ClassName, FileName} from '$lib/index.js'
    import EllipseGeometry from './EllipseGeometry.svelte'
    import Zip from './Zip.svelte'

    let width = $state(400)
    let height = $state(400)
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Fire Ellipse Geometry - 2/23/26</div>

    <!-- <NormalBearing {width} {height}/> -->
    <!-- <EllipseGeometry {width} {height}/> -->
    <Zip {width} {height}/>
</div>