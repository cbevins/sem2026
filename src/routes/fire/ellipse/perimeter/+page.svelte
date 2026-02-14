<script>
    import {DagNodeTable, Expand, GenericTable, SvgEvent} from '$lib/index.js'
    import {FireEllipseMod} from '$lib/fire/ellipse/FireEllipseMod.js'
    import * as FE from '$lib/fire/lib/FireEllipseLib'
    import { perimeterPoints } from './perimeterPoints.js'
    import {PerimeterViewport} from './PerimeterViewport.js'

    let lwrInput = 2
    let headDegInput = 0
    let headRosInput = 1
    let timeInput = 100
    let deg = 5

    // Create a FireEllipseMod with beta-psi-theta vector angle from 'head' and ready()
    let src='head'  // 'head' or 'north'
    const e = new FireEllipseMod('e', src).ready()
    const {beta, center, f, h, head, ignition, length, lwr, psi, theta, time} = e
    for(let v of [beta, psi, theta]) {
        for(let node of [v.perim.head.x, v.perim.head.y, v.beta, v.psi, v.theta, v.vhr])
            node.select()
    }
    center.head.x.select()
    center.head.y.select()
    f.dist.select()
    h.dist.select()
    length.dist.select()

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
    const betaPts = perimeterPoints(e, beta, deg, src)
    const psiPts = perimeterPoints(e, psi, deg, src)
    const thetaPts = perimeterPoints(e, theta, deg, src)
    const headers = ['Deg', 'Head X', 'Head Y', 'Beta', 'Psi', 'Theta', 'Vhr', 'Length']
    
    // PerimeterViewport is a class that draws the image and maintains its state
    // We only need to specify the SVG width, height here,
    // and let the Viewport-derived class define all the other properties
    let demo = new PerimeterViewport(400, 400, length.dist.get(),
        thetaPts, psiPts, betaPts,  // perimeter pt arrays
        ignition.head.x.value, ignition.head.y.value,   // ignition pt
        center.head.x.value, center.head.y.value,   // center pt
        true, true, true)   // show theta, psi, beta

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
    <div class='text-xl'>Fire Ellipse Perimeter Example 1</div>
    <div class='text-normal'>
        Example using FireEllipseMod to determine the ellipse perimeter points
        plotted at uniform intervals of {deg} degrees of beta (red), theta (yellow),
        or psi (blue) from '{src}'.  SvgScope is used to display the ellipse
        in either a Cartesian or geographic coordinate system.
    </div>

    <div class='ml-4 mt-4'>
        <SvgEvent creator={demo} keyable={true} mousable={true}/>
    </div>
</div>

<div class='ml-4 mt-2'>
    <Expand title='Perimeter Estimates'>
        {@render GenericTable(perimTable, ['Method', 'Perim'])}
    </Expand>
</div>

<div class='ml-4 mt-2'>
    <Expand title='Selected Nodes'>
        {@render DagNodeTable('Selected Nodes', selectedNodes)}
    </Expand>
</div>

<div class='ml-4'>
    <Expand title='Active Input  Nodes'>
        {@render DagNodeTable('Active Input Nodes', activeInputNodes)}
    </Expand>
</div>

<div class='ml-4'>
    <Expand title='All Active Nodes'>
        {@render DagNodeTable('Active Nodes', activeNodes)}
    </Expand>
</div>

<div class='text-xl text-center'>FireEllipseMod</div>
<div class='ml-4'>
    <Expand title='Perimeter at {deg}-deg Beta Intervals'>
        {@render GenericTable(betaPts, headers, `Perimeter at ${deg}-deg Beta Intervals`)}
    </Expand>
</div>
<div class='ml-4'>
    <Expand title='Perimeter at {deg}-deg Theta Intervals'>
        {@render GenericTable(thetaPts, headers, `Perimeter at ${deg}-deg Theta Intervals`)}
    </Expand>
</div>
<div class='ml-4'>
    <Expand title='Perimeter at ${deg}-deg Psi Intervals'>
        {@render GenericTable(psiPts, headers, `Perimeter at ${deg}-deg Psi Intervals`)}
    </Expand>
</div>