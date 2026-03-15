<script lang="ts">
    import { onMount } from "svelte";
    import MenuPage from "$lib/svelte/MenuPage.svelte"
    let title = 'SEM2006 Svelte Components'
    let items = [{
        route: '#',
        title: 'Svelte Components',
        brief: 'Svelte components and utility demos will go here!'
    }]

    // Bind this variable to the canvas element
    let canvasElement: HTMLCanvasElement;
    let ctx

    onMount(() => {
        // Get the canvas context
        ctx = canvasElement.getContext("2d")
        ctx.fillStyle = "black"    // 0, 0, 0, 255
        ctx.fillRect(0, 0, 100, 100)
        ctx.fillStyle = "white"    // 255, 255, 255, 255
        ctx.fillRect(10, 10, 80, 80)
        for(let pixel of [5,50]) {
            const imageData = ctx.getImageData(pixel, pixel, 1, 1)
            const [r,g,b,a] = imageData.data
            // RGB values range 0-255, A values range (0=transparent, 255=opaque)
            console.log(`[${pixel},${pixel}] = R ${r}, G ${g}, B ${b} A ${a}`);   // 0-255
            console.log('ImageData.data', imageData.data)
        }
    })
    function draw01(ctx) {
        ctx.beginPath();
        ctx.moveTo(10, 10); // line will start here
        ctx.lineTo(10, 110); // line ends here
        ctx.lineTo(110, 110); // line ends here
        ctx.lineTo(110, 10); // line ends here
        ctx.lineTo(10, 10); // line ends here
        ctx.stroke(); // draw it

    }
    function drawSquares(ctx) {
        ctx.fillRect(25, 25, 100, 100);
        ctx.clearRect(45, 45, 60, 60);
        ctx.strokeRect(50, 50, 50, 50);
    }
</script>

<MenuPage {items} {title}/>
<canvas bind:this={canvasElement} width={300} height={150}></canvas>