<script>
    import { CirclesSvgScope } from './CirclesSvgScope.js'
    import { TerrainSvgScope } from './TerrainSvgScope.js'
    import SvgScope from './SvgScope.svelte'

    const circles = new CirclesSvgScope()     // should be passed in as a prop!
    const terrain = new TerrainSvgScope()     // should be passed in as a prop!
</script>
<SvgScope scope={circles} table={true}/>
<SvgScope scope={terrain} table={true}/>