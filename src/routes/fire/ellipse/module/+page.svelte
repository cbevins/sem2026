<script>
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import {DagNodeTable} from '$lib/dag/DagNodeTable.svelte'
	import { v } from '$lib/utils/terminal';
    
    let {items} = $props()
    let lwr = $state(2)
    let headDeg = $state(0)
    let headRos = $state(1)
    let time = $state(1)
    let beta = $state(0)
    let theta = $state(0)
    let psi = $state(0)

    // Get the FireEllipseMod and select everything
    const e = new FireEllipseMod('e')
    e.setConsumers()
    for(let v of [e.head, e.back, e.left, e.right, e.beta, e.theta, e.psi]) {
        for(let node of [v.angle.head, v.bearing, v.vhr, v.ros, v.dist,
            v.perim.head.x, v.perim.head.y, v.perim.geo.east, v.perim.geo.north,
            v.beta, v.psi, v.theta]) {
            node.select()
        }
    }
    for(let v of [e.f, e.g, e.h, e.length, e.width]) {
        for(let node of [v.dist, v.ros, v.vhr]) node.select()
    }
    for(let p of [e.center, e.ignition]) {
        for(let node of [p.head.x, p.head.y, p.geo.east, p.geo.north]) {
            node.select()
        }
    }
    e.size.select()
    e.perimeter.select()

    e.beta.bearing.set(beta)
    e.head.bearing.set(headDeg)
    e.head.ros.set(headRos)
    e.lwr.set(lwr)
    e.psi.bearing.set(psi)
    e.theta.bearing.set(theta)
    e.time.set(time)
    e.updateAll()
    const allNodes = e.sortNodes(e.nodes())
    const inputNodes = e.sortNodes(e.activeInputNodes())
    const selectedNodes = e.sortNodes(e.selectedNodes())
</script>

<div class='ml-4'>
    <div class='text-xl text-center'>FireEllipseMod</div>
    {@render DagNodeTable('Selected Nodes', selectedNodes)}
    {@render DagNodeTable('Active Input Nodes', inputNodes)}
    {@render DagNodeTable('All Nodes', allNodes)}
</div>