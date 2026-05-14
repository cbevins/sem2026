<script>
    import FireCanvas from './FireCanvas.svelte'
    import { MapperFireletSpread } from './index.js'
    // import { MapperRotatingFireletPerimeter } from './index.js'
    let width = $state(512)
    let height = $state(512)
    // const mapper = $derived(new MapperRotatingFireletPerimeter(width, height))
    const mapper = $derived(new MapperFireletSpread(width, height, 50, 2, 45))
</script>

<FireCanvas {mapper} {width} {height}/>