/* Terminal Color Codes  Foreground and // Background*/
const Black   =	'\x1b[30m' // '\x1b[40m'
const Red     =	'\x1b[31m' // '\x1b[41m'
const Green   =	'\x1b[32m' // '\x1b[42m'
const Yellow  =	'\x1b[33m' // '\x1b[43m'
const Blue    =	'\x1b[34m' // '\x1b[44m'
const Magenta =	'\x1b[35m' // '\x1b[45m'
const Cyan    =	'\x1b[36m' // '\x1b[46m'
const White   =	'\x1b[37m' // '\x1b[47m'
const Reset   =	'\x1b[0m'  // '\x1b[0m'

const H  = "\u2550" // ═
const V  = "\u2551" // ║
const DR = "\u2554" // ╔
const DL = "\u2557" // ╗
const UR = "\u255a" // ╚
const UL = "\u255d" // ╝
const VR = "\u2560" // ╠
const VL = "\u2563" // ╣
const HD = "\u2566" // ╦
const HU = "\u2569" // ╩
const VH = "\u256c" // ╬

export function dump(node) {
    const a = []
    for(let p of node.suppliers) a.push(p.fullKey())

    let str = `'${node.fullKey()}' value = ${node.value} ${node.units.uom[0]} (${node.units.label})\n`
    str += `    updater ${node.updater.name}(${a.join(', ')})\n`
    str += `    dirty=${node.dirty}, status=${node.status}`
    console.log(str)
}

export function table(rows, headers=null, title=null) {
    // Determine column widths
    const width = []
    for(let col=0; col<rows[0].length; col++) width[col] = 0
    for(let row of rows) {
        for(let col=0; col<row.length; col++)
            width[col] = Math.max(width[col], row[col].length)
    }
    if (headers) {
        for(let col=0; col<headers.length; col++)
            width[col] = Math.max(width[col], headers[col].length)
    }
    let fullwidth = 1
    for(let col=0; col<width.length; col++) fullwidth += (width[col]+3)

    // Title
    let str = title ? title+'\n' : ''
    // Top bar
    str += DR
    for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, H) + HD
    str += ''.padStart(width[width.length-1]+2, H) + DL + '\n'

    if (headers) {
        // Headers row
        str += V +' '
        for(let col=0; col<headers.length; col++) {
            str += Green + headers[col].padEnd(width[col]+1) + Reset + V + ' '
        }
        // Middle bar
        str += '\n' + VR
        for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, H) + VH
        str += ''.padStart(width[width.length-1]+2, H) + VL + '\n'
    }

    for(let row of rows) {
        str += V +' '
        for(let col=0; col<row.length; col++) {
            str += Yellow + row[col].padEnd(width[col]+1) + Reset + V + ' '
        }
        str += '\n'
    }

    // Bottom  border
    str += UR
    for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, H) + HU
    str += ''.padStart(width[width.length-1]+2, H) + UL + '\n'
    return str
}

export function nodeTable(nodes, title='') {
    const headers = ['Full Key', 'Status', 'Dirty', 'Value', 'Updater']
    const data = []
    for(let node of nodes) {
        let args = []
        for(let supplier of node.suppliers) args.push(supplier.fullKey())
        data.push([node.fullKey(), node.status, node.dirty, node.value.toString(),
            `${node.updater.name}(${args.join(', ')})`])
    }
    return table(data.sort(), headers, title)
}

export function activeInputNodesTable(root, title='Active Input Nodes') {
    console.log(nodeTable(root.activeInputNodes(), title))
}

export function inputNodesTable(root, title='Active Input Nodes') {
    console.log(nodeTable(root.inputNodes(), title))
}

export function allNodesTable(root, title='All Nodes') {
    console.log(nodeTable(root.nodes(), title))
}

export function selectedNodesTable(root, title='Selected Nodes') {
    console.log(nodeTable(root.selectedNodes(), title))
}
