<script>
    import { FbfmFuelGroups as Group } from "./FbfmFuelStyles.js"
    import { getNiceTicks } from "./getNiceTicks.js"

    let {data, selectedFbfm, xvar='ros', yvar='flame'} = $props()

    // NOTE: at midflame wind 20, 80-deg slope, 100% cured herb, and min fuel moisture, max values are:
    // ros = 11,362 ft/min, flame = 225 ft, and fli = 734,868 Btu/ft/s
    let settings = $state({
        x: {tics: 5, fixedMin: false, minVal: 0, fixedMax: false, maxVal: 11000}, // good min-max for 'ros'
        y: {tics: 5, fixedMin: false, minVal: 0, fixedMax: false, maxVal: 250}, // good min-max for 'flame'
    })

    let bounds = $derived(updateBounds(data))
$inspect(bounds)
    let axis = $derived(updateAxis(bounds, settings))
    let svg = $derived(updateSvg(axis))
    let tics = $derived(updateTics(axis, svg))
    // 'sprites' is an array of selected fuel model plot markers {label, x, y, fill, group}
    let sprites = $derived(updateSprites(data, svg, xvar, yvar))
    let containerHeight = "h-[650px]" 
$inspect(axis)       
    function updateAxis(bounds, settings) {
        const xmin = (settings.x.fixedMin) ? settings.x.minVal : bounds.xmin
        const xmax = (settings.x.fixedMax) ? settings.x.maxVal : bounds.xmax
        const ymin = (settings.y.fixedMin) ? settings.y.minVal : bounds.ymin
        const ymax = (settings.y.fixedMax) ? settings.y.maxVal : bounds.ymax
        // nice() returns {min, max, step, tics}
        let x = getNiceTicks(xmin, xmax, settings.x.tics)
        let y = getNiceTicks(ymin, ymax, settings.y.tics)
        return {x, y}
    }

    function updateBounds(data) {
        let xmin = 99999999999
        let ymin = 99999999999
        let xmax = 0
        let ymax = 0
        for(let fuel of data) {
            if (selectedFbfm[fuel.fuelKey]) {
                xmin = Math.min(xmin, fuel[xvar])
                xmax = Math.max(xmax, fuel[xvar])
                ymin = Math.min(ymin, fuel[yvar])
                ymax = Math.max(ymax, fuel[yvar])
            }
        }
        return {xmin, xmax, ymin, ymax}
    }

    function updateSprites(data, svg, xvar, yvar) {
        const s = []
        for(let fuel of data) {
            if (selectedFbfm[fuel.fuelKey]) {
                const fill = Group[fuel.groupKey].spriteFill
                const x = svg.padl + fuel[xvar] * svg.xScalar
                const y = svg.padt + (svg.plotHt - fuel[yvar] * svg.yScalar)
                s.push({label: fuel.fuelKey.toUpperCase(), x, y, fill, group: fuel.groupKey})
            }
        }
        return s
    }
    
    // SVG dimensions, borders, plot size, axis
    function updateSvg(axis) {
        let s = {width: 1250, height: 650, padt: 25, padb: 25, padr: 25, padl: 25}
        s.plotWd = s.width - s.padl - s.padr
        s.plotHt = s.height - s.padt - s.padb
        s.plotTop = s.padt
        s.plotBot = s.height - s.padb
        s.plotLeft = s.padl
        s.plotRight = s.width - s.padr
        s.xScalar = s.plotWd / axis.x.max
        s.yScalar = s.plotHt / axis.y.max
        return s
    }
    
    function updateTics(axis, svg) {
        let t = {x: [], y: []}
        for(let xval of axis.x.tics)
            t.x.push(svg.plotLeft + xval * svg.xScalar)
        for(let yval of axis.y.tics)
            t.y.push(svg.plotBot - yval * svg.yScalar)
        return t
    }
</script>

<!-- 1. The Scrollable Window Wrapper
    - 'overflow-auto' Added to the outer container to automatically introduce scrollbars
    only when the child SVG's footprint physically exceeds the boundary limits of the parent div.
    - Explicit Dimensions (width/height): Do not use w-full or h-full on the SVG tag.
    If you do, the SVG scales down to fit into the parent box, ruining the scroll setup.
    Give it an absolute pixel dimension (e.g., width="1200px") so it overflows the bounding box.
    - 'viewBox' maintains original asset viewBox aspect ratios (e.g., 0 0 1200 1200) to ensure
    elements map correctly to coordinate spaces regardless of pixel dimensions
    applied on the root element.
-->
<div class="w-full {containerHeight} overflow-auto border border-gray-200 rounded-lg shadow-inner bg-slate-50">

    <svg width={svg.width} height={svg.height}>
        <!-- Background -->
        <rect x=0 y=0 width=100% height=100% stroke='black' stroke-width=5 fill='gray'/>
        
        <!-- Plot border -->
        <rect x='{svg.padl}' y='{svg.padt}' width='{svg.plotWd}' height='{svg.plotHt}'
            fill='none' stroke='black'/>
        
        <!-- X -axis horizontal gridlines -->
        {#each tics.x as x}
            <line x1={x} y1={svg.plotTop} x2={x} y2={svg.plotBot} stroke='black'/>
        {/each}
        <!-- Y-axis horizontal gridlines -->
        {#each tics.y as y}
            <line x1={svg.plotLeft} y1={y} x2={svg.plotRight} y2={y} stroke='black'/>
        {/each}

        <!-- Sprites -->
        {#each sprites as sprite}
            <circle cx='{sprite.x}' cy='{sprite.y}' r=10 fill='{sprite.fill}'/>
            <text x='{sprite.x}' y='{sprite.y}'
                text-anchor='middle' alignment-baseline='middle'
                stroke='black' font-size=8 font-family='sans-serif'
                font-weight='light'>{sprite.label}</text>
        {/each}
    </svg>
</div>