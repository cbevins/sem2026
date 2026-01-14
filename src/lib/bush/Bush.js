export class Dna {
    constructor(parent, key, type) {
        Object.defineProperty(this, '_dna', {
            value: {parent, key, type},
            enumerable:false}
        )
    }
}
export class Stem extends Dna {
    constructor(key, ...rest) {
        super(null, key, 'stem')
        for(let item of rest) {
            const key = item._dna.key
            this[key] = item
            this[key]._dna.parent = this
        }
    }
}

export class Leaf extends Dna {
    constructor(key, label, value) {
        super(null, key, 'stem')
        this.label = label
        this.value = value
    }
}

//------------------------------------------------------------------------------

export class FireDistance extends Leaf {
    constructor(value=0) {
        super('dist', 'spread distance', value)
    }
}

export class FireRate extends Leaf {
    constructor(value=0) {
        super('ros', 'spread rate', value)
    }
}
