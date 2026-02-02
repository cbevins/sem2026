// Element fill and stroke attributes coomon to
// <circle>, <line>, <path, <polyline>, <rect>, and <text>
const fillStroke = {
    'fill': 'none',
    // 'fill-opacity': 1,
    // 'paint-order': 'fill',  // fill, stroke
    'stroke': 'black',
    'stroke-width': 1,
    // 'stroke-dasharray': '',
    'stroke-linecap': 'butt',    // butt, square, round
    'stroke-linejoin': 'round', // 'miter', 'round', 'bevel'
    // 'stroke-opacity': 1,
}

// Font attributes
const font = {
    'font-family': 'sans-serif',// sans-serif, serif, monospace, cursive, fantasy, math, emoji, system-ui, ui-serif, ui-sans-serif, ui-rounded, ui-monospace
    'font-size': 'medium',      // [1.2rem xx-small, x-small, small, medium, large, x-large, xx-large, xxx-large
    // 'font-size-adjust': '',
    // 'font-stretch': '',
    'font-style': 'normal',     // normal, italic, oblique, oblique <23deg>,
    'font-variant': 'normal',   // 'small-caps'
    'font-weight': 'normal',    // normal, bold, bolder, lighter, [1-1000] 
    'font-size': 16,
    // 'letter-spacing': '',    // number with optional units
    // 'word-spacing', '',      // number with optional units
    // 'text-decoration': 'none',   // 'dashed wavy line-through underline overline <color> <thickness>
}

// <inner> element template
export const gxmlInner = {
    'el': 'inner',
    'content': ''
}

// <line> template
export const gxmlLine = {
    'el': 'line', 
    'x1': 0, 'y1': 0,
    'x2': 0, 'y2': 0,
    ...fillStroke
}

// <path> template
export const gxmlPath = {
    'el': 'path', 
    'd': '',
    ...fillStroke
}

// <rect> element template
export const gxmlRect = {
    'el': 'rect', 
    'x': 0, 'y': 0,
    'width': 0, 'height': 0,
    'rx': 0, 'ry': 0,   // or 'auto'
    ...fillStroke
}

// <svg> element prototype
export const gxmlSvg = {
    'el': 'svg',
    'x': 0, 'y': 0,
    'width': 0, 'height': 0,
    'xmlns': "http://www.w3.org/2000/svg",
    els: []
}

// <text> element template
export const gxmlText = {
    'el': 'text',
    'x': 0, 'y': 0,
    'dx': 0, 'dy': 0,
    // rotate: 0,
    'dominant-baseline': 'auto',    // auto, middle, hanging
    'text-anchor': 'start',         // start, middle, end, inherit
    ...font,
    els: [{el: 'inner', content: ''}]
}
