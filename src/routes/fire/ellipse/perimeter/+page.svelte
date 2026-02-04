<script>
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import {GenericTable} from '$lib/svelte/GenericTable.svelte'
    import {DagNodeTable} from '$lib/dag/DagNodeTable.svelte'
    import {nodesTable} from '$lib/dag/DagTables.js'
    let lwr = $state(2)
    let headDeg = $state(45)
    let headRos = $state(1)
    let time = $state(100)
    let deg = $state(15)

    // NOTE 1 - For theta or psi perimeter pts, call betaPerimeterPt with theta.beta or psi.beta
    // Create FireEllipseMod and select nodes
    let src='north'  // 'head' or 'north'
    const e = new FireEllipseMod('e', src)
    if (src==='head') e.configVectorInputFromHead(); else e.configVectorInputFromNorth();
    e.setConsumers()

    const {beta, psi, theta, center, ignition} = e
    for(let v of [beta, psi, theta]) {
        for(let node of [v.vhr, v.perim.head.x, v.perim.head.y, v.beta, v.psi, v.theta]) {
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
    function fmt(node) { return node.value.toFixed(2) }
    // REMEMBER - THESE ARE DEGREES FROM ***NORTH***, NOT HEAD
    for(let i=0; i<=360; i+=deg) {
        beta.angle[src].set(i)
        psi.angle[src].set(i)
        theta.angle[src].set(i)
        e.updateAll()
        betaPts.push([i, fmt(beta.perim.head.x), fmt(beta.perim.head.y), fmt(beta.beta), fmt(beta.psi), fmt(beta.theta), fmt(beta.vhr)])
        psiPts.push([i, fmt(psi.perim.head.x), fmt(psi.perim.head.y), fmt(psi.beta), fmt(psi.psi), fmt(psi.theta), fmt(psi.vhr)])
        thetaPts.push([i, fmt(theta.perim.head.x), fmt(theta.perim.head.y), fmt(theta.beta), fmt(theta.psi), fmt(theta.theta), fmt(theta.vhr)])
    }
    const beta0 = betaPts[0]
    const theta0 = thetaPts[0]
    console.log('theta at 0 deg:', theta0)
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
    console.log('scale',scope.scale(), 'zoom=', scope.zoom)
    console.log('west=',scope.west(), 'east=',scope.east())
    console.log('north=',scope.north(), 'south=',scope.south())
    console.log('geo [0,0] is [x,y]', scope.x(0), scope.y(0))
    console.log('geo [50,50] is [x,y]', scope.x(50), scope.y(50))
    console.log('ellipse center is', center.head.x.value, center.head.y.value)
</script>

<div class='ml-4 mt-4 mb-4'>
    <svg width={scope.view.width} height={scope.view.height}>
        <rect width={scope.view.width} height={scope.view.height} fill='green'/>
        <!-- Grid axis -->
        <line x1=0 y1={scope.view.height/2} x2={scope.view.width} y2={scope.view.height/2} stroke='black'/>
        <line x1={scope.view.width/2} y1=0 x2={scope.view.width/2} y2={scope.view.height} stroke='black'/>
        <!-- geo[50,0] -->
        {#each betaPts as [deg, e, n, b, p, t]}
            <circle cx={scope.x(e)} cy={scope.y(n)} r=3 fill='red'/>
        {/each}
        {#each thetaPts as [deg, e, n, b, p, t]}
            <circle cx={scope.x(e)} cy={scope.y(n)} r=2 fill='yellow'/>
        {/each}
        {#each psiPts as [deg, e, n, b, p, t]}
            <!-- {console.log('psi deg', deg, e, n)} -->
            <circle cx={scope.x(e)} cy={scope.y(n)} r=1 fill='blue'/>
        {/each}
        <!-- Center pt and line to theta at 0 degrees north -->
        <circle cx={scope.x(center.head.x.value)} cy={scope.y(center.head.y.value)} r=2 fill='yellow'/>
        <line x1={scope.x(center.head.x.value)} y1={scope.y(center.head.y.value)}
              x2={scope.x(theta0[1])} y2={scope.y(theta0[2])} stroke='yellow'/>
        <circle cx={scope.x(theta0[1])} cy={scope.y(theta0[2])} r=4 fill='yellow'/>

        <circle cx={scope.x(ignition.head.x.value)} cy={scope.y(ignition.head.y.value)} r=2 fill='red'/>
        <line x1={scope.x(ignition.head.x.value)} y1={scope.y(ignition.head.y.value)}
              x2={scope.x(beta0[1])} y2={scope.y(beta0[2])} stroke='red'/>
        <circle cx={scope.x(beta0[1])} cy={scope.y(beta0[2])} r=3 fill='red'/>
    </svg>
</div>
<div class='ml-4'>
    {@render DagNodeTable('Selected Nodes', selectedNodes)}
    {@render DagNodeTable('Active Input Nodes', activeInputNodes)}
    {@render DagNodeTable('Active Nodes', activeNodes)}

    <div class='text-xl text-center'>FireEllipseMod</div>
    {@render GenericTable(betaPts, headers, `Beta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(thetaPts, headers, `Theta Perimeter at ${deg}-deg Intervals`)}
    {@render GenericTable(psiPts, headers, `Psi Perimeter at ${deg}-deg Intervals`)}
</div>