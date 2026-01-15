/**
 * The Stem and Leaf classes provide a mechanism for building JS object hierarchies
 * that track their ownership hierarchy.  This is useful when implementing a
 * Composite Pattern in javascript without the awkward syntax of accessing child
 * objects from an array.  Rather, we prefer to access them like any other object
 * property using dot notation.
 * 
 * To acheive this, all child objects are stored
 * as 'enumerable' properties of the parent object, while meta data about the
 * parent/child are stored in a non-enumerable properties.
 * 
 * Usage:
 *  const mammals = new Stem('mammals',
 *      new Stem('canines',
 *          new Leaf('wolf'),
 *          new Leaf('hyenea'),
 *          new Stem('dogs',
 *              new Leaf('poodle'),
 *              new Leaf('hound')), // end dogs stem
 *      ), // end canines stem
 *      new Stem('felines',
 *          new Leaf('tiger'),
 *          new Leaf('lion'),
 *          new Stem('housecats',
 *              new Leaf('tabby'),
 *              new Leaf('Cheshire')) // end housecats stem
 *      ), // end felines stem
 * )    // end mammals
 *  mammals.canines.dogs.hound.says = 'owoooo'
 * 
*/

/**
 * DNA is the base class that tracks the objects parent (owner) object as well
 * as its own key (property) name in an non-enumerable property.
*/
export class Dna {
    constructor(parent, key, type) {
        Object.defineProperty(this, 'parent', {
            value: parent,          // reference to this object's parent object
            enumerable: false,      // not visible to loops like for...in or to Object.keys()
            configurable: true,     // prevents propery deletion
            writable: true,         // *** must to be able to set this after instantiation
        })
        Object.defineProperty(this, 'key', {
            value: key,             // name by which this object is known to its parent
            enumerable: false,      // not visible to loops like for...in or to Object.keys()
            configurable: false,    // prevents propery deletion
            writable: false,        // cannot be reset or deleted
        })
        Object.defineProperty(this, 'type', {
            value: type,            // 'Stem' or 'Leaf'
            enumerable: false,      // not visible to loops like for...in or to Object.keys()
            configurable: false,    // prevents propery deletion
            writable: false,        // cannot be reset or deleted
        })
        // this.parent = parent
    }
    isLeaf() { return this.type === 'Leaf' }
    isStem() { return this.type === 'Stem' }
    lineage() {
        const keys = []
        this._lineage(keys)
        return keys
    }
    _lineage(keys) {
        if(this.parent) this.parent._lineage(keys)
        keys.push(this.key)
    }
}

/**
 * The Stem class contains other Leaf and Stem instances as properties.
 */
export class Stem extends Dna {
    /**
     * 
     * @param {string} key The key by which this Stem is known to its parent.
     * @param  {...any} children References to child STem and/or Leaf instances,
     *  usually being created inline via the *new* operator
     */
    constructor(key, ...children) {
        super(null, key, 'Stem')
        console.log(`Stem '${key}' children`, children)
        for(let child of children) {
            console.log(`    Stem '${key}' child`, child, child.key)
            this[child.key] = child
            this[child.key].parent = this
        }
    }
}

/**
 * The Leaf class is usually extended to accept leaf-specific properties
 */
export class Leaf extends Dna {
    constructor(key, value) {
        super(null, key, 'Leaf')
        this.value = value
    }
}

// Reduces some verbage
export function leaf(key, ...props) { return new Leaf(key, props) }
export function stem(key, ...children) { return new Stem(key, children) }
