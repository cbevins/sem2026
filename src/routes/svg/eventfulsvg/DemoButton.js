export class DemoButton {
    constructor(width=40, height=40) {
        this.width = width
        this.height= height
        this.state = 0      // 0=blurred, 1=focused, 2=pressed
        this.count = 0      // Result of button press
    }

    pressed() { this.count++ }

    // Override the base class handleEvent()
    handleEvent(e) {
        if(e) {
            if (e.type === 'mouseenter') {
                this.state = 1
                return true
            } else if (e.type === 'mousedown') {
                this.state = 2
                return true
            } else if (e.type === 'mouseup') {
                this.state = 1
                this.pressed()
                return true
            } else if (e.type === 'mouseleave') {
                this.state = 0
                return false
            }
            return false
        }
        return false
    }

    drawSvg() {
        const w = this.width
        const h = this.height

        // stroke and fill by state
        const fill = ['gray', 'lightblue', 'magenta'][this.state]
        const stroke = ['black', 'magenta', 'blue'][this.state]
        
        // Common text attributes
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"

        // Button background fill color depends on the state (hover, pressed)
        const btn = `<rect x=0 y=0 width=${w} height=${h} fill='${fill}'/>`

        // Button ring stroke color depends on the state
        const ring = `<path d="M0,0 L${w},0 L${w},${h}, L0,${h} Z"
            stroke=${stroke} stroke-width="10" fill="transparent"
            style="stroke-linejoin: round;"/>`

        // Show current count in center of button
        const text = `<text x=${w/2} y=${4+h/2} ${textAttr}>${this.count}</text>`

        // return the content
        return btn+ring+text
    }
}
