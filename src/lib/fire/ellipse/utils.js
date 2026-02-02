import * as T from '../../utils/terminal.js'

export function start() {
    const progname = process.argv[1].split('\\').pop()
    const started = new Date().toLocaleString()
    const len = progname.length + started.length + 14
    let str = T.v + ' ' + T.magenta + progname + T.reset + ' started at ' + T.magenta + started + T.reset + ' ' + T.v + '\n'
    const top = T.dr + ''.padStart(len, T.h) + T.dl + '\n'
    const bot = T.ur + ''.padStart(len, T.h) + T.ul + '\n'
    console.log(top+str+bot)
}
