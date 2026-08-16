<script>
    let {results, activeFuels, yvar='flame'} = $props()

    // SVG dimensions, borders
    let svg = {width: 850, height: 650, padt: 25, padb: 25, padr: 25, padl: 25}
    svg.dataWid = svg.width - svg.padl - svg.padr
    svg.dataHt = svg.height - svg.padt - svg.padb
    svg.rosFactor = svg.dataWid / 800
    svg.fliFactor = svg.dataHt / 60000
    svg.flameFactor = svg.dataHt / 60
    
    const modelGroup = {
        '1': '13', '2': '13','3': '13','4': '13','5': '13','6': '13','7': '13','8': '13','9': '13','10': '13','11': '13','12': '13','13': '13',
        'gr1': 'gr', 'gr2': 'gr', 'gr3': 'gr', 'gr4': 'gr', 'gr5': 'gr', 'gr6': 'gr', 'gr7': 'gr', 'gr8': 'gr', 'gr9': 'gr',
        'gs1': 'gs', 'gs2': 'gs', 'gs3': 'gs', 'gs4': 'gs',
        'sh1': 'sh', 'sh2': 'sh', 'sh3': 'sh', 'sh4': 'sh', 'sh5': 'sh', 'sh6': 'sh', 'sh7': 'sh', 'sh8': 'sh', 'sh9': 'sh',
        'tu1': 'tu', 'tu2': 'tu', 'tu3': 'tu', 'tu4': 'tu', 'tu5': 'tu',
        'tl1': 'tl', 'tl2': 'tl', 'tl3': 'tl',  'tl4': 'tl', 'tl5': 'tl', 'tl6': 'tl', 'tl7': 'tl', 'tl8': 'tl', 'tl9': 'tl',
        'sb1': 'sb', 'sb2': 'sb', 'sb3': 'sb', 'sb4': 'sb'}
    const groupColor = {
        '13': 'Orange',
        'gr': 'DarkKhaki',
        'gs': 'SpringGreen',
        'sh': 'DarkGreen',
        'tu': 'ForestGreen',
        'tl': 'DarkGoldenrod',
        'sb': 'Brown'
    }
    let sprites = $derived(updateSprites(results))

    function updateSprites(results) {
        const data = []
        for(let result of results) {
            if (activeFuels[result.fuelKey]) {
                const x = svg.padl + result.ros * svg.rosFactor
                const y = (yvar==='flame')
                    ? svg.padt + (svg.dataHt - result.flame * svg.flameFactor)
                    : svg.padt + (svg.dataHt - result.fli * svg.fliFactor)
                const group = modelGroup[result.fuelKey]
                const fill = groupColor[group] 
                data.push({label: result.fuelKey, x, y, fill, group})
            }
        }
        return data
    }
</script>

<svg width={svg.width} height={svg.height}>
    <rect x=0 y=0 width=100% height=100% stroke='black' stroke-width=5 fill='gray'/>
    <rect x='{svg.padl}' y='{svg.padt}' width='{svg.dataWid}' height='{svg.dataHt}'
        fill='none' stroke='black'/>
    {#each sprites as sprite}
        <circle cx='{sprite.x}' cy='{sprite.y}' r=8 fill='{sprite.fill}'/>
        <text x='{sprite.x}' y='{sprite.y}'
            text-anchor='middle' alignment-baseline='middle'
            stroke='black' font-size=8 font-family='sans-serif'
            font-weight='light'>{sprite.label}</text>

    {/each}
</svg>
