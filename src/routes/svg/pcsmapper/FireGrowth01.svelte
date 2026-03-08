<script>
    import { onMount } from 'svelte'
    import {FireGrowth01Model} from './FireGrowth01Model.js'
    import {FireGrowth01Pcs} from './FireGrowth01Pcs.js'
    import {FireGrowth01View} from './FireGrowth01View.js'

    //--------------------------------------------------------------------------
    // View controller state and handlers
    //--------------------------------------------------------------------------
    
    let svgWidth = $state(500)
    let svgHeight = $state(500)
    let svgLevel = $state(0)
    let uppLevel = $state(1)
    let unitsPerPixel = $state(1)

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
    let frame = $state(0)
    let speed = $state(1000)
    const frames = 5
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
    let spreadRate = $state(10)
    let elapsedTime = $state(10)

    let pcs = $derived(new FireGrowth01Pcs(svgWidth, svgHeight, unitsPerPixel))
    let model = $derived(new FireGrowth01Model(spreadRate, elapsedTime))
    let view = $derived(new FireGrowth01View(pcs, model, frames))
    let content = $derived(view.content(frame))
</script>

<div class='ml-4 mt-4 mb-4'>
    <div class='text-xl border rounded bg-gray-300'>
        Fire Growth Model Version 0.01
    </div>
    <div class='mt-2 px-2 py-2 overflow-auto border rounded'>
        Fire growth under the simplest possible conditions of
        uniform fuel (load, particle size, packing, and moisture content)
        on level ground with no wind.
    </div>

    <div class='mt-4 border rounded'>
        {@render viewData(view)}
        <div class='mx-2 my-2 border rounded'>
            <div class='ml-2 mt-1'>
                Zoom Level {svgLevel}
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={doubleSvg}>Zoom In (2*SVG)</button>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={halveSvg}>Zoom Out (SVG/2)</button>
            </div>
            <div class='ml-2 mt-1'>
                Units per pixel: {unitsPerPixel}
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={halveUpp}>Halve Upp</button>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={doubleUpp}>Double Upp</button>
                <div class='text-xs'>(The above aren't that useful without pan controls)</div>
            </div>
            
            <div class='ml-2 mt-1'>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={pause}>{animButton}</button>
                Frame {frame} of {frames} at 1 frame per {speed} msec
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={faster}>Faster</button>
                <button class='px-2 mt-1 mb-1 border rounded text-md bg-blue-300'
                    onclick={slower}>Slower</button>
            </div>
        </div>

        <div class="w-lg h-128 overflow-auto border border-gray-400">
            <svg width={view.svg.width} height={view.svg.height} viewBox='{view.viewbox()}'>
                {@html content}
            </svg>
        </div>
    </div>
</div>

{#snippet viewData(v)}
    <div class='mx-2 mt-2 text-sm border rounded'>
        <div class='ml-4'>
            - SVG is {v.svg.width} x {v.svg.height}.
            Map is {v.bounds.width} x {v.bounds.height}.
            Focus point = [{v.focus.east} e, {v.focus.north} n].
        </div>
        <div class='ml-4'>- viewBox = '{v.viewbox()}'</div>
    </div>
{/snippet}
