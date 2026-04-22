import { EllipseScanner } from './EllipseScanner.js'

const length = 100
const width = 50
const bearing = 0
const ignEast = 0
const ignNorth = 0
const centerEast = 0
const centerNorth = 0
const e = new EllipseScanner(length, width, bearing,
    ignEast, ignNorth, centerEast, centerNorth)
const hlines = e.getHorizontalScanLines(1)
console.log(hlines)