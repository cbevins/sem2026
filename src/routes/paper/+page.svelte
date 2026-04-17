<script>
    import { onMount } from "svelte"
    import pkg from 'paper'
    const {paper} = pkg
    
    let width = $state(100)
    let height = $state(100)
    let canvasElement, ctx

    function addCircle() {
        const circle = new paper.Path.Circle({
            center: [50, 50], radius: 40, fillColor: 'red'})
        paper.view.draw()
        readImageData()
    }

    function addLine() {
        var path = new paper.Path()
        path.strokeColor = 'black'
        var start = new paper.Point(10, 10)
        path.moveTo(start)
        path.lineTo(90, 90)
        paper.view.draw()
    }

    function readImageData() {
        const imageData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height)
        const red = new Array(256).fill(0)
        const blu = new Array(256).fill(0)
        const grn = new Array(256).fill(0)
        const data = imageData.data
        for(let i=0; i<data.length; i++) {
            red[data[i]]++
            blu[data[i+1]]++
            grn[data[i+2]]++
        }
        const freq = []
        for(let i=0; i<256; i++) {
            freq.push({red: red[i], blue: blu[i], green: grn[i]})
        }
        console.table(freq)
    }

    function canvasAction(node) {
        // Initialize paper on the canvas element
        paper.setup(node);  // or paper.setup(canvasElement) if using onMount()
        addCircle()
        // addLine()
        return {
            destroy() {
                // Clean up when the element is removed
                paper.project.clear();
                paper.project.remove();
            }
        };
    }
    onMount(() => {
        console.clear()
        ctx = canvasElement.getContext("2d", { willReadFrequently: true })
        paper.setup(canvasElement)
        addCircle()
    })
</script>

<div class='mt-4 ml-4 px-4 border'>
    <div class='ml-4 text-2xl'>Paper.js Explorations</div>
    
    <canvas  class='mt-4 ml-4 border'
        id="paperCanvas"
        bind:this={canvasElement}
        width={width} height={height}>
    </canvas>
</div>
