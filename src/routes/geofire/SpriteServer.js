import { FireEllipseMod } from '$lib/fire/ellipse/FireEllipseMod.js'

export class SpriteServer {
    constructor() {
        this.cache = new Map()
        this.dag = this.initFireEllipseMod()
    }

    initFireEllipseMod() {
        const e = new FireEllipseMod('e', 'north').ready()
        // Select required nodes to determine perimeter points at regular theta intervals
        // as well as length, width, center point, size, and perimeter
        for(let node of [
            e.back.dist, e.back.ros, e.back.dist,
            e.back.perim.east, e.back.perim.north, 
            e.center.y, e.center.x,
            e.center.east, e.center.north,
            e.head.dist, e.head.ros, e.head.dist,
            e.head.perim.east, e.head.perim.north, 
            e.length.dist,
            e.size,
            e.perimeter,
            e.width.dist])
        node.select()

        // Set required inputs
        e.head.bearing.set(90)
        e.head.ros.set(25)
        e.ignition.east.set(0)
        e.ignition.north.set(0)
        e.lwr.set(2)
        // e.beta.bearing.set(0)
        e.time.set(1)
        e.updateAll()
        return e
    }

    // Returns a Sprite template that can be cached and then
    createSpriteTemplate(firePacket, duration=1, spacing=1) {
        const e = this.dag
        e.head.bearing.set(firePacket.bearing)
        e.head.ros.set(firePacket.headRos)
        // e.ignition.east.set(0)
        // e.ignition.north.set(0)
        e.lwr.set(firePacket.lwr)
        // e.beta.bearing.set(0)
        e.time.set(duration)
        e.updateAll()

        const sprite = { 
            headRos: firePacket.headRos,
            bearing: firePacket.bearing,
            lwr: firePacket.lwr,
            duration,
            spacing,
            ignEast: 0,
            ignNorth: 0,
            headDist: e.head.dist.get(),
            headEast: e.head.perim.east.get(),
            headNorth: e.head.perim.north.get(),
            centerEast: e.center.east.get(),
            centerNorth: e.center.north.get(),
            length: e.length.dist.get(),
            perimeter: e.perimeter.get(),
            size: e.size.get(),
            width: e.width.dist.get(),
        }
        sprite.scanLines = this.scanEllipse(sprite.length, sprite.width, sprite.bearing,
            sprite.centerEast, sprite.centerNorth, sprite.spacing)
        return sprite
    }

    getSprite(ignEast, ignNorth, firePacket, duration=1, spacing=1) {
        // 1 - Check cache for an existing perimeter based on the firePacket
        const template = this.createSpriteTemplate(firePacket, duration, spacing)
        const sprite = {...template}
        // 2 - Translate template perimeter coordinates to the [col,row]
        sprite.ignEast = ignEast
        sprite.ignNorth = ignNorth
        sprite.headEast = ignEast + template.headEast
        sprite.headNorth = ignNorth + template.headNorth
        sprite.centerEast = ignEast + template.centerEast
        sprite.centerNorth = ignNorth + template.centerNorth
        const lines = []
        for(let i=0; i<template.scanLines.length; i++) {
            const [y, x1, x2] = template.scanLines[i]
            lines.push([y + ignNorth, x1 + ignEast, x2 + ignEast])
        }
        sprite.scanLines = lines
        return sprite
    }

    scanEllipse(length, width, bearing, centerEast, centerNorth, spacing=1) {
        const ignEast = 0
        const ignNorth = 0
        const lines = []
        // Use the ellipse length as the initial bounding radius
        const xMin = ignEast - length
        const xMax = ignEast + length
        const yMin = ignNorth - length
        const yMax = ignNorth + length
        const headDeg = (450-bearing) % 360
        const radians = headDeg * Math.PI / 180
        // Start with ignition point and go north
        for(let y=ignNorth; y<= yMax; y+= spacing) {
            const xs = this.scanLine(xMin, y, xMax, y, centerEast, centerNorth, length/2, width/2, radians)
            if (xs.length === 1) console.log('scanEllipse() Found just 1 scanline point at row ', y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        lines.reverse()
        this.ignIdx = lines.length - 1
        // Start with ignition point and go south
        for(let y=ignNorth-spacing; y>= yMin; y-= spacing) {
            const xs = this.scanLine(xMin, y, xMax, y, centerEast, centerNorth, length/2, width/2, radians)
            if (xs.length === 1) console.log('scanEllipse() Found just 1 scanline point at row ', y)
            if (xs.length < 2) break
            lines.push([y, xs[0], xs[1]])
        }
        return lines
    }

    // Modified to return a 2-element array of scanline's first and last x-coordinate
    scanLine(x1, y1, x2, y2, cx, cy, rx, ry, angle) {
        // 1. Translate and rotate the line segment to the ellipse's local space
        const cosA = Math.cos(-angle);
        const sinA = Math.sin(-angle);

        const tx1 = x1 - cx;
        const ty1 = y1 - cy;
        const tx2 = x2 - cx;
        const ty2 = y2 - cy;

        const lx1 = tx1 * cosA - ty1 * sinA;
        const ly1 = tx1 * sinA + ty1 * cosA;
        const lx2 = tx2 * cosA - ty2 * sinA;
        const ly2 = tx2 * sinA + ty2 * cosA;

        // 2. Normalize radii (treat ellipse as unit circle)
        const nlX1 = lx1 / rx;
        const nlY1 = ly1 / ry;
        const nlX2 = lx2 / rx;
        const nlY2 = ly2 / ry;

        // 3. Line segment equation: P = P1 + t * (P2 - P1), 0 <= t <= 1
        const dx = nlX2 - nlX1;
        const dy = nlY2 - nlY1;

        // Quadratic coefficients (at^2 + bt + c = 0)
        const a = dx * dx + dy * dy;
        const b = 2 * (nlX1 * dx + nlY1 * dy);
        const c = nlX1 * nlX1 + nlY1 * nlY1 - 1;

        const discriminant = b * b - 4 * a * c;
        const intersections = [];

        if (discriminant >= 0) {
            const sqrtDisc = Math.sqrt(discriminant);
            const t1 = (-b - sqrtDisc) / (2 * a);
            const t2 = (-b + sqrtDisc) / (2 * a);

            // 4. Check if intersections lie on the segment (0 <= t <= 1)
            [t1, t2].forEach(t => {
                if (t >= 0 && t <= 1) {
                    // Find intersection in normalized space
                    const intX = nlX1 + t * dx;
                    const intY = nlY1 + t * dy;

                    // 5. Transform back to original space
                    const finalX = (intX * rx) * Math.cos(angle) - (intY * ry) * Math.sin(angle) + cx;
                    // const finalY = (intX * rx) * Math.sin(angle) + (intY * ry) * Math.cos(angle) + cy;
                    // intersections.push([finalX, finalY])
                    intersections.push(finalX)
                }
            })
        }
        return intersections
    }

}
