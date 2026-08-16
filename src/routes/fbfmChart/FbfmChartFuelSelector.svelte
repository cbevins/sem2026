<script>
    import Button from './Button.svelte'
    let {onFuelSelect, activeFuels} = $props()

    let currentSystemStatus = $state("Inactive");
    function handleParentAlert(details) {
        console.log
        activeFuels[details.label] = details.isOn 
        onFuelSelect(activeFuels)
        currentSystemStatus = details.label + (details.isOn ? "System Live 🚀" : "System Inactive 💤")
    }
</script>

<h1 class='w-full text-center'>Fuel Model Selector</h1>

<!-- Circular Toggle Instance -->
<Button label="gr1" onclick={handleParentAlert}
    onClasses = "bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-200 focus:ring-emerald-500",
    offClasses = "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300 focus:ring-gray-400"
/>
<Button label="gr2" onclick={handleParentAlert}
    onClasses =  "bg-emerald-600 hover:bg-emerald-700 text-white    shadow-md shadow-emerald-200 focus:ring-emerald-500",
    offClasses = "bg-gray-100    hover:bg-gray-200    text-gray-700 border border-gray-300       focus:ring-gray-400"
/>
<!-- Secondary descriptive feedback readout -->
<div class="mt-2 text-sm font-semibold text-gray-700">
    {currentSystemStatus}
</div>
