<script>
    import { FbfmFuelGroups as Group } from "./FbfmFuelStyles.js"
    import { getNiceTicks } from "./getNiceTicks.js"
    import { svgText } from './SvgSnippets.svelte'
    let {
        data,
        selectedFbfm,
        xvar='ros',
        yvar='flame',
        input={},
    } = $props()

    const varLabel = {
        ros: {name: 'Fire Spread Rate', units: 'ft/min'},
        flame: {name: 'Flame Length', units: 'ft'},
        fli: {name: 'Fireline Intensity', units: 'Btu/ft/s'},
    }
    // Base text style
    const chartText={
        fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        stroke: 'black', fontSize: 16,
        dominantBaseline: 'central',
        textRendering: "geometricPrecision",
        strokeWidth: 0.25,
        letterSpacing: 1,
        fontWeight: 'lighter',
        textAnchor: 'middle',
    }
    const inputProp = [
        {key: 'midflameWindSpeed', name: 'Midflame Wind Speed', units: 'ft/min', dec: 0},
        {key: 'slopeRatio', name: 'Slope Steepness', units: 'degrees', dec: 0},
        {key: 'moistureDead1h', name: 'Dead 1-h Fuel Moisture', units: 'ratio', dec: 2},
        {key: 'moistureDead10h', name: 'Dead 1-h Fuel Moisture', units: 'ratio', dec: 2},
        {key: 'moistureDead100h', name: 'Dead 1-h Fuel Moisture', units: 'ratio', dec: 2},
        {key: 'moistureLiveHerb', name: 'Live Herb Fuel Moisture', units: 'ratio', dec: 2},
        {key: 'moistureLiveStem', name: 'Live Stem Fuel Moisture', units: 'ratio', dec: 2},
        {key: 'curedHerb', name: 'Cured Herb Fraction', units: 'ratio', dec: 2},
        // {key: 'windBearing', name: 'Wind Bearing', units: 'deg'},
        // {key: 'slopeAspect', name: 'Apsect', units: ''},
        // The following wind speed options are not yet implemented
        // windSpeedAt: 'midflame',    // 'midflame', '20ft', or'10m'
        // canopyHt: 0,
        // canopyBase: 0,
        // canopyFill: 0,
    ]
    // NOTE: at midflame wind 20, 80-deg slope, 100% cured herb, and min fuel moisture, max values are:
    // ros = 11,362 ft/min, flame = 225 ft, and fli = 734,868 Btu/ft/s
    let settings = $state({
        x: {tics: 5, fixedMin: false, minVal: 0, fixedMax: false, maxVal: 11000}, // good min-max for 'ros'
        y: {tics: 5, fixedMin: false, minVal: 0, fixedMax: false, maxVal: 250}, // good min-max for 'flame'
    })

    let bounds = $derived(updateBounds(data))
    let axis = $derived(updateAxis(bounds, settings))
    let svg = $derived(updateSvg(axis))
    let tics = $derived(updateTics(axis, svg))
    let sprites = $derived(updateSprites(data, svg, xvar, yvar))
    let containerHeight = "h-[650px]" 

    function updateAxis(bounds, settings) {
        const xmin = (settings.x.fixedMin) ? settings.x.minVal : bounds.xmin
        const xmax = (settings.x.fixedMax) ? settings.x.maxVal : bounds.xmax
        const ymin = (settings.y.fixedMin) ? settings.y.minVal : bounds.ymin
        const ymax = (settings.y.fixedMax) ? settings.y.maxVal : bounds.ymax
        // getNiceTicks() returns {min, max, step, tics}
        let x = getNiceTicks(xmin, xmax, settings.x.tics)
        let y = getNiceTicks(ymin, ymax, settings.y.tics)
        return {x, y}
    }

    function updateBounds(data) {
        let xmin = 99999999999, ymin = 99999999999, xmax = 0, ymax = 0
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
        let s = {width: 1250, height: 650, padt: 100, padb: 50, padr: 50, padl: 50}
        s.plotWd = s.width - s.padl - s.padr
        s.plotHt = s.height - s.padt - s.padb
        s.plotTop = s.padt
        s.plotBot = s.height - s.padb
        s.plotLeft = s.padl
        s.plotRight = s.width - s.padr
        s.plotMidX = s.plotLeft + (s.plotRight - s.plotLeft) / 2
        s.plotMidY = s.plotTop + (s.plotBot - s.plotTop) / 2
        s.xScalar = s.plotWd / axis.x.max
        s.yScalar = s.plotHt / axis.y.max
        return s
    }
    
    // function xpos(xval) { return svg.plotLeft + xval * svg.xScalar }
    // function ypos(yval) { return svg.plotBot - yval * svg.yScalar }

    function updateTics(axis, svg) {
        let t = {x: [], y: []}
        for(let xval of axis.x.tics)
            t.x.push(svg.plotLeft + xval * svg.xScalar)
        for(let yval of axis.y.tics)
            t.y.push(svg.plotBot - yval * svg.yScalar)
        return t
    }
</script>

<!--  -->
{#snippet textRotate(x, y, str, deg, size=12, stroke='black')}
    <text x={x} y={y} 
        text-anchor='middle' dominant-baseline='central'
        stroke={stroke} font-size={size} font-family='inter'
        transform="rotate({deg}, {x}, {y})"
        font-weight='light'>{str}</text>
{/snippet}

{#snippet text(x, y, str, anchor="middle", size=12, stroke='black')}
    <text x={x} y={y} text-anchor={anchor} alignment-baseline='middle'
        stroke={stroke} font-size={size} 
        font-family="'Helvetica Neue', Helvetica, Arial, sans-serif"
        text-rendering="geometricPrecision"
        stroke-width="0.25"
        letter-spacing="1"
        font-weight='100'>
        {str}
    </text>
{/snippet}

{#snippet sprite(s)}
    <circle cx={s.x} cy={s.y} r=10 fill={s.fill}/>
    <text x={s.x} y={s.y}
        text-anchor='middle' alignment-baseline='middle'
        stroke='black' font-size=8 font-family='sans-serif'
        font-weight='light'>{s.label}</text>
{/snippet}

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

        <!-- Titles -->
        {@render svgText({...chartText, str:'Chart of Fire Behavior Fuel Models',
            x: svg.plotMidX, y: 25, fontSize: 20})}
        {@render svgText({...chartText, str: 'by',
            x: svg.plotMidX, y: 42, fontSize: 16})}
        {@render svgText({...chartText, str: varLabel[xvar].name +' and ' +varLabel[yvar].name,
            x: svg.plotMidX, y: 60, fontSize: 18})}

        <!-- Input Legend  -->
        {@render text(svg.plotLeft+100, svg.plotTop+15, 'Fire Behavior Conditions', 'middle', 10)}
        {#each inputProp as prop, i}
            {@render text(svg.plotLeft+10, svg.plotTop+(i+3)*10, prop.name, 'start', 10)}
            {@render text(svg.plotLeft+180, svg.plotTop+(i+3)*10, input[prop.key].toFixed(prop.dec), 'end', 10)}
            {@render text(svg.plotLeft+183, svg.plotTop+(i+3)*10, prop.units, 'start', 10)}
        {/each}

        <!-- X -axis horizontal gridlines -->
        {#each tics.x as x, i}
            <line x1={x} y1={svg.plotTop} x2={x} y2={svg.plotBot} stroke='black'/>
            {@render svgText({...chartText, x: x, y: svg.plotTop-10, str: axis.x.tics[i], fontSize: 12})}
            {@render svgText({...chartText, x: x, y: svg.plotBot+10, str: axis.x.tics[i], fontSize: 12})}
        {/each}
        {@render text(svg.plotMidX, svg.plotBot+25, varLabel[xvar].name, 'middle', 16)}
        {@render text(svg.plotMidX, svg.plotBot+40, '('+varLabel[xvar].units+')', 'middle', 12)}

        <!-- Y-axis horizontal gridlines -->
        {#each tics.y as y, i}
            <line x1={svg.plotLeft} y1={y} x2={svg.plotRight} y2={y} stroke='black'/>
            {@render svgText({...chartText, x: svg.plotLeft-2, y: y, str: axis.y.tics[i],
                fontSize: 12, textAnchor: 'end'})}
            {@render svgText({...chartText, x: svg.plotRight+2, y: y, str: axis.y.tics[i],
                fontSize: 12, textAnchor: 'start'})}
        {/each}
        <!-- {@render text(svg.plotLeft-35, svg.plotMidY, varLabel[yvar].name)} -->
        {@render textRotate(svg.plotLeft-35, svg.plotMidY, varLabel[yvar].name, 270, 16)}
        {@render textRotate(svg.plotLeft-15, svg.plotMidY, '('+varLabel[yvar].units+')', 270, 12)}

        <!-- Sprites -->
        {#each sprites as s}
            {@render sprite(s)}
        {/each}
    </svg>
</div>