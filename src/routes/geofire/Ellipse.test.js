import { describe, it, expect } from 'vitest';
import { Ellipse } from './Ellipse.js'

const rad45 = (45 * Math.PI) / 180
const cos45 = Math.cos(rad45)
const sin45 = Math.sin(rad45)

describe('Ellipse class', () => {
    it('Default constructor() produces expected properties', () => {
        const e = new Ellipse()
        // Input properties
        expect(e.cx).toEqual(0)
        expect(e.cy).toEqual(0)
        expect(e.rx).toEqual(1)
        expect(e.ry).toEqual(1)
        expect(e.bearing).toEqual(0)
        // Derived properties
        expect(e.length).toEqual(2)
        expect(e.width).toEqual(2)
        expect(e.lwr).toEqual(1)
        expect(e.angleDeg).toEqual(90)
    })
    it('Custom constructor() produces expected properties', () => {
        const e = new Ellipse({rx: 10, ry: 2, bearing: 90, cx: -100, cy: 100})
        // Input properties
        expect(e.cx).toEqual(-100)
        expect(e.cy).toEqual(100)
        expect(e.rx).toEqual(10)
        expect(e.ry).toEqual(2)
        expect(e.bearing).toEqual(90)
        // Derived properties
        expect(e.length).toEqual(20)
        expect(e.width).toEqual(4)
        expect(e.lwr).toEqual(5)
        expect(e.angleDeg).toEqual(0)
    })
    it('perimeterAtPoint() on UNROTATED ellipse', () => {
        const e = new Ellipse({rx: 100, ry: 50})
        // Input properties
        expect(e.cx).toEqual(0)
        expect(e.cy).toEqual(0)
        expect(e.rx).toEqual(100)
        expect(e.ry).toEqual(50)
        expect(e.bearing).toEqual(0)
        expect(e.angleDeg).toEqual(90)

        // angle is the Cartesian angle (degrees counter clockwise from x-axis)
        let angle = 0
        let p, x, y
        p = e.perimeterPointFromHead(angle)
        expect(p).toEqual([100,0])
        
        angle = 45
        ;[x,y] = e.perimeterPointFromHead(angle)
        expect(x).toBeCloseTo(70.7106781, 7)
        expect(y).toBeCloseTo(70.7106781 / 2, 7)

        // head bearing is 0, so head, back, and sides are easy
        ;[x,y] = e.perimeterPointAtBearing(0)
        expect(x).toBeCloseTo(0, 9)
        expect(y).toBeCloseTo(100, 9)

        ;[x,y] = e.perimeterPointAtBearing(180)
        expect(x).toBeCloseTo(0, 9)
        expect(y).toBeCloseTo(-100, 9)

        ;[x,y] = e.perimeterPointAtBearing(-180)
        expect(x).toBeCloseTo(0, 9)
        expect(y).toBeCloseTo(-100, 9)

        ;[x,y] = e.perimeterPointAtBearing(90)
        expect(x).toBeCloseTo(50, 9)
        expect(y).toBeCloseTo(0, 9)

        ;[x,y] = e.perimeterPointAtBearing(-270)
        expect(x).toBeCloseTo(50, 9)
        expect(y).toBeCloseTo(0, 9)

        ;[x,y] = e.perimeterPointAtBearing(-90)
        expect(x).toBeCloseTo(-50, 9)
        expect(y).toBeCloseTo(0, 9)

        ;[x,y] = e.perimeterPointAtBearing(270)
        expect(x).toBeCloseTo(-50, 9)
        expect(y).toBeCloseTo(0, 9)

        ;[x,y] = e.perimeterPointAtBearing(45)
        expect(x).toBeCloseTo(e.rx * sin45, 7)
        expect(y).toBeCloseTo(70.7106781, 7)

        ;[x,y] = e.perimeterPointAtBearing(135)
        expect(x).toBeCloseTo(70.7106781 / 2, 7)
        expect(y).toBeCloseTo(-70.7106781, 7)

        ;[x,y] = e.perimeterPointAtBearing(225)
        expect(x).toBeCloseTo(-70.7106781 / 2, 7)
        expect(y).toBeCloseTo(-70.7106781, 7)

        ;[x,y] = e.perimeterPointAtBearing(315)
        expect(x).toBeCloseTo(-70.7106781 / 2, 7)
        expect(y).toBeCloseTo(70.7106781, 7)
    })
})
