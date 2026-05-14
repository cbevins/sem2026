// Demonstrate that getBresenhamLine() works across all 4 quadrants
import { getBresenhamLine } from '../index.js'
console.table(getBresenhamLine(-10, -4, 10, 12))
console.table(getBresenhamLine(10,4, -10, -10))