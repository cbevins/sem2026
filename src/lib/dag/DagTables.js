import {table} from '../utils/terminal.js'

export function dump(node) {
    const a = []
    for(let p of node.suppliers) a.push(p.fullKey())

    let str = `'${node.fullKey()}' value = ${node.value} ${node.units.uom[0]} (${node.units.label})\n`
    str += `    updater ${node.updater.name}(${a.join(', ')})\n`
    str += `    dirty=${node.dirty}, status=${node.status}`
    console.log(str)
}

export function nodeTable(nodes, title='') {
    const headers = ['Full Key', 'Status', 'Dirty', 'Value', 'Units', 'Updater']
    const data = []
    for(let node of nodes) {
        let args = []
        for(let supplier of node.suppliers) args.push(supplier.fullKey())
        data.push([node.fullKey(), node.status, node.dirty, node.value.toString(), node.units.uom[0],
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
