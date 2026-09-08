<script>
    import { FbfmBehavior } from './FbfmBehavior.js'
    import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'
	import FbfmChartInput from './FbfmChartInput.svelte'
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'

	// let fuelSelectorDialogIsOpen = $state(false);
	// let fuelSelectorDialogRef = $state();
    let behavior = new FbfmBehavior()
    let rawData = $state(behavior.getData())

    // Build selected fuel object
    let selected = {}
    for(let fuelKey of behavior.fuelKeys)
        selected[fuelKey] = true
    let selectedFbfm = $state({...selected})

    // let chart = new FbfmChart()
	function toggleFuelSelector() {
		// if (fuelSelectorDialogIsOpen) {
		// 	fuelSelectorDialogIsOpen = false
		// 	fuelSelectorDialogRef?.close()
		// } else {
		// 	fuelSelectorDialogIsOpen = true
		// 	// CRITICAL: .show() keeps the rest of the web page fully interactive
		// 	fuelSelectorDialogRef?.show() 
		// }
	}

    // FbfmChartFuelSelector.svelte callback function
    function onFuelToggle(fuelKey) {
        selectedFbfm[fuelKey] = ! selectedFbfm[fuelKey]
        // console.log('Fuel', fuelKey, 'selected=', selectedFbfm[fuelKey])
    }

    function onGroupToggle(group, isSelected) {
        let selected = {...selectedFbfm}
        for(let fuelKey of group.fuelKeys) {
            // console.log(`Setting group ${group.groupKey} fuel ${fuelKey} to ${isActive}`)
            selected[fuelKey] = isSelected
        }
        selectedFbfm = {...selected}
    }

    // FbfmChartInput.svelte callback function
    function updatedInput(input) {
        behavior.update(input)
        rawData = behavior.getData()
    }
</script>

<!-- Display page -->
<div>

    <!-- Controls and Chart -->
    <div>
        <div class="grid grid-cols-1 md:grid-cols-[360px_1fr] gap-6 p-6 bg-gray-50 min-h-screen">

            <!-- Left Side: Controls -->
            <div class="flex flex-col gap-4">

                <!-- Row 1 contains Inputs Form -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    <FbfmChartInput {updatedInput} />
                </div>

                <!-- Row 2 contains Fuel Selector -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    <FbfmChartFuelSelector {selectedFbfm} {onFuelToggle} {onGroupToggle}/>
                </div>

                <!-- Row 3 contains Settings (units of measure, chart dimensions, axis bounds) -->
                <div class="bg-white p-2 rounded-lg shadow-md space-y-4">
                    Settings Go Here
                </div>
            </div>
                        
            <!-- Right Side: Chart -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <h1 class="w-full text-center">Fire Spread Rate and Flame Length by Fuel Model</h1>
                <FbfmChartSvg data={rawData} {selectedFbfm} />
            </div>

        </div>
    </div>

    <!-- Fuel Model Properties Table  -->
    <div class="mt-4 ml-4 mr-4 w-auto text-center">
        Fuel Model Properties
        <FbfmChartTable data={rawData}/>
    </div>
</div>