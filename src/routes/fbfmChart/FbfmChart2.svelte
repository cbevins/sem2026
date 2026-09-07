<script>
    import { FbfmChart } from './FbfmChart.js'
    import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'
	import FbfmChartInput from './FbfmChartInput.svelte'
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'

    let chart = new FbfmChart()

    // FbfmChartFuelSelector.svelte callback function
    function onFuelToggle(fuelKey) {
        chart.fuel[fuelKey].isActive = ! chart.fuel[fuelKey].isActive
        // console.log('Fuel', fuelKey, 'isActive=', chart.fuel[fuelKey].isActive)
    }

    // FbfmChartInput.svelte callback function
    function updatedInput(input) {
        chart.input = {...input}
        chart = chart.update(input)
    }
</script>

<!-- Display page -->
<div>
    <!-- Controls and Chart -->
    <div>
        <div class="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 p-6 bg-gray-50 min-h-screen">
            
            <!-- Right Side: Chart -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <h1 class="w-full text-center">Fire Spread Rate and Flame Length by Fuel Model</h1>
                <FbfmChartSvg {chart}/>
            </div>

            <!-- Left Side: Controls -->
            <div class="flex flex-col gap-4">

                <!-- Row 1 contains Inputs Form -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    <FbfmChartInput {updatedInput} />
                </div>

                <!-- Row 2 contains Fuel Selector -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    <FbfmChartFuelSelector {chart} {onFuelToggle}/>
                </div>

                <!-- Row 3 contains Settings (units of measure, chart dimensions, axis bounds) -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    Settings Go Here
                </div>
            </div>
        </div>
    </div>

    <!-- Fuel Model Properties Table  -->
    <div class="mt-4 ml-4 mr-4 w-auto text-center">
        Fuel Model Properties
        <FbfmChartTable {chart}/>
    </div>
</div>