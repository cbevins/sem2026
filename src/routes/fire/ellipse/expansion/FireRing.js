// Node for a linked list of fire point locations
export class FireNode {
    constructor(prev, next, x, y) {
        this.prev = prev
        this.next = next
        this.from = null    // Reference to its origin node
        this.x = x
        this.y = y
    }
}

// Helper function that returns a new FireNode or one from a free node list.
export function getNode() {
    return new FireNode()
}

export class FireRing {
    constructor() {
        this.head = null
        this.length = 0
    }
    append(idx, x, y, from=null) {
        const node = getNode()
        node.x = x
        node.y = y
        node.idx = idx
        node.from = from
        if (!this.head) {
            this.head = node
            node.prev = node
            node.next = node
        } else {
            const prev = this.head.prev
            node.prev = prev
            prev.next = node
            node.next = node.head
            this.head.prev = node
        }
        this.length++
        // console.log(`append(${idx}, ${x}, ${y}) prev=${node.prev.idx}`)
    }

    // Example of iterating across the FireRing points
    table() {
        const ar = []
        let node = this.head
        do {
            // console.log(`${node.prev.idx} -> ${node.idx} [${node.x}, ${node.y}] -> ${node.next.idx}`)
            ar.push({prev: node.prev.idx, idx: node.idx, x: node.x, y: node.y, next: node.next.idx})
            node = node.next
        } while(node !== this.head.prev)
        return ar
    }

}

// polygon is an array of {x, y} point objects
// whose first and last elements are the same point
export function makeFireRing(points) {
    const ring = new FireRing()
    for(let i=0; i<points.length-1; i++)
        ring.append(i, points[i].x, points[i].y)
    return ring
}
