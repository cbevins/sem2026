<script>
    import { getNiceTicks } from "./getNiceTicks"
    let {data, yvar='flame'} = $props()

    // SVG dimensions, borders
    let svg = {width: 850, height: 650, padt: 25, padb: 25, padr: 25, padl: 25}
    svg.dataWid = svg.width - svg.padl - svg.padr
    svg.dataHt = svg.height - svg.padt - svg.padb
    svg.rosFactor = svg.dataWid / 800
    svg.fliFactor = svg.dataHt / 60000
    svg.flameFactor = svg.dataHt / 60

    // Parameter ranges, axis
    let bounds = $derived(getBounds(data))
    function makeBounds() {
        return {
            val:{min: 999999999, max: 0},
            tic:{min: 0, max: 0, step: 0, ticks: []}
        }
    }
    function getBounds() {
        const b = {ros: makeBounds(), fli: makeBounds(), flame: makeBounds()}
        for(let item of data) {
            if (item.fuel.isActive) {
                for(let key of ['ros','fli','flame']) {
                    b[key].val.min = Math.min(b[key].val.min, item[key])
                    b[key].val.max = Math.max(b[key].val.max, item[key])
                    let nice = getNiceTicks(b[key].val.min, b[key].val.max, 5)
                    b[key].tic.min = nice.min
                    b[key].tic.max = nice.max
                    b[key].tic.step = nice.step
                    b[key].tic.ticks = nice.ticks
                }
            }
        }
        return b
    }
    const groupColor = {
        '13': 'Orange',
        'gr': 'DarkKhaki',
        'gs': 'SpringGreen',
        'sh': 'DarkGreen',
        'tu': 'ForestGreen',
        'tl': 'DarkGoldenrod',
        'sb': 'Brown'
    }
    let sprites = $derived(updateSprites(data))

    function updateSprites(data) {
        const d = []
        for(let item of data) {
            if (item.fuel.isActive) {
                const x = svg.padl + item.ros * svg.rosFactor
                const y = (yvar==='flame')
                    ? svg.padt + (svg.dataHt - item.flame * svg.flameFactor)
                    : svg.padt + (svg.dataHt - item.fli * svg.fliFactor)
                const fill = groupColor[item.fuel.group] 
                d.push({label: item.fuel.label, x, y, fill, group: item.fuel.group})
            }
        }
        console.log(d)
        return d
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
