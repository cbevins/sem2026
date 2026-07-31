/* Terminal Color Codes  Foreground and Background */
export const black   =	'\x1b[30m'; export const bgblack = '\x1b[40m';
export const red     =	'\x1b[31m'; export const bgred = '\x1b[41m'
export const green   =	'\x1b[32m'; export const bggreen = '\x1b[42m'
export const yellow  =	'\x1b[33m'; export const bgyellow =  '\x1b[43m'
export const blue    =	'\x1b[34m'; export const bgblue = '\x1b[44m'
export const magenta =	'\x1b[35m'; export const bgmagenta = '\x1b[45m'
export const cyan    =	'\x1b[36m'; export const bgcyan = '\x1b[46m'
export const white   =	'\x1b[37m'; export const bgwhite = '\x1b[47m'
export const reset   =	'\x1b[0m'

// Double line box drawing
export const h  = "\u2550" // ═
export const v  = "\u2551" // ║
export const dr = "\u2554" // ╔
export const dl = "\u2557" // ╗
export const ur = "\u255a" // ╚
export const ul = "\u255d" // ╝
export const vr = "\u2560" // ╠
export const vl = "\u2563" // ╣
export const hd = "\u2566" // ╦
export const hu = "\u2569" // ╩
export const vh = "\u256c" // ╬

export function startBanner() {console.log(startBannerStr())}
export function startBannerStr() {
    const progname = process.argv[1].split('\\').pop()
    const started = new Date().toLocaleString()
    const len = progname.length + started.length + 14
    let str = v + ' ' + magenta + progname + reset + ' started at ' + magenta + started + reset + ' ' + v + '\n'
    const top = dr + ''.padStart(len, h) + dl + '\n'
    const bot = ur + ''.padStart(len, h) + ul + '\n'
    return top+str+bot
}

// Generic terminal ascii table
export function table(rows, headers=null, title='') { console.log(tableStr(rows, headers, title)) }
export function tableStr(rows, headers=null, title='') {
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

    // Title
    let str = green + title + reset + '\n'
    // Top bar
    str += dr
    for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, h) + hd
    str += ''.padStart(width[width.length-1]+2, h) + dl + '\n'

    if (headers) {
        // Headers row
        str += v +' '
        for(let col=0; col<headers.length; col++) {
            str += green + headers[col].padEnd(width[col]+1) + reset + v + ' '
        }
        // Middle bar
        str += '\n' + vr
        for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, h) + vh
        str += ''.padStart(width[width.length-1]+2, h) + vl + '\n'
    }

    for(let row of rows) {
        str += v +' '
        for(let col=0; col<row.length; col++) {
            str += yellow + row[col].padEnd(width[col]+1) + reset + v + ' '
        }
        str += '\n'
    }

    // Bottom  border
    str += ur
    for(let col=0; col<width.length-1; col++) str += ''.padStart(width[col]+2, h) + hu
    str += ''.padStart(width[width.length-1]+2, h) + ul + '\n'
    return str
}
