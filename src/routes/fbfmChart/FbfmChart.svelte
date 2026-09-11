<script>
    import { FbfmBehavior, FbfmInput } from './FbfmBehavior.js'
    import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'
	import FbfmChartInput from './FbfmChartInput.svelte'
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'
    import DraggableDialog from './DraggableDialog.svelte'

    let behavior = new FbfmBehavior()
    let rawData = $state(behavior.getData())
    let input = $state({...FbfmInput})

    // Build selected fuel object
    let selected = {}
    for(let fuelKey of behavior.fuelKeys)
        selected[fuelKey] = true
    let selectedFbfm = $state({...selected})

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
    function updatedInput(inp) {
        behavior.update(inp)
        rawData = behavior.getData()
        input = {...inp}
    }

	let fuelIsOpen = $state(false)
	let inputIsOpen = $state(false)
	let tableIsOpen = $state(false)

	function toggleFuelDialog() {
		fuelIsOpen = ! fuelIsOpen
	}

	function toggleInputDialog() {
		inputIsOpen = ! inputIsOpen
	}

	function toggleTableDialog() {
		tableIsOpen = ! tableIsOpen
	}

</script>

<!-- Display page -->
<div>
    <!-- Fuel Selector Dialog -->
    <button onclick={toggleFuelDialog}
		class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
	> {fuelIsOpen ? 'Close Fuel Selector' : 'Select Fuel Models'}</button>

	<DraggableDialog isOpen={fuelIsOpen} onclose={toggleFuelDialog}>
		{#snippet header()}
			<h3 class="m-0 text-sm font-bold text-gray-900">Select the Fuel Models to Display</h3>
		{/snippet}
        <FbfmChartFuelSelector {selectedFbfm} {onFuelToggle} {onGroupToggle}/>
	</DraggableDialog>

    <!-- Fuel Selector Dialog -->
    <button onclick={toggleInputDialog}
		class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
	> {inputIsOpen ? 'Close Input Form' : 'Change Fire Behavior Inputs'}</button>

	<DraggableDialog isOpen={inputIsOpen} onclose={toggleInputDialog}>
		{#snippet header()}
			<h3 class="m-0 text-sm font-bold text-gray-900">Update Fire Behavior Inputs</h3>
		{/snippet}
        <FbfmChartInput {updatedInput} />
	</DraggableDialog>

    <!-- Fuel Model Table Dialog -->
    <button onclick={toggleTableDialog}
		class="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
	> {tableIsOpen ? 'Close Fuel Model Table' : 'View Fuel Model Table'}</button>

	<DraggableDialog isOpen={tableIsOpen} onclose={toggleTableDialog}>
		{#snippet header()}
			<h3 class="m-0 text-sm font-bold text-gray-900">Fuel Model Properties under Current Fire Behavior Inputs</h3>
		{/snippet}
        <FbfmChartTable data={rawData}/>
	</DraggableDialog>

    <!-- Chart -->
    <div>
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
            <FbfmChartSvg data={rawData} {selectedFbfm} {input}/>
        </div>
    </div>

    <!-- Fuel Model Properties Table  -->
    <div class="mt-4 ml-4 mr-4 border w-auto text-center">
        Fuel Model Properties under Current Fire Behavior Inputs
        <FbfmChartTable data={rawData}/>
    </div>
</div>
