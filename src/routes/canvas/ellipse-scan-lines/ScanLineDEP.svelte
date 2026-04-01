<script>
    // Draws a fire ellipse with psi tic marks
    import { onMount } from 'svelte'
	import { fireEllipse } from '../fireEllipse.js';
    import { gxmlFireEllipse, gxmlPerimTics, gxmlText, gxmlFireEllipseSvg } from '../gxmlFireEllipse.js'
    import { scanEllipse } from '../scanEllipse.js'

    let {radius='250', headRos='115.31', lwr='3.2', ignX='0', ignY='0', headDeg='0', minutes='1'} = $props()
    radius = parseFloat(radius)
    headRos= parseFloat(headRos)
    lwr = parseFloat(lwr)
    ignX = parseFloat(ignX )
    ignY = parseFloat(ignY)
    headDeg = parseFloat(headDeg)
    minutes = parseFloat(minutes)

    let thetaEls = $state([])
	let beta = $state(0)
    let actual = fireEllipse(headRos, lwr, ignX, ignY, headDeg, minutes, beta) 
    // Clone the ellipse scaled with an elapsed time to fill 90% the axis length
    let tscale = minutes * 0.9 * radius / actual.fDist / 2
    let ellipse = fireEllipse(headRos, lwr, ignX, ignY, headDeg, tscale, beta) 
    onMount( () => {
        const interval = setInterval(() => {
            headDeg = headDeg + 5
            if (headDeg >= 360) headDeg = 0

            // Create a new ellipse from scratch
            actual = fireEllipse(headRos, lwr, ignX, ignY, headDeg, minutes, beta) 
            // Clone the ellipse scaled with an elapsed time to fill 90% the axis length
            tscale = minutes * 0.9 * radius / actual.fDist / 2
            ellipse = fireEllipse(headRos, lwr, ignX, ignY, headDeg, tscale, beta) 
            // Get gxml array with the fire ellipse axis and perimeter and the psi angle ticks
            // This drawing uses regular theta angle increments
            thetaEls = gxmlFireEllipse(ellipse, radius)
            thetaEls = gxmlPerimTics(ellipse, thetaEls, 'theta')
            thetaEls.push(gxmlText(10, -200, 'black',`Heading ${headDeg}&deg;`))
            thetaEls.push(gxmlText(10, -180, 'black', `Head at [${ellipse.headX.toFixed(2)}, ${ellipse.headY.toFixed(2)}]`))

            let lines = scanEllipse(ellipse, 10, 'h')
            for(let pts of lines) {
                thetaEls.push({el:'line', stroke: 'red',
                    x1: pts[0].x, y1: pts[0].y, x2: pts[1].x, y2: pts[1].y})
            }
            lines = scanEllipse(ellipse, 10, 'v')
            for(let pts of lines) {
                thetaEls.push({el:'line', stroke: 'red',
                    x1: pts[0].x, y1: pts[0].y, x2: pts[1].x, y2: pts[1].y})
            }
            // svg built-in ellipse
            // thetaEls.push({el:'ellipse', cx: ellipse.gDist, cy: 0, rx: ellipse.fDist, ry: ellipse.hDist,
            //     stroke:'red', fill: 'none', transform: `rotate(${headDeg})`})
		}, 1000)
	})

</script>
<div class='ml-5 text-lg'>Theta at 5&deg; Angles</div>
<div class='ml-5 text-lg'>Theta at 5&deg; Angles</div>
<div class='ml-5 text-lg'>Ellipse L/W = {ellipse.length.toFixed(2)} / {ellipse.width.toFixed(2)}
    = {ellipse.lwr.toFixed(2)}</div>
{@html gxmlFireEllipseSvg(radius, thetaEls)}