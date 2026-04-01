<script>
    import { onMount } from "svelte"
    import * as d3 from 'd3'
	import { geojsonRectPoint } from "./geojsonRectPoint.js"
    import { world } from '$lib/assets/world.js'

    let {width=512, height=512} = $props()

    // Bind this variable to the canvas element
    let canvasElement
    let ctx, imageData

    onMount(() => {
        // Get the canvas context
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        worldMap()
    })

    function worldMap() {
        // Define an optional projection (e.g., d3.geoMercator)
        const projection = d3.geoMercator(); 

        // Create the path generator and link it to the canvas context
        const pathGenerator = d3.geoPath()
            .projection(projection)
            .context(ctx);

        ctx.beginPath()
        pathGenerator({type: 'FeatureCollection', features: world.features})
        ctx.stroke()
    }

    function rectPoint() {
        const pathGenerator = d3.geoPath()
            .context(ctx);
        ctx.beginPath()
        pathGenerator({type: 'FeatureCollection', features: geojsonRectPoint.features})
        ctx.stroke()
    }

</script>
<div class='mt-4 ml-4 px-4 border'>
    <div class='text-2xl'>D3 GeoJSON to Canvas</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} width={width} height={height}>
    </canvas>
</div>