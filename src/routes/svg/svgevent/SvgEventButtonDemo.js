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

        const ring = ['black', 'magenta', 'blue'][this.state]
        const fill = ['gray', 'lightblue', 'magenta'][this.state]
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"

        let str = `<rect x='0' y='0' width=${this.width} height=${this.height} rx="10" ry="10
            fill='${ring}'/>`
        str += `<rect x='5' y='5' width=${this.width-10} height=${this.height-10} rx="10" ry="10"
            fill='${fill}'/>`
        str += `<text x=${this.width/2} y=${this.height/2} ${textAttr}>${this.count}</text>`
        return str
    }
}
