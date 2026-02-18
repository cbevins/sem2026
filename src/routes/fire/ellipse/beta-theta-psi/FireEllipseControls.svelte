<script>
    let {bearing, elapsed, headRos, lwRatio, degStep, showBeta, showTheta, showPsi,
        onchange} = $props()

    function handler() {
        onchange({bearing, degStep, elapsed, headRos, lwRatio, showBeta, showPsi, showTheta})
    }

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
        <tr>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-beta" type="checkbox" bind:checked={showBeta} onchange={handler}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-red-500 focus:ring-2 focus:ring-brand-soft" >
                    <label for="checkbox-beta" class="px-1 text-xs select-none">
                        Show Beta
                    </label>
                </div>
            </td>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-theta" type="checkbox" bind:checked={showTheta} onchange={handler}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-yellow-300 focus:ring-2 focus:ring-brand-soft">
                    <label for="checkbox-theta" class="px-1 text-xs select-none">
                        Show Theta
                    </label>
                </div>
            </td>
            <td class='px-1 pt-1'>
                <div class="flex items-center mb-2">
                    <input id="checkbox-psi" type="checkbox" bind:checked={showPsi} onchange={handler}
                        class="w-4 h-4 border border-default-medium rounded-xs bg-blue-600 focus:ring-2 focus:ring-brand-soft">
                    <label for="checkbox-psi" class="px-1 text-xs select-none">
                        Show Psi
                    </label>
                </div>
            </td>
        </tr>
    </tbody>
</table>
