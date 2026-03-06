<script>
    import { gxmlStr } from "$lib/gxml/gxmlStr"
    function text(x, y, content, props) { return {el: 'text', x, y, ...props, els: [{el: 'inner', content}]} }
    const textProps = {stroke:'black', 'font-size':10, 'font-family':'sans-serif', 'font-weight':'normal',
        'text-anchor': 'middle'}

    let width=$state(1000)
    let height=$state(1000)
    const bounds = {l:-1000, r: 1000, t: 1000, b:-1000}
    let vbx = $state(-1000)
    let vby = $state(-1000)
    let vbw = $state(2000)
    let vbh = $state(2000)
    let viewBox = $derived(`${vbx} ${vby} ${vbw} ${vbh}`)
    let content = $derived(draw())

    function gy(y) { return bounds.b}
    function draw() {
        const xdim = 100
        const ydim = 100
        const xcells = Math.ceil((bounds.r - bounds.l)/xdim)
        const ycells = Math.ceil((bounds.t - bounds.b)/ydim)
        const els = [{el: 'rect', x: 0, y: 0, width:1000, height:1000, fill: 'hsl(120,100%,50%)'}]
        let nx = 0
        for(let x=bounds.l; x<=bounds.r; x+=xdim) {
            els.push({el: 'line', x1: x, y1: bounds.b, x2: x, y2: bounds.t, stroke: 'black'})
            let ny = 0
            for(let y=bounds.b; y<=bounds.t; y+=ydim) {
                const hue = ny * 360/ycells
                const sat = 100
                const light = 60-2*nx
                els.push({el: 'rect', x, y, width:100, height:100,
                    fill: `hsl(${hue}, ${sat}%,${light}%)`})
                els.push(text(x+50, y+50, `${x},${y}`, textProps))
                els.push({el: 'line', x1: bounds.l, y1: y, x2: bounds.r, y2:y, stroke: 'black'})
                ny++
            }
            nx++
        }
        return gxmlStr(els)
    }

    function top() {vby = Math.min(bounds.t, vby - vbh/4) } // Math.max(bounds.t, vby - (vbh/4)) }
    function left() {vbx = Math.max(bounds.l, vbx - (vbw/4)) }
    function right() { vbx = Math.min(bounds.l+(vbw-vbx), vbx + (vbw/4)) }
    function bottom() { vby = vby + vbh/4 } //Math.min(bounds.b-(vbh-vby), vby + (vbh/4)) }
</script>

<div class='mx-2 my-2 text-md'>
    <button class='border rounded bg-blue-300' onclick={left}>Pan left</button>
    <button class='border rounded bg-blue-300' onclick={right}>Pan right</button>
    <button class='border rounded bg-blue-300' onclick={top}>Pan up</button>
    <button class='border rounded bg-blue-300' onclick={bottom}>Pan down</button>
    Viewbox = {vbx}, {vby}, {vbw}, {vbh}
    <svg {viewBox} width={width} height={height}>
        {@html content}
    </svg>
</div>