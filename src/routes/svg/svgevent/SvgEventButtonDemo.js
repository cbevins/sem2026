export class SvgEventButtonDemo {
    constructor(width=40, height=40) {
        this.width = width
        this.height= height
        this.state = 0      // 0=outside 1=inside, 2=pressed
        this.count = 0      // Result of button press
    }

    pressed() { this.count++ }

    create(e=null) {
        if(e) {
            if (e.type === 'mouseenter') this.state = 1
            else if (e.type === 'mousedown') this.state = 2
            else if (e.type === 'mouseup') { this.state = 1; this.pressed() }
            else if (e.type === 'mouseleave') this.state = 0
            else { /* ignore */}
        }

        const w = this.width
        const h = this.height
        const fill = ['gray', 'lightblue', 'magenta'][this.state]
        const stroke = ['black', 'magenta', 'blue'][this.state]
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"

        const btn = `<rect x=0 y=0 width=${w} height=${h} fill='${fill}'/>`
        const ring = `<path d="M0,0 L${w},0 L${w},${h}, L0,${h} Z"
            stroke=${stroke} stroke-width="10" fill="transparent" style="stroke-linejoin: round;"/>`
        const text = `<text x=${w/2} y=${h/2} ${textAttr}>${this.count}</text>`
        return btn+ring+text
    }
}
