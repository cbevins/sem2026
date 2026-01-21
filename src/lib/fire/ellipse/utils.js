export function dump(node) {
    const a = []
    for(let p of node.suppliers) a.push(p.fullKey())

    let str = `'${node.fullKey()}' value = ${node.value} ${node.units.uom[0]} (${node.units.label})\n`
    str += `    updater ${node.updater.name}(${a.join(', ')})\n`
    str += `    dirty=${node.dirty}, status=${node.status}`
    console.log(str)
}

export function table(rows, title=null) {
    const width = []
    for(let col=0; col<rows[0].length; col++) width[col] = 0
    for(let row of rows) {
        for(let col=0; col<row.length; col++)
            width[col] = Math.max(width[col], row[col].length)
    }
    let fullwidth = 1
    for(let col=0; col<width.length; col++) fullwidth += (width[col]+3)

    let str = title ? title+'\n' : ''
    str += ''.padStart(fullwidth,'-') + '\n'
    for(let row of rows) {
        str += '| '
        for(let col=0; col<row.length; col++) {
            str += row[col].padEnd(width[col]+1) + '| '
        }
        str += '\n'
    }
    str += ''.padStart(fullwidth,'-') + '\n'
    return str
}

export function nodeTable(mod) {
    const a = [['Full Key', 'Status', 'Dirty', 'Value', 'Updater']]
    for(let node of mod.nodes()) {
        let args = []
        for(let supplier of node.suppliers) args.push(supplier.fullKey())
        a.push([node.fullKey(), node.status, node.dirty, node.value.toString(),
            `${node.updater.name}(${args.join(', ')})`])
    }
    return table(a.sort())
}
