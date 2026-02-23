<script>
    import {DagNodeTable, EventfulSvg, Expand, GenericTable} from '$lib/index.js'
    import {ClassName, FileName, P} from '$lib/index.js'
	import { CoordinatesViewport } from './CoordinatesViewport.js'

    let width = $state(400)
    let height = $state(400)
    // World view -100 to 100
    let centerx = $state(0)
    let centery = $state(0)
    let upp = $state(0.5)
    let units = $state('ft')
    // Data originates as easting, northing
    let pairs = $state([
        [{e: 0, n: 0}, {e: 10, n: 80}],
        // [{e: 0, n: 0}, {e: -10, n: -80}],
        // [{e: 10, n: 80}, {e: 0, n: 0}],
    ])
    let points = $derived(makePoints(pairs))

    // dy = by - ay
    function angle(ax, ay, bx, by) {
        const deg = Math.atan2((by-ay), (bx-ax)) * 180 / Math.PI
        return (360 + deg) % 360
    }

    let angleData = angleTable()
    function angleTable() {
        const data = []
        const x1 = 0; const y1 = 0
        for(let p of [[50,50],[-50,50],[-50,-50],[50,-50],
            [10,80],[-10,80],[-10,-80],[-10,80]]) {
            let [x2,y2] = p
            const a = angle(x1, y1, x2, y2).toFixed(2)
            const b = bearing(x1, y1, x2, y2).toFixed(2)
            data.push({x1, y1, x2, y2, a, b})
        }
        return data
    }
    // 
    function bearing(ae, an, be, bn) {
        const deg = Math.atan2((be-ae), (bn-an)) * 180 / Math.PI
        return (360 + deg) % 360
    }
    
    function degrees(radians) { return radians * 180 / Math.PI }
    function radians(degrees) {return degrees * Math.PI / 180 }

    function makePoints(pairs) {
        const geo = []
        for(let i=0; i<pairs.length; i++) {
            let [p0, p1] = pairs[i]
            geo.push([
                {idx: i, pt: 0, e: p0.e, n: p0.n, x: p0.n, y: p0.e},
                {idx: i, pt: 1, e: p1.e, n: p1.n, x: p1.n, y: p1.e}])
        }
        // 'angle' is degrees counterclockwise between a horizontal line
        // passing through P0 and the line segment P0-P1
        // 'bearing' is degrees clockwise from between a vertical line
        // passing through P0 and the line segment P0-P1
        for(let i=0; i<geo.length; i++) {
            let [p0, p1] = geo[i]
            p0.a = angle(p0.e, p0.n, p1.e, p1.n)
            p0.b = angle(p0.n, p0.e, p1.n, p1.e)
            // Reflect
            p1.a = angle(p1.n, p1.e, p0.n, p0.e)
            p1.b = angle(p1.y, p1.x, p0.y, p0.x)
        }
        return geo
    }
    // Create a Viewport to display the perimeter
    let viewport = $derived(new CoordinatesViewport(
        width, height, points, centerx, centery, upp))
    let content = $derived(viewport.drawSvg(0))

    function handler(e) { if (viewport.handleEvent(e)) content = viewport.drawSvg() }

</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 text-2xl'>Fire Front Coordinate Systems</div>
        <P>Explores point and angle conversions between (1) projected geographic coordinate systems
            (used to display fire perimeters on the landscape) and
            (2) local mathematical Cartesian system as used to make fire perimeter calculations.
        </P>
</div>
<div class='ml-4 mt-4 mb-4'>
    <div class='ml-4 mt-4'>
        <EventfulSvg {width} {height} {content} {handler}/>
    </div>
</div>
    
    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Point Data'>
            <GenericTable data={points}/>
        </Expand>
    </div>
   
    <div class='ml-4 mt-2 mb-2'>
        <Expand title='Angle Table'>
            <GenericTable data={angleData}/>
        </Expand>
    </div>
