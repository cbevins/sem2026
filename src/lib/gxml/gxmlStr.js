/**
 * Returns an SVG, HTML, or other XML data structure as a string
 * constructed from a set of nested plain-old JSON objects.
 * 
 * The JSON objects must have the following fields:
 * - el: names the element, such as 'svg', 'g', 'defs', 'rect', 'circle', 'line', 'text', etc
 *      The 'el' field may also be 'inner' for inner content such as within a <text></text> block,
 *      or 'comment' to embed a comment in the structure
 * - els: a (possibly empty) array of references to nexted objects that meet these specifications
 * 
 * See the runGxml.js example for ways to compose the specification data structure.
 * 
 * @param {gxml|[]} gxml  Either a single or array of gxml object references
 * @param {*} indent The number of spaces to indent each nesting level (change to 0 for no indents)
 * @param {*} eol  The end-of-line character (change to '' for no line breaks)
 * @returns An XML string suitable for writing to an SVG or HTML file or using within a Svelte componewnt.
 */

export function gxmlStr(gxml, indent=2, eol='\n', level=0) {
    let xml = ''
    const ar = Array.isArray(gxml) ? gxml : [gxml]
    for(let i=0; i<ar.length; i++) {
        xml += _gxmlStr(ar[i], indent, eol, level)
    }
    return xml
}

export function _gxmlStr(gxml, indent, eol, level=0) {
    // Check for nested arrays of gxml
    if (Array.isArray(gxml)) return gxmlStr(gxml, indent, eol, level)
    if (gxml.el === 'inner') {
        return (gxml.content).padStart(level*indent) + eol
    }
    if (gxml.el === 'comment') {
        return ''.padStart(level*indent) + `<!-- ${gxml.content} -->` + eol
    }
    // Traverse to inner-most element, accumulating nested elements
    let str = ''
    if (gxml.els) {
        for(let i=0; i<gxml.els.length; i++) {
            str += _gxmlStr(gxml.els[i], indent, eol, level+1)
        }
    }
    // Compose opening tag
    let cmd = ''.padStart(level*indent) + `<${gxml.el}`
    for (const [key, value] of Object.entries(gxml)) {
        if (key !== 'el' && key !== 'els' && key !== 'private') cmd += ` ${key}="${value}"`
    }
    // Compose content and closing tag
    if (str === '') return cmd + ' />' + eol
    return cmd + '>' + eol + str + ''.padStart(level*indent) + `</${gxml.el}>` + eol
}
