import {Stem, FireRate, FireDistance } from './Bush.js'

export const ellipse = new Stem('ellipse',
    new Stem('length',
        new FireRate(),
        new FireDistance()
    ),
    new Stem('width',
        new FireRate(),
        new FireDistance()
    ),
)

console.log(ellipse)
console.log(Object.keys(ellipse.length))