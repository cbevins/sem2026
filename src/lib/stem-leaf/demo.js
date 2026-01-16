import {leaf, stem, Stem, Leaf} from './StemLeaf.js'

const mammals = stem('mammals',
    stem('canines',
        leaf('wolf', {says: 'howl'}),
        leaf('hyenea', {says: 'laugh'}),
        stem('dogs',
            leaf('poodle', {says:'bark'}),
            leaf('hound', {says:'yelp'})
        ), // end dogs stem
    ), // end canines stem
    stem('felines',
        leaf('tiger', {says:'growl'}),
        leaf('lion', {says:'roar'}),
        stem('housecats',
            leaf('tabby', {says:'meow'}),
            leaf('Cheshire', {says:'grin'})) // end housecats stem
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