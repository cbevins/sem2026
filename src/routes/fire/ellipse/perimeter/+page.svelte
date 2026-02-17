<script>
    import PerimeterDemo1 from './PerimeterDemo1.svelte'
    let {lwRatio=2, bearing=135, headRos=1, elapsed=100, deg=5} = $props()
</script>

<div class='ml-4 mt-4 border rounded'>
    LW Ratio is {lwRatio} 
    <button onclick={() => lwRatio = Math.min(10, lwRatio+1)} class='border w-12 bg-gray-300'>+1</button>
    <button onclick={() => lwRatio = Math.max(1, lwRatio-1)} class='border w-12 bg-gray-300'>-1</button>
</div>
<div class='ml-4 mt-4 border rounded'>
    Bearing is {bearing} 
    <button onclick={() => bearing+=15} class='border w-12 bg-gray-300'>+15</button>
    <button onclick={() => bearing-=15} class='border w-12 bg-gray-300'>-15</button>
</div>
<div class='ml-4 mt-4 border rounded'>
    Degree Step is {deg} 
    <button onclick={() => deg+=5} class='border w-12 bg-gray-300'>+5</button>
    <button onclick={() => deg = Math.max(5, deg-5)} class='border w-12 bg-gray-300'>-5</button>
</div>
<div class='ml-4 mt-4 border rounded'>
    <PerimeterDemo1 {lwRatio} {bearing} {headRos} {elapsed} {deg} />
</div>