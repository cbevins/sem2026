<script>
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import {GenericTable} from '$lib/svelte/GenericTable.svelte'
    import {DagNodeTable} from '$lib/dag/DagNodeTable.svelte'
    
    let lwr = $state(2)
    let headDeg = $state(0)
    let headRos = $state(1)
    let time = $state(1)
    let deg = $state(15)

    // Create FireEllipseMod and select nodes
    const e = new FireEllipseMod('e')
    e.setConsumers()
    e.theta.perim.head.x.select()

    const {beta, psi, theta} = e
    for(let v of [beta, psi, theta]) {
        for(let node of [v.perim.head.x, v.perim.head.y, v.beta, v.psi, v.theta]) {
            node.select()
        }
    }

    // Get and set required inputs
    const inputNodes = e.sortNodes(e.activeInputNodes())
    e.head.angle.north.set(headDeg)
    e.head.ros.set(headRos)
    e.lwr.set(lwr)
    e.time.set(time)

    const activeInputNodes = e.sortNodes(e.activeInputNodes())
    const selectedNodes = e.sortNodes(e.selectedNodes())
    const activeNodes = e.sortNodes(e.activeNodes())

    // Determine perimeter points at 'deg' degree intervals of beta, theta, and psi
    const betaPts = []
    const psiPts = []
    const thetaPts = []
    function fmt(node) {return node.value.toFixed(2) }
    for(let i=0; i<=360; i+=deg) {
        beta.angle.north.set(i)
        psi.angle.north.set(i)
        theta.angle.north.set(i)
        e.updateAll()
        betaPts.push([i, fmt(beta.perim.head.x), fmt(beta.perim.head.y), fmt(beta.beta), fmt(beta.psi), fmt(beta.theta)])
        psiPts.push([i, fmt(psi.perim.head.x), fmt(psi.perim.head.y), fmt(psi.beta), fmt(psi.psi), fmt(psi.theta)])
        thetaPts.push([i, fmt(theta.perim.head.x), fmt(theta.perim.head.y), fmt(theta.beta), fmt(theta.psi), fmt(theta.theta)])
    }
    const headers = ['Deg', 'Head X', 'Head Y', 'Beta', 'Psi', 'Theta']
</script>

<div class='ml-4'>
    {@render DagNodeTable('Selected Nodes', selectedNodes)}
    {@render DagNodeTable('Active Input Nodes', activeInputNodes)}
    {@render DagNodeTable('Active Nodes', activeNodes)}

    <div class='text-xl text-center'>FireEllipseMod</div>
    {@render GenericTable(betaPts, headers, `Beta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(thetaPts, headers, `Theta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(psiPts, headers, `Psi Perimeter at ${deg}-deg Intervals`)}
</div>