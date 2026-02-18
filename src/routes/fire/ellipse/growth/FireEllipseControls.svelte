<script>
    let {bearing, elapsed, headRos, lwRatio, degStep, onchange} = $props()

    function handler() { onchange({bearing, degStep, elapsed, headRos, lwRatio}) }

    function bearingChanged() {
        viewport.bearing = bearing
        content = viewport.drawSvg()
    }

    function degStepChanged() {
        content = viewport.drawSvg()
    }

    function elapsedChanged() {
        viewport.time = elapsed
        content = viewport.drawSvg()
    }

    function lwrChanged() {
        viewport.lwRatio = lwRatio
        content = viewport.drawSvg()
    }

    function rosChanged() {
        viewport.headRos = headRos
        content = viewport.drawSvg()
    }
</script>

<table class='ml-4 mt-4 border rounded'>
    <tbody class='text-xs'>
        <tr>
            <td class='px-1'>Length/Width</td>
            <td class='py-0.5'>
                <input id='lwRatio'bind:value={lwRatio} onchange={handler} type="number" min="1" max="10"
                    class='h-6 rounded w-full' />
            </td>
            <td class='px-1'>Head Spread Rate</td>
            <td class='py-0.5'>
                <input id='headRos' bind:value={headRos} onchange={handler} type="number" min="0.1" max="100"
                    class='h-6 rounded w-full' />
            </td>
        </tr>
        <tr>
            <td class='px-1'>Bearing</td>
            <td class='p-0.5'>
                <input id='bearing' bind:value={bearing} onchange={handler} type="number" min="-360" max="360" step="5"
                class='h-6 rounded w-full' />
            </td>
            <td class='px-1'>Degree Increment</td>
            <td class='py-0.5'>
                <input id='degStep' bind:value={degStep} onchange={handler} type="number" min="1" max="90" step="5"
                class='h-6 rounded w-full' />
            </td>
        </tr>
        <tr>
            <td class='px-1'>Elapsed Time</td>
            <td class='py-0.5'>
                <input id='elapsed'bind:value={elapsed} onchange={handler} type="number" min="1" max={60*24*7}
                class='h-6 rounded w-full' />
            </td>
            <td class='px-1'></td>
            <td class=''></td>
        </tr>
    </tbody>
</table>
