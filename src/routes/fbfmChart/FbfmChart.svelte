<script>
    import { FbfmChart } from '$lib/fbfmChart/index.js'
	import FbfmChartInput from './FbfmChartInput.svelte';
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'
    // import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'

    console.clear()
    let chart = new FbfmChart()
    let data = $state(getData())

    // FbfmChartInput.svelte callback function
    function updatedInput(input) {
        chart.update(input)
        data = getData()
    }
    function getData() {
        const d = []
        for(let fuelKey of chart.fuelKeys) {
            // fuel{} has label, group, isActive, and raw properties
            const fuel = chart.fuel[fuelKey]
            // These are promoted and renamed from fuel{} for convenience
            const ros = fuel.fireBehavior.headingSpreadRate
            const fli = fuel.fireBehavior.firelineIntensity
            const flame = fuel.fireBehavior.flameLength
            // The following are only shown in the table and may be dropped
            const deadMext = fuel.fuelIgnition.dead.mext
            const depth = fuel.fuelBed.depth
            const liveMext = fuel.fuelIgnition.live.mext
            const savr = fuel.fuelBed.savr
            const wsrf = fuel.fuelBed.midflameWsrf
            d.push({fuel, fuelKey, ros, fli, flame, deadMext, depth, liveMext, savr, wsrf})
        }
        return d
    }
    // function onFuelSelect(active) {
    //     activeFuels = active
    // }
</script>

<div class="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 p-6 bg-gray-50 min-h-screen">
    <!-- Left Side: Input Form -->
    <div class="flex flex-col gap-4">
        <!-- Row 1 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            <FbfmChartInput {updatedInput} />
        </div>
        <!-- Row 2 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            <!-- <FbfmChartFuelSelector {onFuelSelect} {activeFuels}  /> -->
        </div>
        <!-- Row 3 -->
        <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
            <!-- Units Selector -->
        </div>
    </div>

    <!-- Right Side: Table -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
    <h1 class="w-full text-center">Fire Spread Rate and Flame Length by Fuel Model</h1>
        <FbfmChartSvg {data}/>
    </div>
</div>

<div class="mt-4 ml-4 mr-4 w-auto">
    <FbfmChartTable {data}/>
</div>
