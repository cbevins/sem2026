<script>
    let {results, yflame=true} = $props()
    console.log('CHART')

    // SVG dimensions, borders
    let svg = {width: 850, height: 850, padt: 25, padb: 25, padr: 25, padl: 25}
    svg.dataWid = svg.width - svg.padl - svg.padr
    svg.dataHt = svg.height - svg.padt - svg.padb
    svg.rosFactor = svg.dataWid / 600
    svg.fliFactor = svg.dataHt / 80000
    svg.flameFactor = svg.dataHt / 75
    
    let sprites = $derived(updateSprites(results))

    function updateSprites(results) {
        const data = []
        for(let result of results) {
            const x = svg.padl + result.rosFpm * svg.rosFactor
            const y = (yflame) ? svg.padt + (svg.dataHt - result.flame * svg.flameFactor)
                : svg.padt + (svg.dataHt - result.fli * svg.fliFactor)
            data.push({label: result.fuelKey, x, y})
        }
        return data
    }
</script>

<svg width={svg.width} height={svg.height}>
    <rect x=0 y=0 width=100% height=100% stroke='black' stroke-width=5 fill='gray'/>
    <rect x='{svg.padl}' y='{svg.padt}' width='{svg.dataWid}' height='{svg.dataHt}'
        fill='none' stroke='black'/>
    {#each sprites as sprite}
        <circle cx='{sprite.x}' cy='{sprite.y}' r=5 fill='red'/>
        <text x='{sprite.x}' y='{sprite.y}'
            text-anchor='middle' alignment-baseline='middle'
            stroke='black' font-size=8 font-family='sans-serif'
            font-weight='light'>{sprite.label}</text>

    {/each}
</svg>
