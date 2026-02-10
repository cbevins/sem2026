export class SvgEventDemo {
    constructor(width, height) {
        this.width = width
        this.height= height

        this.xy    = '(outside of image)'
        this.move  = 'Mouse move to: (move mouse over the image)'
        this.over  = 'Mouse over at: none'
        this.out   = 'Mouse out at: none'
        this.enter = 'Mouse enter at: (move mouse pointer inside the image)'
        this.leave = 'Mouse leave at: (move mouse pointer outside the image)'
        this.down  = 'Mouse down at: (release a mouse button)'
        this.up    = 'Mouse up at: (press down a mouse button)'
        this.click = 'Mouse click at: (press and release a mouse button)'
        this.dbl   = 'Double click at: none'
        this.key   = 'Last key: (press a key while inside the image)'   // handles both key down and up

        this.panning = ''
        this.panBeg = []
        this.panEnd = []
        this.str = ''
    }

    create(e=null) {
        if(e) {
            this.xy = `[${e.offsetX}, ${e.offsetY}]`
            if (e.type === 'mousemove') {
                this.move = `Mouse at: ${this.xy}`
            } else if (e.type === 'click') {
                this.click = `Click at: ${this.xy}`
            } else if (e.type === 'dblclick') {
                this.dbl = `Double click at: ${this.xy}`
            }
            // mouseenter/mouseleave occurs when the pointer is moved onto an element, but not its descendants.
            else if (e.type === 'mouseenter') {
                this.enter = `Mouse enter at: ${this.xy}`
            } else if (e.type === 'mouseleave') {
                this.leave = `Mouse leave at: ${this.xy}`
                if (this.panning === 'PANNING...') {
                    this.panEnd = [e.offsetX, e.offsetY, Date.now()]
                    this.panning = `Panning stopped from [${this.panBeg[0]}, ${this.panBeg[1]}] to [${this.panEnd[0]}, ${this.panEnd[1]}]`
                }
            }
            // mousedown/mouseup occurs when a mouse button is pressed down ir released over an element
            else if (e.type === 'mousedown') {
                this.down = `Mouse is DOWN at ${this.xy}`
                this.panBeg = [e.offsetX, e.offsetY, Date.now()]
                this.panning = 'PANNING...'
            } else if (e.type === 'mouseup') {
                this.up = `Mouse is UP at: ${this.xy}`
                this.panEnd = [e.offsetX, e.offsetY, Date.now()]
                let delay = this.panEnd[2]-this.panBeg[2]
                if(delay < 200) {
                    this.click = `Pseudo Click at: ${this.xy}`
                    this.panning = ''
                } else {
                    this.panning = `Moved from [${this.panBeg[0]}, ${this.panBeg[1]}] to [${this.panEnd[0]}, ${this.panEnd[1]}]`
                }
            }
            // similar to mouseover/mouseout, similar to mouseenter/mouseleave,
            // but fires when the pointer enters an element or any of its child elements. else if (e.type==='mouseover') {
            else if (e.type==='mouseover') {
                this.over = `Mouse over at: ${this.xy}`
            } else if (e.type==='mouseout') {
                this.out = `Mouse out at: ${this.xy}`
            } else {
                let k=[]
                if (e.shiftKey) k.push('Shift')
                if (e.ctrlKey) k.push('Alt')
                if (e.altKey) k.push('Alt')
                if (e.metaKey) k.push('Meta')
                k.push(e.key, e.code)
                this.key = `${e.type} is ${k.join('-')}`
            }
        }

        const dy = 20
        const textAttr = "stroke='black' font-size=10 text-anchor='middle'"
            + " 'font-family'='sans-serif' font-weight='light'"
        let str = `<rect x=0 y=0 width=${this.width} height=${this.height} fill='green'/>`
        let y = 2*dy
        for(let line of [this.enter, this.leave, this.down, this.move, this.up, this.panning, this.click, this.key]) {
            y += dy
            str += `<text x=${this.width/2} y=${y} ${textAttr}>${line}</text>`
        }
        this.str = str
        return str
    }
}
