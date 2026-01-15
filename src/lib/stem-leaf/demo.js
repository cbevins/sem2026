import {leaf, stem, Stem, Leaf} from './StemLeaf.js'

const mammals = new Stem('mammals',
    new Stem('canines',
        new Leaf('wolf'),
        new Leaf('hyenea'),
        new Stem('dogs',
            new Leaf('poodle', 'bark'),
            new Leaf('hound', 'howl')
        ), // end dogs stem
    ), // end canines stem
    new Stem('felines',
        new Leaf('tiger', 'growl'),
        new Leaf('lion', 'roar'),
        new Stem('housecats',
            new Leaf('tabby', 'meow'),
            new Leaf('Cheshire', 'grin')) // end housecats stem
    ), // end felines stem
)    // end mammals
console.log(mammals)

const hound = mammals.canines.dogs.hound
console.log(hound.lineage())
console.log('hound type:', hound.type)
console.log('hound key:', hound.key)
console.log('hound value', hound.value)
console.log('hound parent', hound.parent.key)
console.log('canines:', Object.keys(hound.parent))