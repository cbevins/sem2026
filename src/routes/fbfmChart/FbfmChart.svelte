<script>
    import { FbfmChart } from '$lib/fbfmChart/index.js'
	import FbfmChartInput from './FbfmChartInput.svelte';
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'
    import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'

    console.clear()
    let chart = new FbfmChart()
    let active = {}
    for(let fuelKey of chart.fuelKeys)
        active[fuelKey] = false
    let activeFuels = $state(active)

    let results = $state(Object.values(chart.results))
    function update(input) {
        chart.update(input)
        results = Object.values(chart.results)
    }
    function onFuelSelect(active) {
        activeFuels = active
    }
    $inspect(activeFuels)
</script>

<div class="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 p-6 bg-gray-50 min-h-screen">
    <!-- Left Side: Input Form -->
    <div class="flex flex-col gap-4">
        <!-- Row 1 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            <FbfmChartInput {update} />
        </div>
        <!-- Row 2 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            <FbfmChartFuelSelector {onFuelSelect} {activeFuels}  />
        </div>
        <!-- Row 3 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            Units Selector
        </div>
    </div>

    <!-- Right Side: Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <h1 class="w-full text-center">Fire Spread Rate and Flame Length by Fuel Model</h1>
        <FbfmChartSvg {results} {activeFuels}/>
    </div>
</div>

<div class="mt-4 ml-4 mr-4 w-auto">
    <FbfmChartTable {results}/>
</div>