/**
 * gxmlSvg.js
 * Contains function to help construct SVG Gxml data structures.
 */

/**
 * Fits the sourceEl into the destEl scaling either the sourceEl's
 * 'width', 'height', or 'both'.
 * @param {*} sourceEl 
 * @param {*} destEl 
 * @param {*} fit 'width', 'height', or 'both'
 * @returns 
 */
export function fit(sourceEl, destEl, fit='both') {
    let xscale = destEl.width / sourceEl.width
    let yscale = destEl.height / sourceEl.height
    if (fit === 'width' || fit === 'x') {
        yscale = xscale
    } else if (fit === 'height' || fit === 'y') {
        xscale = yscale
    } else if ( fit === 'none') {
        xscale = 1
        yscale = 1
    }
    const transform = `scale(${xscale}, ${yscale})`
    const g = {el: 'g', transform: transform, els: [sourceEl]}
    destEl.els.push(g)
    return g
}

/**
 * A nested placement operation that places a wrapped 'sourceEl' inside a 'destEl'.
 * 
 * The scourceEl is first wrapped inside a <g> element,
 * and then translated such that its [sourceX, sourceY] point is located
 * directly over the destEl's [destX, destY] point.
 * 
 * The sourceEl is then scaled and rotated about the [destX, destY] point.
 * 
 * Finally, the <g><sourceEl><g> is appended to the destEl elements arrray.
 * 
 * Note that the sourceEl could its be a <svg> containing more elements,
 * and all its child elements will be translated-scaled-rotated as well.
 * 
 * @param {*} sourceEl Reference to the element being nested
 * @param {*} sourceX  sourceEl's alignment x-coordinate
 * @param {*} sourceY sourceEl's alignment y-coordinate 
 * @param {*} destEl Reference to the container element
 * @param {*} destX  destEl's alignment x-coordinate
 * @param {*} destY destEl's alignment y-coordinate 
 * @param {*} scale sourceEl's scaling factor
 * @param {*} degrees sourceEl's rotation degrees
 * @returns  Reference to the new Gxml <g> el that:
 * (1) contains the sourceEl, and (2) is nested inside the destEl.
 */
export function nest(sourceEl, sourceX, sourceY,
        destEl, destX=0, destY=0, scale=1, degrees=0) {
    const dx = destX - scale * sourceX
    const dy = destY - scale * sourceY
    const g = {el: 'g',
        transform: `rotate(${degrees}, ${destX}, ${destY}) translate(${dx}, ${dy}) scale(${scale})`,
        els: [sourceEl]}
    destEl.els.push(g)
    return g
}

/**
 * A nested placement operation that places a 'sourceEl' inside a 'destEl'
 * using the sourceEl's center point and the [destX, destY] point
 * as the alignment coordinates (see nest()).
 * 
 * Note that this only works if the sourceEl has both 'width' and 'height'
 * attributes from which to calculate a center pt.
 */
export function nestMid(sourceEl, destEl, destX=0, destY=0, scale=1, degrees=0) {
    const sbox = bbox(sourceEl)
    const sourceX = 0.5 * sbox.width
    const sourceY =  0.5 * sbox.height
    return nest(sourceEl, sourceX, sourceY, destEl, destX, destY, scale, degrees)
}

/**
 * A nested placement operation that places a 'sourceEl' inside a 'destEl'
 * using the sourceEl's top-left corner and the [destX, destY] point
 * as its alignment coordinates (see nest()).
 */
export function nestTl(sourceEl, destEl, destX=0, destY=0, scale=1, degrees=0) {
    return nest(sourceEl, 0, 0, destEl, destX, destY, scale, degrees)
}

/**
 * An non-nesting placement operation that registers the 'subjectEl' local [x,y] point
 * relative to a 'referEl' local [x, y] point,
 * assuming both elements share the same user coordinates.
 * 
 * The overlay is accomplished by setting the 'transform' attribute on 'subjectEl'.
 * 
 * The 'subjectEl' is *NOT* added to any parent el.
 * 
 * *NOTE* Both 'subjectEl' and 'referEl' must have {x:, y:} attributes.
 */
export function register(subjectEl, subjectLocalX, subjectLocalY,
        referEl, referLocalX=0, referLocalY=0, scale=1, degrees=0) {
    // Convert coordinates from local to shared system
    const rbox = bbox(referEl)
    const rx = rbox.x + referLocalX
    const ry = rbox.y + referLocalY
    const sbox = bbox(subjectEl)
    const sx = sbox.x + subjectLocalX
    const sy = sbox.y + subjectLocalY
    // Translation distance
    const dx = rx - scale * sx
    const dy = ry - scale * sy
    subjectEl.transform = `rotate(${degrees}, ${rx}, ${ry}) translate(${dx}, ${dy}) scale(${scale})`
    return subjectEl
}

/**
 * An non-nesting placement operation that registers the 'subjectEl' center pt
 * relative to a 'referEl' center pt, assuming both elements both share the same user coordinates.
 * 
 * The overlay is accomplished by setting the 'transform' attribute on 'subjectEl'.
 * 
 * The 'subjectEl' is *NOT* added to any parent el.
 * 
 * *NOTE* Both 'subjectEl' and 'referEl' must have {x:, y:, width:, height:} attributes.
 */
export function registerCenters(subjectEl, referEl, scale=1, degrees=0) {
    const sbox = bbox(subjectEl)
    const subjectX = sbox.width/2
    const subjectY = sbox.height/2
    const rbox = bbox(referEl)
    const referX = rbox.width/2
    const referY = rbox.height/2
    return register(subjectEl, subjectX, subjectY, referEl, referX, referY, scale, degrees)
}

// Creates a {el: 'text'} element with its inner content
export function textEl(x, y, content, anchor="middle") {
    return {el: 'text', x: x, y: y, 'text-anchor': anchor,
        els: [{el: 'inner', content: content}]}
}

function bbox(el) {
    if (el.el === 'rect') {
        const x = Object.hasOwn(el, 'x') ? el.x : 0
        const y = Object.hasOwn(el, 'y') ? el.y : 0
        const width = Object.hasOwn(el, 'width') ? el.width : 0
        const height = Object.hasOwn(el, 'height') ? el.height : 0
        return {x, y, width, height}
    } else if (el.el === 'circle') {
        const r = Object.hasOwn(el, 'r') ? el.r : 0
        const rx = Object.hasOwn(el, 'rx') ? el.rx : el.r
        const ry = Object.hasOwn(el, 'ry') ? el.ry : el.r
        const x = el.cx - rx
        const y = el.cy - ry
        return {x: x, y: y, width: 2*rx, height: 2*ry}
    } else if (el.el === 'text') {
        const x = Object.hasOwn(el, 'x') ? el.x : 0
        const y = Object.hasOwn(el, 'y') ? el.y : 0
        const fs = Object.hasOwn(el, 'font-size') ? el['font-size'] : 16
        const width = Object.hasOwn(el, 'width') ? el.width : 0
        // const width = 16 * el.els[0].content.length
        const height = -0.75 * fs
        const box = {x, y, width, height}
        return box
    }
    const x = Object.hasOwn(el, 'x') ? el.x : 0
    const y = Object.hasOwn(el, 'y') ? el.y : 0
    const width = Object.hasOwn(el, 'width') ? el.width : 0
    const height = Object.hasOwn(el, 'height') ? el.height : 0
    const box = {x, y, width, height}
    return box
}