/* eslint-disable svelte/no-at-html-tags */
<script>
    import { onMount } from 'svelte'
    import {GlowButton as Button} from '$lib/index.js'
    // Uses the same [0,0] origin PCS as FireGrowth01
    import {FireGrowth01Pcs} from './FireGrowth01Pcs.js'
    // But uses its own Model, View, and Text
    import {FireGrowth02Model} from './FireGrowth02Model.js'
    import {FireGrowth02View} from './FireGrowth02View.js'
    import FireGrowth02Text from './FireGrowth02Text.svelte'

    //--------------------------------------------------------------------------
    // View controller state and handlers
    //--------------------------------------------------------------------------
    
    let svgWidth = $state(500)
    let svgHeight = $state(500)
    let svgLevel = $state(0)
    let uppLevel = $state(1)
    let unitsPerPixel = $state(1)
    let degStep = $state(15)

    function doubleSvg() {
        svgLevel = svgLevel + 1
        svgWidth = 2 * svgWidth
        svgHeight = 2 * svgHeight
    }
    function halveSvg() {
        svgLevel = svgLevel - 1
        svgWidth = svgWidth / 2
        svgHeight = svgHeight / 2
    }
    function halveUpp() {
        uppLevel = uppLevel + 1
        unitsPerPixel = unitsPerPixel / 2
    }
    function doubleUpp() {
        uppLevel = uppLevel - 1
        unitsPerPixel = 2 * unitsPerPixel
    }

    //--------------------------------------------------------------------------
    // Animation controller state and handlers
    //--------------------------------------------------------------------------
    
    let animation = $state('waiting') // 'waiting', 'running', 'paused', finished'
    let animButton = $state('Run')
    let speed = $state(1000)  // msec
    let frame = $state(0)
    const frames = 6 * 5    // 6 phases over 4 time steps
    function pause() { 
        if (frame===frames) frame = 0
        if (animation === 'running') {
            animation = 'paused'
            animButton = 'Resume'
        } else { // if (animation === 'waiting' || animation === 'paused' || animation === 'finished') {
            animation = 'running'
            animButton = 'Pause'
        }
    }
    function faster() {
        speed = speed / 2
        startLoop()
    }
    function slower() {
        speed = 2* speed
        startLoop()
    }
    function runFrame() {
        if (animation === 'running') {
            if (frame < frames) {
                frame = frame + 1
            } else {
                animation = 'finished'
                animButton = 'Run Again'
            }
        }
    }
    let intervalId = null
    function startLoop() {
        // Clear any existing interval before starting a new one
        if (intervalId) clearInterval(intervalId)
        intervalId = setInterval(runFrame, speed)
    }
	onMount(() => {
        startLoop()
		return () => {clearInterval(intervalId)}
	})
    
    //--------------------------------------------------------------------------
    // Model & View - uses controller state to change Model and any of its Views
    //--------------------------------------------------------------------------

    let pcs = $derived(new FireGrowth01Pcs(svgWidth, svgHeight, unitsPerPixel))
    let model = $derived(new FireGrowth02Model(200, 50, degStep, 0, 0))
    let view = $derived(new FireGrowth02View(pcs, model, frames))
    let content = $derived(view.content(degStep, frame))
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        Huygen's Principle Applied to a Point Ignition Fire under Uniform Conditions
    </div>
    <FireGrowth02Text/>
    <div class='mt-4 border rounded'>
        <div class='mx-2 my-2 py-1 border rounded'>
            <div class='ml-2 mt-1'>
                <Button label="Zoom In (2*SVG)" handler={doubleSvg}/>
                <Button label='Zoom Out (2*SVG/2)' handler={halveSvg}/>
                <span>Current Zoom Level {svgLevel}</span>
            </div>
            <div class='ml-2 mt-1'>
                <Button label='Halve Upp' handler={halveUpp}/>
                <Button label='Double Upp' handler={doubleUpp}/>
                <span>Units per pixel: {unitsPerPixel}</span>
                <span class='text-xs'>(&lt;- Not very useful without pan controls)</span>
            </div>
            
            <div class='ml-2 mt-1'>
                <Button label={animButton} handler={pause}/>
                <Button label='Faster' handler={faster}/>
                <Button label='Slower' handler={slower}/>
                <span>Frame {frame}/{frames} at {1000/speed} fps</span>
            </div>
        </div>
        <div class="w-lg h-128 overflow-auto border border-gray-400">
            <svg width={view.svg.width} height={view.svg.height} viewBox='{view.viewbox()}'>
                {@html content}
            </svg>
        </div>
    </div>
</div>
