import * as T from './terminal.js'

export function startBannerStr() {
    const progname = process.argv[1].split('\\').pop()
    const started = new Date().toLocaleString()
    const len = progname.length + started.length + 14
    let str = T.v + ' ' + T.magenta + progname + T.reset + ' started at ' + T.magenta + started + T.reset + ' ' + T.v + '\n'
    const top = T.dr + ''.padStart(len, T.h) + T.dl + '\n'
    const bot = T.ur + ''.padStart(len, T.h) + T.ul + '\n'
    return top+str+bot
}
export function startBanner() {console.log(startBannerStr())}
