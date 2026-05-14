<script>
    // FireCanvas component simply loops to get and display an updated fireMap from some 'mapper'
    // It knows NOTHING about the FireMap except how to draw it onto the <canvas>
    import { onMount } from 'svelte'
    import { drawBackground, drawCentralAxis, drawFireMap } from './index.js'

    // 'mapper' is a class with the following methods:
    //  - narrative = mapper.getTitle()
    //  - title = mapper.getNarrative()
    //  - fireMap = mapper.refreshFireMap()
    let {mapper, width=512, height=512} = $props()
    let first = $state(true)
    let clickPos = $state({x:0, y:0})
    let fireMap = $derived(mapper.fireMap)
    let narrative = $derived(mapper.getNarrative())

    // timing stats
    let running = $state(false)
    let times = $state({updates: 0, msec: 0, ups: 0})

    // Bind canvasElement variable to the <canvas> element
    let canvasElement, ctx, animId

    function clicked(e) {
        clickPos = {x: e.offsetX, y: e.offsetY}
        if (! running) draw()
    }

    function collectTimes(started) {
        const msec = times.msec + (new Date() - started)
        const updates = times.updates + 1
        const ups = Math.round(100*updates/(msec/1000))/100
        times = {updates, msec, ups}
    }

    function draw() {
        const started = new Date()
        const result = (first) ? fireMap : mapper.refreshFireMap()
        narrative = mapper.getNarrative()
        if (! result) { // if no more cells to burn
            running = false
        } else {
            fireMap = result
        }
        drawBackground(ctx)
        drawFireMap(ctx, fireMap)
        drawCentralAxis(ctx)
        if (running) animId = window.requestAnimationFrame(draw)
        if (!first) collectTimes(started)
        first = false
    }

    onMount(() => {
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        draw()
    })

    function reset() {
        fireMap = mapper.init()
        first = true
        times = {updates: 0, msec: 0, ups: 0}
        draw()
    }

    function runpause() {
        if (running) {  // then pause
            window.cancelAnimationFrame(animId)
        } else {        // then start running
            animId = window.requestAnimationFrame(draw)
            times = {updates: 1, msec: 0, ups: 0}
        }
        running = ! running
    }
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>{mapper.getTitle()}</div>
    <div class='ml-4 mb-2 text-xs'>{narrative}</div>
    <div class='mt-4 ml-4 text-lg'>
        <button class='border rounded' onclick={clicked}>Step</button>
        <button class='border rounded' onclick={reset}>Reset</button>
        <button class='border rounded' onclick={runpause}>{running?'Pause':'Animate'}</button>
        <span class='px-1 text-sm'>{times.updates} Updates in {times.msec} msec ({times.ups} ups)
        </span>
    </div>
    <div class='ml-4 text-lg'>Last click at [{clickPos.x}, {clickPos.y}]</div>
    <canvas class='mt-4 ml-4 border' 
        bind:this={canvasElement} onclick={clicked} width={width} height={height}>
    </canvas>
</div>
