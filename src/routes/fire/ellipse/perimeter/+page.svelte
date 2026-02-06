<script>
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import {GenericTable} from '$lib/svelte/GenericTable.svelte'
    import {DagNodeTable} from '$lib/dag/DagNodeTable.svelte'
    import {nodesTable} from '$lib/dag/DagTables.js'
    import * as FE from '$lib/fire/lib/FireEllipseLib'

    let lwrInput = 2
    let headDegInput = 45
    let headRosInput = 1
    let timeInput = 100
    let deg = 5
    let showBetaPerim = true
    let showPsiPerim = true
    let showThetaPerim = true

    // Create a FireEllipseMod with beta-psi-theta vector angle from 'head' and ready()
    let src='head'  // 'head' or 'north'
    const e = new FireEllipseMod('e', src).ready()
    const {beta, center, f, h, head, ignition, lwr, psi, theta, time} = e
    for(let v of [beta, psi, theta]) {
        for(let node of [v.perim.head.x, v.perim.head.y, v.beta, v.psi, v.theta, v.vhr])
            node.select()
    }
    center.head.x.select()
    center.head.y.select()
    f.dist.select()
    h.dist.select()

    // Get and set required inputs
    const inputNodes = e.sortNodes(e.activeInputNodes())
    head.angle.north.set(headDegInput)
    head.ros.set(headRosInput)
    lwr.set(lwrInput)
    time.set(timeInput)

    // Get lists of active inputs, selected nodes, and active nodes
    const activeInputNodes = e.sortNodes(e.activeInputNodes())
    const selectedNodes = e.sortNodes(e.selectedNodes())
    const activeNodes = e.sortNodes(e.activeNodes())

    // Determine perimeter points at 'deg' degree intervals of beta, theta, and psi
    const betaPts = perimeterPoints(e, beta, src, deg)
    const psiPts = perimeterPoints(e, psi, src, deg)
    const thetaPts = perimeterPoints(e, theta, src, deg)
    
    function  perimeterPoints(e, vector, src, deg) {
        function fmt(node) { return node.value.toFixed(8) }
        const pts = []
        let len = 0
        let lastX = 0
        let lastY = 0
        for(let i=0; i<=360; i+=deg) {
            vector.angle[src].set(i)
            e.updateAll()
            // Determine segment length and cumulative perimeter length
            if (i) {
                const dx = vector.perim.head.x.value - lastX
                const dy = vector.perim.head.y.value - lastY
                const dl = Math.sqrt(dx*dx + dy*dy)
                len += dl
            }
            pts.push([i, fmt(vector.perim.head.x), fmt(vector.perim.head.y),
                fmt(vector.beta), fmt(vector.psi), fmt(vector.theta), fmt(vector.vhr),
                len.toFixed(8)])
            lastX = vector.perim.head.x.value
            lastY = vector.perim.head.y.value
        }
        return pts
    }

    const beta0 = betaPts[0]
    const theta0 = thetaPts[0]
    const headers = ['Deg', 'Head X', 'Head Y', 'Beta', 'Psi', 'Theta', 'Vhr']

    const scope = {
        view: {width: 400, height: 400},
        // view center point in user units (ft)
        center: {east: 0, north: 0},
        // scale at each level where 1 pixel = n user units (ft)
        zooms: [0.25, 0.50, 1, 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096],
        // Given the above scale, set initial zoom to level 3, where 1 pixel = 2 ft
        zoom: 2,
        scale: function() { return this.zooms[this.zoom] },
        east: function() { return this.center.east + this.scale() * this.view.width/2},
        west: function() { return this.center.east - this.scale() * this.view.width/2},
        north: function() { return this.center.north + this.scale() * this.view.height/2},
        south: function() { return this.center.north - this.scale() * this.view.height/2},
        x: function(east) { return (east - this.west()) * this.scale()},
        y: function(north) { return (this.north() - north) * this.scale()},
    }

    // Perimeter table
    const perimTable = [
        [`${deg}-deg beta intervals`, betaPts[betaPts.length-1][7]],
        [`${deg}-deg theta intervals`, thetaPts[thetaPts.length-1][7]],
        [`${deg}-deg psi intervals`, psiPts[psiPts.length-1][7]],
        ['10k numerical integration', FE.perimeterNumericalIntegration(e.f.dist.value, e.h.dist.value).toFixed(8)],
        ['Ramanujan method', FE.perimeterRamanujan(e.f.dist.value, e.h.dist.value).toFixed(8)],
        ['Simple Approximation', FE.perimeterSimpleApprox(e.f.dist.value, e.h.dist.value).toFixed(8)],
    ]
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl'>Fire Ellipse Perimeter</div>
    <div class='text-normal'>
        Example using FireEllipseMod to determine the ellipse perimeter points
        plotted at uniform intervals of {deg} degrees of beta (red), theta (yellow),
        or psi (blue) from '{src}'.  SvgScope is used to display the ellipse
        in either a Cartesian or geographic coordinate system.
    </div>
    <svg width={scope.view.width} height={scope.view.height}>
        <rect width={scope.view.width} height={scope.view.height} fill='green'/>
        <!-- Grid axis -->
        <line x1=0 y1={scope.view.height/2} x2={scope.view.width} y2={scope.view.height/2} stroke='black'/>
        <line x1={scope.view.width/2} y1=0 x2={scope.view.width/2} y2={scope.view.height} stroke='black'/>
        <!-- perimeter points at beta intervals -->
        {#if showBetaPerim}
            {#each betaPts as [deg, e, n]}
                <circle cx={scope.x(e)} cy={scope.y(n)} r=3 fill='red'/>
            {/each}
            <!-- Line from ignition point to beta at 0 degrees from head -->
            <line x1={scope.x(ignition.head.x.value)} y1={scope.y(ignition.head.y.value)}
                x2={scope.x(beta0[1])} y2={scope.y(beta0[2])} stroke='red'/>
            <!-- Perimeter point for beta=0 (should be ellipse head) -->
            <circle cx={scope.x(beta0[1])} cy={scope.y(beta0[2])} r=3 fill='red'/>
        {/if}
        <!-- perimeter points at theta inetrvals -->
        {#if showThetaPerim}
            {#each thetaPts as [deg, e, n]}
                <circle cx={scope.x(e)} cy={scope.y(n)} r=2 fill='yellow'/>
            {/each}
            <!-- Line from ellipse center to theta at 0 degrees from head -->
            <line x1={scope.x(center.head.x.value)} y1={scope.y(center.head.y.value)}
                x2={scope.x(theta0[1])} y2={scope.y(theta0[2])} stroke='yellow' stroke-width=3/>
            <!-- Perimeter point for theta=0 (should be ellipse head) -->
            <circle cx={scope.x(theta0[1])} cy={scope.y(theta0[2])} r=4 fill='yellow'/>
        {/if}
        <!-- perimeter points at psi inetrvals -->
        {#if showPsiPerim}
            {#each psiPts as [deg, e, n]}
                <circle cx={scope.x(e)} cy={scope.y(n)} r=1 fill='blue'/>
            {/each}
        {/if}
        <!-- Ignition point is the Cartesian origin -->
        <circle cx={scope.x(ignition.head.x.value)} cy={scope.y(ignition.head.y.value)} r=4 fill='red'/>
        <!-- Ellipse center pt in Cartesian coords -->
        <circle cx={scope.x(center.head.x.value)} cy={scope.y(center.head.y.value)} r=3 fill='yellow'/>
    </svg>
</div>
<div class='ml-4'>
    {@render GenericTable(perimTable, ['Method', 'Perim'], `Perimeter Estimates`)}
    {@render DagNodeTable('Selected Nodes', selectedNodes)}
    {@render DagNodeTable('Active Input Nodes', activeInputNodes)}
    {@render DagNodeTable('Active Nodes', activeNodes)}

    <div class='text-xl text-center'>FireEllipseMod</div>
    {@render GenericTable(betaPts, headers, `Beta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(thetaPts, headers, `Theta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(psiPts, headers, `Psi Perimeter at ${deg}-deg Intervals`)}
</div>