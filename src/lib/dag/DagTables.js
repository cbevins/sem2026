import {tableStr} from '../utils/terminal.js'

export function nodeTableStr(nodes, title='') {
    const headers = ['Full Key', 'Status', 'Dirty', 'Value', 'Units', 'Updater']
    const data = []
    for(let node of nodes) {
        let args = []
        for(let supplier of node.suppliers) args.push(supplier.fullKey())
        data.push([node.fullKey(), node.status, node.dirty, node.value.toString(), node.units.uom[0],
            `${node.updater.name}(${args.join(', ')})`])
    }
    return tableStr(data.sort(), headers, title)
}

export function activeInputNodesTable(root, title='Active Input Nodes') {
    console.log(nodeTableStr(root.activeInputNodes(), title))
}

export function inputNodesTable(root, title='Active Input Nodes') {
    console.log(nodeTableStr(root.inputNodes(), title))
}

export function allNodesTable(root, title='All Nodes') {
    console.log(nodeTableStr(root.nodes(), title))
}

export function selectedNodesTable(root, title='Selected Nodes') {
    console.log(nodeTableStr(root.selectedNodes(), title))
}
