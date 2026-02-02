<script>
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import {DagNodeTable} from '$lib/dag/DagNodeTable.svelte'
    let {items} = $props()
    let lwr = $state(2)
    let headDeg = $state(0)
    let headRos = $state(1)
    let time = $state(1)
    let beta = $state(45)
    let theta = $state(90)
    let psi = $state(45)

    const e = new FireEllipseMod('e')
    e.setConsumers()
    for(let v of [e.head, e.back, e.left, e.right, e.beta, e.theta, e.psi]) {
        // for(let node of [v.vhr, v.ros, v.dist, v.perim.head.x, v.perim.head.y, v.perim.geo.east, v.perim.geo.west]) {
        for(let node of [v.vhr, v.ros, v.dist, v.perim.head.x, v.perim.head.y]) {
            node.select()
        }
    }
    e.beta.angle.north.set(beta)
    e.head.angle.north.set(headDeg)
    e.head.ros.set(headRos)
    e.lwr.set(lwr)
    e.psi.angle.north.set(psi)
    e.theta.angle.north.set(theta)
    e.time.set(time)
    e.updateAll()
    const active = e.sortNodes(e.selectedNodes())

</script>

<div class='text-xl'>FireEllipseMod</div>

{@render nodeTable('Active Nodes', active)}