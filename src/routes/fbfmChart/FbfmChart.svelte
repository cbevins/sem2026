<script>
    import { FbfmBehavior } from './FbfmBehavior.js'
    import FbfmChartFuelSelector from './FbfmChartFuelSelector.svelte'
	import FbfmChartInput from './FbfmChartInput.svelte'
    import FbfmChartSvg from './FbfmChartSvg.svelte'
    import FbfmChartTable from './FbfmChartTable.svelte'

    let behavior = new FbfmBehavior()
    let rawData = $state(behavior.getData())

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
    function updatedInput(input) {
        behavior.update(input)
        rawData = behavior.getData()
    }
    //------------------------------
    let fuelSelectorIsOpen = $state(false)
	let fuelSelectorDialogRef = $state()

	function toggleFuelSelectorDialog() {
		if (fuelSelectorIsOpen) {
			fuelSelectorIsOpen = false;
			fuelSelectorDialogRef?.close();
		} else {
			fuelSelectorIsOpen = true;
			// CRITICAL: .show() keeps the rest of the web page fully interactive
			fuelSelectorDialogRef?.show(); 
		}
	}
    //------------------------------
    let inputsIsOpen = $state(false)
	let inputsDialogRef = $state()

	function toggleInputsDialog() {
		if (inputsIsOpen) {
			inputsIsOpen = false;
			inputsDialogRef?.close();
		} else {
			inputsIsOpen = true;
			// CRITICAL: .show() keeps the rest of the web page fully interactive
			inputsDialogRef?.show(); 
		}
	}

</script>

<!-- Display page -->
<div>
    <!-- Fuel Selector Dialog -->
    <button onclick={toggleFuelSelectorDialog}
        class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition cursor-pointer"
    >
        {fuelSelectorIsOpen ? 'Close Fuel Models' : 'Select Fuel Models'}
    </button>

    <!-- Modeless Dialog Element
        - 'fixed' positioning classes (bottom-5 right-5) stop it from blocking the screen center
        - 'z-30' ensures no underlying elements show through
    -->
    <dialog bind:this={fuelSelectorDialogRef}
        class="fixed top-12 right-5 m-0 z-30 rounded-xl p-0 shadow-2xl border border-gray-200 bg-white open:flex open:flex-col"
    >
        <!-- Panel Layout Wrapper -->
        <div class="w-120 p-5">
            <!-- Panel Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 class="font-semibold text-gray-900">Select Fuel Models to Display</h3>
                <button onclick={() => { fuelSelectorIsOpen = false; fuelSelectorDialogRef?.close(); }}
                    class="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
                >
                    ✕
                </button>
            </div>
            <!-- Panel Content Body -->
            <div class="py-3 text-sm text-gray-600 leading-normal space-y-2">
                <FbfmChartFuelSelector {selectedFbfm} {onFuelToggle} {onGroupToggle}/>
            </div>
        </div>
    </dialog>

    <!-- Fire Behavior Inputs Dialog -->
    <button onclick={toggleInputsDialog}
        class="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg shadow-md transition cursor-pointer"
    >
        {inputsIsOpen ? 'Close Fire Behavior Inputs' : 'Edit Fire Behavior Inputs'}
    </button>

    <!-- Modeless Dialog Element
        - 'fixed' positioning classes (bottom-5 right-5) stop it from blocking the screen center
        - 'z-30' ensures no underlying elements show through
    -->
    <dialog bind:this={inputsDialogRef}
        class="fixed top-20 right-5 m-0 z-30 rounded-xl p-0 shadow-2xl border border-gray-200 bg-white open:flex open:flex-col"
    >
        <!-- Panel Layout Wrapper -->
        <div class="w-120 p-5">
            <!-- Panel Header -->
            <div class="flex items-center justify-between pb-3 border-b border-gray-100">
                <h3 class="font-semibold text-gray-900">Fire Behavior Inputs</h3>
                <button 
                    onclick={() => { inputsIsOpen = false; inputsDialogRef?.close(); }}
                    class="text-gray-400 hover:text-gray-600 text-sm font-bold cursor-pointer"
                >
                    ✕
                </button>
            </div>

            <!-- Panel Content Body -->
            <div class="py-3 text-sm text-gray-600 leading-normal space-y-2">
                <FbfmChartInput {updatedInput} />
            </div>
            
        </div>
    </dialog>

    <!-- Controls and Chart -->
    <div>
            <!-- Right Side: Chart -->
            <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <h1 class="w-full text-center">Fire Spread Rate and Flame Length by Fuel Model</h1>
                <FbfmChartSvg data={rawData} {selectedFbfm} />
            </div>
    </div>

    <!-- Fuel Model Properties Table  -->
    <div class="mt-4 ml-4 mr-4 w-auto text-center">
        Fuel Model Properties
        <FbfmChartTable data={rawData}/>
    </div>
</div>